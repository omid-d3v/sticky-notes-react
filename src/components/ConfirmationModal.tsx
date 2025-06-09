import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', zIndex: 1000, direction: 'rtl',
  };

  const modalContentStyle: React.CSSProperties = {
    backgroundColor: 'white', padding: '25px', borderRadius: '8px',
    textAlign: 'center', fontFamily: "'Vazirmatn', sans-serif",
    maxWidth: '400px', width: '90%'
  };

  const buttonStyle: React.CSSProperties = {
    border: 'none', padding: '10px 20px', borderRadius: '5px',
    cursor: 'pointer', fontWeight: 'bold'
  };

  return (
    <div style={modalOverlayStyle} onClick={onCancel}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <p style={{ marginBottom: '25px', fontSize: '1.1rem' }}>{message}</p>
        <div>
          <button style={{ ...buttonStyle, backgroundColor: '#f44336', color: 'white', marginLeft: '10px' }} onClick={onConfirm}>
            بله، حذف کن
          </button>
          <button style={{ ...buttonStyle, backgroundColor: '#ccc' }} onClick={onCancel}>
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;