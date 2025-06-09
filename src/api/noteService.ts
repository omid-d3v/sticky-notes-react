import type { Note, NoteData } from '../types';
import { auth } from '../firebase-config';

const PROXY_BASE_URL = import.meta.env.VITE_PROXY_BASE_URL;

const getAuthHeaders = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("کاربر لاگین نکرده است.");
    const token = await user.getIdToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

// **تابع جدید**
export const getBoards = async (): Promise<string[]> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${PROXY_BASE_URL}/boards`, { headers });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "خطای ناشناخته" }));
        throw new Error(errorData.error || `خطا در دریافت لیست تخته‌ها`);
    }
    return response.json();
};

// توابع دیگر بدون تغییر...
export const getNotesByBoard = async (boardId: string): Promise<Note[]> => {
  const response = await fetch(`${PROXY_BASE_URL}/notes/${boardId}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "خطای ناشناخته" }));
    throw new Error(errorData.error || `خطای سرور: ${response.status}`);
  }
  return response.json();
};
export const addNote = async (boardId: string, noteData: NoteData): Promise<any> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${PROXY_BASE_URL}/notes/${boardId}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(noteData),
  });
  if (!response.ok) throw new Error('خطا در افزودن یادداشت');
  return response.json();
};
// ... توابع update و delete ...
export const updateNote = async (boardId: string, noteId: string, noteData: NoteData): Promise<any> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${PROXY_BASE_URL}/notes/${boardId}/${noteId}`, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(noteData),
  });
  if (!response.ok) throw new Error('خطا در به‌روزرسانی یادداشت');
  return response.json();
};
export const deleteNote = async (boardId: string, noteId: string): Promise<any> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${PROXY_BASE_URL}/notes/${boardId}/${noteId}`, {
    method: 'DELETE',
    headers: headers
  });
  if (!response.ok) throw new Error('خطا در حذف یادداشت');
  return response.json();
};