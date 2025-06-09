export type Note = {
  id: string;
  name: string;
  message: string;
  imageURL?: string | null;
  timestamp?: {
    _seconds: number;
    _nanoseconds: number;
  } | string;
};

export type NoteData = {
  name: string;
  message: string;
  imageURL?: string | null;
};