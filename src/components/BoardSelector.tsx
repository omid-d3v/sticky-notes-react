import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BoardSelector: React.FC = () => {
  const [inputId, setInputId] = useState('');
  const navigate = useNavigate();

  const sanitizeBoardId = (id: string): string => {
    return id.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitized = sanitizeBoardId(inputId);
    if (sanitized) {
      navigate(`/manage?boardId=${sanitized}`);
    } else {
      alert('لطفاً یک شناسه معتبر برای تخته وارد کنید.');
    }
  };

  return (
    <div className="board-selector-container" style={{ margin: 'auto', maxWidth: '800px' }}>
      <h1 className="section-title">انتخاب یا ایجاد تخته یادداشت</h1>
      <form id="board-selector-form" onSubmit={handleSubmit}>
        <label htmlFor="boardIdInput">شناسه تخته (انگلیسی، بدون فاصله، مثلا: tavalod-ali-1403):</label>
        <div style={{display: 'flex', gap: '10px'}}>
            <input
              type="text"
              id="boardIdInput"
              style={{flexGrow: 1}}
              placeholder="شناسه تخته را وارد کنید"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
            />
            <button type="submit">برو به این تخته / ایجاد کن</button>
        </div>
      </form>
    </div>
  );
};

export default BoardSelector;