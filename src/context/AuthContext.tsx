/*
 * =================================================================
 * فایل اصلاح‌شده: src/context/AuthContext.tsx
 * مسئولیت: ایجاد یک Context برای مدیریت وضعیت کاربر در کل برنامه
 * نکته: کلمه کلیدی `type` به import اضافه شد تا خطا رفع شود.
 * =================================================================
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
// رفع خطا: کلمه کلیدی type به اینجا اضافه شد
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../firebase-config';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ currentUser: null, loading: true });

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // این تابع به تغییرات وضعیت لاگین کاربر گوش می‌دهد
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe; // کامپوننت در زمان unmount، از گوش دادن صرف نظر می‌کند
  }, []);

  const value = {
    currentUser,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
