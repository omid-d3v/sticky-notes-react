import React from 'react';
import type { Note } from '../types';

interface AdminNoteItemProps {
    note: Note;
    onEdit: (note: Note) => void;
    onDelete: (noteId: string, noteName: string) => void;
}

const AdminNoteItem: React.FC<AdminNoteItemProps> = ({note, onEdit, onDelete}) => {
    return (
        <div className="admin-note-item">
            <div className="note-content">
                <div className="note-name">{note.name}</div>
                <div className="note-message">{note.message}</div>
                {note.imageURL && <div className="note-image-url" style={{fontSize: '0.9rem', color: '#666'}}><strong>عکس:</strong> {note.imageURL}</div>}
            </div>
            <div className="note-actions">
                <button className="edit-button" onClick={() => onEdit(note)}>ویرایش</button>
                <button className="delete-button" onClick={() => onDelete(note.id, note.name)}>حذف</button>
            </div>
        </div>
    );
};

export default AdminNoteItem;