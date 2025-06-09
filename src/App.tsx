import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import BoardView from './pages/BoardView';
import ManageView from './pages/ManageView'; // این همان BoardDetailPage خواهد بود
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import BoardListPage from './pages/BoardListPage';
import './index.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* مسیرهای عمومی */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/board/:boardId" element={<BoardView />} />
          <Route path="/login" element={<LoginPage />} />

          {/* مسیرهای مدیریت محافظت‌شده */}
          <Route 
            path="/manage" 
            element={<ProtectedRoute><BoardListPage /></ProtectedRoute>} 
          />
          <Route 
            path="/manage/:boardId" 
            element={<ProtectedRoute><ManageView /></ProtectedRoute>} 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;