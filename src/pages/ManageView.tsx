import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; 
import { signOut } from 'firebase/auth';
import { auth } from '../firebase-config';
import { useAuth } from '../context/AuthContext';
import { getNotesByBoard, addNote, updateNote, deleteNote } from '../api/noteService';
import type { Note as NoteType, NoteData } from '../types';
import NoteForm from '../components/NoteForm';
import AdminNoteItem from '../components/AdminNoteItem';
import ConfirmationModal from '../components/ConfirmationModal';
import MessageBox from '../components/MessageBox';
import Footer from '../components/Footer';

const ManageView: React.FC = () => {
    const { boardId } = useParams<{ boardId: string }>(); 
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    
    const [notes, setNotes] = useState<NoteType[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingNote, setEditingNote] = useState<NoteType | null>(null);
    const [deletingNote, setDeletingNote] = useState<{id: string; name: string} | null>(null);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    const loadNotesForAdmin = useCallback(async () => {
        if (!boardId) return;
        setLoading(true);
        try {
            const fetchedNotes = await getNotesByBoard(boardId);
            setNotes(fetchedNotes);
        } catch (err: any) {
            setMessage({text: `خطا در بارگذاری لیست: ${err.message}`, type: 'error'});
        } finally {
            setLoading(false);
        }
    }, [boardId]);

    useEffect(() => {
        loadNotesForAdmin();
    }, [loadNotesForAdmin]);
    
    const handleFormSubmit = async (noteData: NoteData) => {
        if (!boardId) return;
        setIsSubmitting(true);
        try {
            if (editingNote) {
                await updateNote(boardId, editingNote.id, noteData);
            } else {
                await addNote(boardId, noteData);
            }
            setEditingNote(null);
            loadNotesForAdmin();
        } catch (err: any) {
            setMessage({text: `خطا در ذخیره پیام: ${err.message}`, type: 'error'});
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleConfirmDelete = async () => {
        if (!deletingNote || !boardId) return;
        try {
            await deleteNote(boardId, deletingNote.id);
            setDeletingNote(null);
            loadNotesForAdmin();
        } catch (err: any) {
            setMessage({text: `خطا در حذف پیام: ${err.message}`, type: 'error'});
            setDeletingNote(null);
        }
    };

    if (!boardId) {
        return <div className="page-container">شناسه تخته مشخص نشده است. <Link to="/manage">بازگشت به لیست تخته‌ها</Link></div>;
    }

    return (
        <div className="page-container">
            <div id="current-board-info">
                <Link to="/manage" style={{fontWeight: 'bold'}}> &larr; بازگشت به لیست تخته‌ها</Link>
                <div className="user-info">
                    <span>کاربر: <strong>{currentUser?.email}</strong></span>
                </div>
                <button onClick={handleLogout} className="logout-btn">خروج</button>
            </div>
            
            <ConfirmationModal isOpen={!!deletingNote} message={`آیا از حذف پیام "${deletingNote?.name}" مطمئن هستید؟`} onConfirm={handleConfirmDelete} onCancel={() => setDeletingNote(null)} />
        
            <div className="form-container">
                <h2 className="section-title">{editingNote ? '📝 ویرایش پیام' : `💌 افزودن پیام به تخته "${boardId}"`}</h2>
                <MessageBox message={message?.text || null} type={message?.type || 'success'} />
                <NoteForm editingNote={editingNote} isSubmitting={isSubmitting} onSubmit={handleFormSubmit} onCancelEdit={() => setEditingNote(null)} />
            </div>

            <div id="admin-notes-list-container">
                <h2 className="section-title">لیست پیام‌ها</h2>
                {loading ? <p style={{textAlign: 'center'}}>در حال بارگذاری...</p> : (
                    <div id="admin-notes-list">
                        {notes.length === 0 && <p style={{textAlign: 'center'}}>هنوز پیامی برای این تخته ثبت نشده است.</p>}
                        {notes.map(note => (
                            <AdminNoteItem key={note.id} note={note} onEdit={(noteToEdit) => { setEditingNote(noteToEdit); window.scrollTo({top: 0, behavior: 'smooth'}); }} onDelete={(noteId, noteName) => setDeletingNote({id: noteId, name: noteName})} />
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ManageView;
