import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getNotesByBoard } from '../api/noteService';
import type { Note as NoteType } from '../types';
import Note from '../components/Note';
import Footer from '../components/Footer';
import { useAutoScroll } from '../hooks/useAutoScroll';

const BoardView: React.FC = () => {
  const { boardId = 'default-birthday-board' } = useParams<{ boardId?: string }>();
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useAutoScroll(notes.length, !loading && !error);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedNotes = await getNotesByBoard(boardId);
        setNotes(fetchedNotes);
      } catch (err: any) {
        setError(err.message || 'خطا در بارگذاری یادداشت‌ها');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [boardId]);

  const displayBoardId = boardId === 'default-birthday-board' ? 'عمومی' : boardId;

  return (
    <div style={{ padding: '20px' }}>
      <header>
        <h1 className="app-title">🎉 پیام‌های تبریک برای تخته {displayBoardId}! 🎂</h1>
        <div className="board-info">
          <span>شما در حال مشاهده تخته: <strong>{displayBoardId}</strong></span>
          <Link to={`/manage?boardId=${boardId}`} style={{marginRight: '15px'}}>رفتن به صفحه مدیریت</Link>
        </div>
      </header>

      <main>
        <div id="notes-container">
          {loading && <p style={{ textAlign: 'center', color: '#555', fontSize: '1.2rem' }}>در حال بارگذاری پیام‌ها...</p>}
          {error && <p style={{ color: 'red', textAlign: 'center', fontSize: '1.2rem' }}>{error}</p>}
          {!loading && !error && notes.length === 0 && (
            <p style={{ textAlign: 'center', color: '#555', fontSize: '1.2rem' }}>
              هنوز هیچ پیامی برای این تخته ثبت نشده است.
            </p>
          )}
          {!loading && notes.map((note, index) => (
            <Note key={note.id} note={note} index={index} />
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BoardView;