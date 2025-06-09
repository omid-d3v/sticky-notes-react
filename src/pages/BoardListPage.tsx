import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase-config';
import { getBoards } from '../api/noteService';
import Footer from '../components/Footer';
import MessageBox from '../components/MessageBox';

const BoardListPage: React.FC = () => {
  const [boards, setBoards] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newBoardId, setNewBoardId] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        if (auth.currentUser) {
            const boardIds = await getBoards();
            setBoards(boardIds);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBoards();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const sanitizeBoardId = (id: string) => id.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedId = sanitizeBoardId(newBoardId);
    if (sanitizedId) {
      navigate(`/manage/${sanitizedId}`);
    } else {
      alert("لطفاً یک شناسه معتبر وارد کنید.");
    }
  };

  return (
    <div className="page-container">
      <div id="current-board-info">
        <div className="user-info">
          <span>کاربر: <strong>{currentUser?.email}</strong></span>
        </div>
        <button onClick={handleLogout} className="logout-btn">خروج</button>
      </div>
      
      <div className="board-selector-container">
        <h2 className="section-title">ایجاد تخته جدید</h2>
        <form onSubmit={handleCreateBoard} id="board-selector-form">
            <div className="form-group">
              <label htmlFor="boardIdInput">شناسه تخته جدید (انگلیسی، بدون فاصله):</label>
              <input
                type="text"
                id="boardIdInput"
                placeholder="مثلا: tavalod-omid-1404"
                value={newBoardId}
                onChange={(e) => setNewBoardId(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">ایجاد و مدیریت</button>
        </form>
      </div>

      <div id="admin-notes-list-container">
        <h2 className="section-title">تخته‌های فعال</h2>
        {loading && <p style={{textAlign: 'center'}}>در حال بارگذاری لیست تخته‌ها...</p>}
        {error && <MessageBox message={error} type="error" />}
        {!loading && boards.length === 0 && <p style={{textAlign: 'center'}}>هنوز هیچ تخته‌ای ساخته نشده است.</p>}
        <div id="admin-notes-list">
          {boards.map(boardId => (
            <div key={boardId} className="admin-note-item">
              <span className="board-id">{boardId}</span>
              <div className="note-actions">
                 <Link to={`/board/${boardId}`} target="_blank" className="btn action-btn btn-view">مشاهده</Link>
                 <Link to={`/manage/${boardId}`} className="btn action-btn btn-manage">مدیریت</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default BoardListPage;
