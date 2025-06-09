import React from 'react';

interface MessageBoxProps {
  message: string | null;
  type: 'success' | 'error';
}

const MessageBox: React.FC<MessageBoxProps> = ({ message, type }) => {
  if (!message) return null;
  return (
    <div id="message-box" className={type} style={{ display: 'block' }}>
      {message}
    </div>
  );
};

export default MessageBox;