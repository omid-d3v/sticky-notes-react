import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase-config';
import { getBoards } from '../api/noteService'; // We will add getBoards function
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
        const boardIds = await getBoards();
        setBoards(boardIds);
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
      <div id="current-board-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>کاربر: {currentUser?.email}</span>
        <button onClick={handleLogout} style={{ all: 'unset', cursor: 'pointer', color: 'red', fontWeight: 'bold' }}>خروج</button>
      </div>
      
      <div className="board-selector-container">
        <h1 className="section-title">ایجاد تخته جدید</h1>
        <form onSubmit={handleCreateBoard} id="board-selector-form">
            <label htmlFor="boardIdInput">شناسه تخته جدید (انگلیسی، بدون فاصله):</label>
            <div style={{display: 'flex', gap: '10px'}}>
              <input
                type="text"
                id="boardIdInput"
                style={{flexGrow: 1}}
                placeholder="مثلا: tavalod-omid-1404"
                value={newBoardId}
                onChange={(e) => setNewBoardId(e.target.value)}
              />
              <button type="submit">ایجاد و مدیریت</button>
            </div>
        </form>
      </div>

      <div id="admin-notes-list-container">
        <h2 style={{ textAlign: 'center', color: '#3f51b5', marginBottom: '20px' }}>تخته‌های فعال</h2>
        {loading && <p style={{textAlign: 'center'}}>در حال بارگذاری لیست تخته‌ها...</p>}
        {error && <MessageBox message={error} type="error" />}
        {!loading && boards.length === 0 && <p style={{textAlign: 'center'}}>هنوز هیچ تخته‌ای ساخته نشده است.</p>}
        <div id="admin-notes-list">
          {boards.map(boardId => (
            <div key={boardId} className="admin-note-item" style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <span style={{fontWeight: 'bold', fontSize: '1.1rem'}}>{boardId}</span>
              <div className="note-actions">
                 <Link to={`/board/${boardId}`} target="_blank" className="edit-button" style={{textDecoration:'none', marginLeft: '10px'}}>مشاهده</Link>
                 <Link to={`/manage/${boardId}`} className="edit-button" style={{textDecoration:'none', backgroundColor: '#5cb85c'}}>مدیریت</Link>
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