import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase-config';
import { useAuth } from '../context/AuthContext';
import { getNotesByBoard, addNote, updateNote, deleteNote } from '../api/noteService';
import type { Note as NoteType, NoteData } from '../types';
import BoardSelector from '../components/BoardSelector';
import NoteForm from '../components/NoteForm';
import AdminNoteItem from '../components/AdminNoteItem';
import ConfirmationModal from '../components/ConfirmationModal';
import MessageBox from '../components/MessageBox';
import Footer from '../components/Footer';

const ManageView: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const boardIdFromUrl = searchParams.get('boardId');

    const [notes, setNotes] = useState<NoteType[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [editingNote, setEditingNote] = useState<NoteType | null>(null);
    const [deletingNote, setDeletingNote] = useState<{id: string; name: string} | null>(null);
    
    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Error signing out: ", error);
            alert('خطا در خروج از حساب کاربری.');
        }
    };

    const loadNotesForAdmin = useCallback(async () => {
        if (!boardIdFromUrl) return;
        setLoading(true);
        try {
            const fetchedNotes = await getNotesByBoard(boardIdFromUrl);
            setNotes(fetchedNotes);
        } catch (err: any) {
            setMessage({text: `خطا در بارگذاری لیست: ${err.message}`, type: 'error'});
        } finally {
            setLoading(false);
        }
    }, [boardIdFromUrl]);

    useEffect(() => {
        loadNotesForAdmin();
    }, [loadNotesForAdmin]);
    
    const showMessage = (text: string, type: 'success' | 'error') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 4000);
    };

    const handleFormSubmit = async (noteData: NoteData) => {
        if (!boardIdFromUrl) return;
        
        setIsSubmitting(true);
        try {
            if (editingNote) {
                await updateNote(boardIdFromUrl, editingNote.id, noteData);
                showMessage('پیام با موفقیت به‌روزرسانی شد!', 'success');
            } else {
                await addNote(boardIdFromUrl, noteData);
                showMessage('پیام شما با موفقیت ارسال شد!', 'success');
            }
            setEditingNote(null);
            loadNotesForAdmin();
        } catch (err: any) {
            showMessage(`خطا در ذخیره پیام: ${err.message}`, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleConfirmDelete = async () => {
        if (!deletingNote || !boardIdFromUrl) return;
        try {
            await deleteNote(boardIdFromUrl, deletingNote.id);
            showMessage('پیام با موفقیت حذف شد.', 'success');
            setDeletingNote(null);
            loadNotesForAdmin();
        } catch (err: any) {
            showMessage(`خطا در حذف پیام: ${err.message}`, 'error');
            setDeletingNote(null);
        }
    };

    if (!boardIdFromUrl) {
        return (
            <div className="page-container">
                <div style={{textAlign: 'center', marginBottom: '20px'}}>
                  کاربر: {currentUser?.email} | <button onClick={handleLogout} style={{all:'unset', cursor:'pointer', color:'red'}}>خروج</button>
                </div>
                <BoardSelector />
            </div>
        );
    }

    return (
        <div className="page-container">
             <div id="current-board-info">
                 <span>کاربر: {currentUser?.email}</span> | <button onClick={handleLogout} style={{all:'unset', cursor:'pointer', color:'red', fontWeight:'bold'}}>خروج</button>
            </div>
            
            <ConfirmationModal 
              isOpen={!!deletingNote}
              message={`آیا از حذف پیام "${deletingNote?.name}" مطمئن هستید؟`}
              onConfirm={handleConfirmDelete}
              onCancel={() => setDeletingNote(null)}
            />
        
            <div id="current-board-info">
                شما در حال مدیریت تخته: <strong>{boardIdFromUrl}</strong> هستید. <br />
                <Link to={`/board/${boardIdFromUrl}`} target="_blank">مشاهده عمومی این تخته</Link> | 
                <button onClick={() => navigate('/manage')} style={{all: 'unset', color: '#1976d2', textDecoration: 'underline', cursor: 'pointer'}}>انتخاب تخته دیگر</button>
            </div>
            <div className="form-container">
                <h1 className="section-title">{editingNote ? '📝 ویرایش پیام' : '💌 افزودن پیام به تخته'}</h1>
                <MessageBox message={message?.text || null} type={message?.type || 'success'} />
                <NoteForm 
                    editingNote={editingNote}
                    isSubmitting={isSubmitting}
                    onSubmit={handleFormSubmit}
                    onCancelEdit={() => setEditingNote(null)}
                />
            </div>

            <div id="admin-notes-list-container">
                <h2 style={{ textAlign: 'center', color: '#3f51b5', marginBottom: '20px' }}>لیست پیام‌ها</h2>
                {loading ? <p style={{textAlign: 'center'}}>در حال بارگذاری...</p> : (
                    <div id="admin-notes-list">
                        {notes.length === 0 && <p style={{textAlign: 'center'}}>هنوز پیامی ثبت نشده است.</p>}
                        {notes.map(note => (
                            <AdminNoteItem
                                key={note.id}
                                note={note}
                                onEdit={(noteToEdit) => {
                                    setEditingNote(noteToEdit);
                                    window.scrollTo({top: 0, behavior: 'smooth'});
                                }}
                                onDelete={(noteId, noteName) => setDeletingNote({id: noteId, name: noteName})}
                            />
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ManageView;