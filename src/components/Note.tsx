import React from 'react';
import { gsap } from 'gsap';
import type { Note as NoteType } from '../types';

interface NoteProps {
  note: NoteType;
  index: number;
}

const Note: React.FC<NoteProps> = ({ note, index }) => {
  const noteRef = React.useRef<HTMLDivElement>(null);
  const randomRotation = React.useMemo(() => (Math.random() - 0.5) * 8, []);

  React.useEffect(() => {
    if (noteRef.current) {
      gsap.fromTo(
        noteRef.current,
        { opacity: 0, scale: 0.3, y: 60, rotation: randomRotation - 20 },
        {
          duration: 0.8,
          opacity: 1,
          scale: 1,
          y: 0,
          rotation: randomRotation,
          ease: 'elastic.out(1, 0.7)',
          delay: index * 0.15,
        }
      );
    }
  }, [index, randomRotation]);

  const getFormattedTimestamp = (timestamp: any): string => {
    if (timestamp && timestamp._seconds) {
      return new Date(timestamp._seconds * 1000).toLocaleString('fa-IR', {
        day: 'numeric',
        month: 'long',
      });
    }
    return 'نامشخص';
  };

  const nameInitial = note.name.substring(0, 1).toUpperCase();
  const avatarSrc = note.imageURL || `https://placehold.co/60x60/FFC107/FFFFFF?text=${nameInitial}&font=Vazirmatn`;

  return (
    <div className="note" ref={noteRef} style={{ transform: `rotate(${randomRotation}deg)` }}>
      <div className="pin"></div>
      <div className="avatar-container">
        <img
          src={avatarSrc}
          alt={`آواتار ${note.name}`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null; // Prevent infinite loop
            target.src = `https://placehold.co/60x60/4CAF50/FFFFFF?text=${nameInitial}&font=Vazirmatn`;
          }}
        />
      </div>
      <div className="name">{note.name}</div>
      <p className="message">{note.message}</p>
      <div className="timestamp">{getFormattedTimestamp(note.timestamp)}</div>
    </div>
  );
};

export default Note;