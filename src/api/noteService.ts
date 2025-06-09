import type { Note, NoteData } from '../types';
import { auth } from '../firebase-config';

// Reading proxy base URL from environment variables
const PROXY_BASE_URL = import.meta.env.VITE_PROXY_BASE_URL;

if (!PROXY_BASE_URL) {
    console.warn("VITE_PROXY_BASE_URL is not set. Falling back to default.");
}

const getAuthHeaders = async () => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("کاربر لاگین نکرده است.");
    }
    const token = await user.getIdToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

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
    headers: headers,
    body: JSON.stringify(noteData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "خطای ناشناخته" }));
    throw new Error(errorData.error || `خطای سرور: ${response.status}`);
  }
  return response.json();
};

export const updateNote = async (boardId: string, noteId: string, noteData: NoteData): Promise<any> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${PROXY_BASE_URL}/notes/${boardId}/${noteId}`, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(noteData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "خطای ناشناخته" }));
    throw new Error(errorData.error || `خطای سرور: ${response.status}`);
  }
  return response.json();
};

export const deleteNote = async (boardId: string, noteId: string): Promise<any> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${PROXY_BASE_URL}/notes/${boardId}/${noteId}`, {
    method: 'DELETE',
    headers: headers
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "خطای ناشناخته" }));
    throw new Error(errorData.error || `Server error: ${response.status}`);
  }
  return response.json();
};