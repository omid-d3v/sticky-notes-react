import React, { useState, useEffect } from 'react';
import type { Note, NoteData } from '../types';

interface NoteFormProps {
  editingNote: Note | null;
  isSubmitting: boolean;
  onSubmit: (noteData: NoteData) => void;
  onCancelEdit: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ editingNote, isSubmitting, onSubmit, onCancelEdit }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [imageURL, setImageURL] = useState('');

  useEffect(() => {
    if (editingNote) {
      setName(editingNote.name);
      setMessage(editingNote.message);
      setImageURL(editingNote.imageURL || '');
    } else {
      setName('');
      setMessage('');
      setImageURL('');
    }
  }, [editingNote]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) {
      // Parent component will show the message
      return;
    }
    onSubmit({ name, message, imageURL: imageURL || null });
  };

  return (
    <form id="note-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">نام شما:</label>
        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} placeholder="مثلا: بهترین دوست" required />
      </div>
      <div className="form-group">
        <label htmlFor="message">پیام تبریک:</label>
        <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} placeholder="یه عالمه آرزوی خوب..." rows={4} required></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="imageURL">لینک عکس پروفایل (اختیاری):</label>
        <input type="url" id="imageURL" value={imageURL} onChange={e => setImageURL(e.target.value)} placeholder="https://example.com/avatar.jpg" />
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'در حال پردازش...' : (editingNote ? 'به‌روزرسانی پیام 🔄' : 'ارسال پیام ✨')}
      </button>
      {editingNote && (
        <button type="button" className="cancel-edit-button" style={{ display: 'inline-block', marginTop: '10px' }} onClick={onCancelEdit}>لغو ویرایش</button>
      )}
    </form>
  );
};

export default NoteForm;