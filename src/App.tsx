import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import BoardView from './pages/BoardView';
import ManageView from './pages/ManageView';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/board" replace />} />
          <Route path="/board/:boardId" element={<BoardView />} />
          <Route path="/board" element={<BoardView />} />
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/manage" 
            element={
              <ProtectedRoute>
                <ManageView />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<div style={{textAlign: 'center', padding: '50px', fontSize: '2rem'}}>404 - صفحه مورد نظر یافت نشد</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;