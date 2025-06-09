import React, { useState, useEffect, useCallback } from 'react';
// حالا boardId از useParams خوانده می‌شود، نه useSearchParams
import { useParams, Link, useNavigate } from 'react-router-dom'; 
import { signOut } from 'firebase/auth';
import { auth } from '../firebase-config';
import { useAuth } from '../context/AuthContext';
// ... بقیه ایمپورت‌ها ...
import { getNotesByBoard, addNote, updateNote, deleteNote } from '../api/noteService';
import type { Note as NoteType, NoteData } from '../types';
import NoteForm from '../components/NoteForm';
import AdminNoteItem from '../components/AdminNoteItem';
import ConfirmationModal from '../components/ConfirmationModal';
import MessageBox from '../components/MessageBox';
import Footer from '../components/Footer';

const ManageView: React.FC = () => {
    // تغییر اصلی اینجاست!
    const { boardId } = useParams<{ boardId: string }>(); 
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    
    // بقیه state ها و توابع مثل قبل هستند...
    const [notes, setNotes] = useState<NoteType[]>([]);
    const [loading, setLoading] = useState(false);
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
        // ... بقیه منطق بدون تغییر
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
    
    const showMessage = (text: string, type: 'success' | 'error') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 4000);
    };

    const handleFormSubmit = async (noteData: NoteData) => {
        if (!boardId) return;
        // ... بقیه منطق بدون تغییر
        setIsSubmitting(true);
        try {
            if (editingNote) {
                await updateNote(boardId, editingNote.id, noteData);
                showMessage('پیام با موفقیت به‌روزرسانی شد!', 'success');
            } else {
                await addNote(boardId, noteData);
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
        if (!deletingNote || !boardId) return;
        // ... بقیه منطق بدون تغییر
        try {
            await deleteNote(boardId, deletingNote.id);
            showMessage('پیام با موفقیت حذف شد.', 'success');
            setDeletingNote(null);
            loadNotesForAdmin();
        } catch (err: any) {
            showMessage(`خطا در حذف پیام: ${err.message}`, 'error');
            setDeletingNote(null);
        }
    };

    if (!boardId) {
        return <div className="page-container">شناسه تخته مشخص نشده است. <Link to="/manage">بازگشت به لیست تخته‌ها</Link></div>;
    }

    // JSX صفحه مدیریت جزئیات
    return (
        <div className="page-container">
            <div id="current-board-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Link to="/manage"> &larr; بازگشت به لیست تخته‌ها</Link>
                </div>
                <span>کاربر: {currentUser?.email}</span>
                <button onClick={handleLogout} style={{all:'unset', cursor:'pointer', color:'red', fontWeight:'bold'}}>خروج</button>
            </div>
            
            <ConfirmationModal isOpen={!!deletingNote} message={`آیا از حذف پیام "${deletingNote?.name}" مطمئن هستید؟`} onConfirm={handleConfirmDelete} onCancel={() => setDeletingNote(null)} />
        
            <div id="current-board-info">
                شما در حال مدیریت تخته: <strong>{boardId}</strong> هستید. | <Link to={`/board/${boardId}`} target="_blank">مشاهده عمومی</Link>
            </div>

            <div className="form-container">
                <h1 className="section-title">{editingNote ? '📝 ویرایش پیام' : `💌 افزودن پیام به تخته "${boardId}"`}</h1>
                <MessageBox message={message?.text || null} type={message?.type || 'success'} />
                <NoteForm editingNote={editingNote} isSubmitting={isSubmitting} onSubmit={handleFormSubmit} onCancelEdit={() => setEditingNote(null)} />
            </div>

            <div id="admin-notes-list-container">
                <h2 style={{ textAlign: 'center', color: '#3f51b5', marginBottom: '20px' }}>لیست پیام‌ها</h2>
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

export default ManageView; // ManageView is now our detail page
