import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

interface BirthdayCardModalProps {
  isOpen: boolean;
  boardId: string;
  onClose: () => void;
}

// Template configuration
const TEMPLATE_PATH = "/birthcard-template.png";
const BASE_WIDTH = 594;
const BASE_HEIGHT = 840;
const QR_BOX_OFFSET_X = 217; // Updated for centered QR position
const QR_BOX_OFFSET_Y = 518; // Updated based on the design  
const QR_BOX_SIZE = 160; // Slightly smaller QR size
const SCALE_FACTOR = 2;

// Fallback template matching the provided design
const createFallbackTemplate = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  canvas.width = BASE_WIDTH;
  canvas.height = BASE_HEIGHT;
  
  // Create cream/beige background
  ctx.fillStyle = '#F5F2E8';
  ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);
  
  // Draw balloons
  // Left yellow balloon
  ctx.beginPath();
  ctx.arc(80, 90, 35, 0, 2 * Math.PI);
  ctx.fillStyle = '#FFD700';
  ctx.fill();
  ctx.strokeStyle = '#E6C200';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Left balloon highlight
  ctx.beginPath();
  ctx.arc(70, 80, 8, 0, 2 * Math.PI);
  ctx.fillStyle = '#FFFF80';
  ctx.fill();
  
  // Left balloon string
  ctx.beginPath();
  ctx.moveTo(80, 125);
  ctx.quadraticCurveTo(85, 150, 75, 180);
  ctx.quadraticCurveTo(70, 210, 80, 240);
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Right red balloon
  ctx.beginPath();
  ctx.arc(514, 90, 35, 0, 2 * Math.PI);
  ctx.fillStyle = '#DC143C';
  ctx.fill();
  ctx.strokeStyle = '#B91C3C';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Right balloon highlight
  ctx.beginPath();
  ctx.arc(504, 80, 8, 0, 2 * Math.PI);
  ctx.fillStyle = '#FF6B8A';
  ctx.fill();
  
  // Right balloon string
  ctx.beginPath();
  ctx.moveTo(514, 125);
  ctx.quadraticCurveTo(509, 150, 519, 180);
  ctx.quadraticCurveTo(524, 210, 514, 240);
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Set font for Persian text
  ctx.textAlign = 'center';
  ctx.direction = 'rtl';
  
  // Main title
  ctx.fillStyle = '#2C3E50';
  ctx.font = 'bold 32px Vazirmatn, Arial, sans-serif';
  ctx.fillText('تی تولد بهاره موفقیتون :(', BASE_WIDTH/2, 150);
  
  // Subtitle
  ctx.font = '22px Vazirmatn, Arial, sans-serif';
  ctx.fillText('آدم یاد تی تی و شادی آین', BASE_WIDTH/2, 190);
  
  // Poem text - line 1
  ctx.font = '18px Vazirmatn, Arial, sans-serif';
  ctx.fillStyle = '#34495E';
  ctx.fillText('تی ویسین آرزو دانم سالی پر از', BASE_WIDTH/2, 280);
  
  // Poem text - line 2
  ctx.fillText('دلخوشی و انطفای قشنگ پی', BASE_WIDTH/2, 310);
  
  // Bottom description - line 1
  ctx.font = '14px Vazirmatn, Arial, sans-serif';
  ctx.fillStyle = '#7F8C8D';
  ctx.fillText('تولدت مثل بهار میمونه، آدم یاد شکوفه و شادی میاره.', BASE_WIDTH/2, 380);
  
  // Bottom description - line 2
  ctx.fillText('برات آرزو دارم سالی پر از دلخوشی و انطفای قشنگ باشه.', BASE_WIDTH/2, 405);
  
  // QR code placeholder with white background
  ctx.fillStyle = 'white';
  ctx.fillRect(QR_BOX_OFFSET_X, QR_BOX_OFFSET_Y, QR_BOX_SIZE, QR_BOX_SIZE);
  ctx.strokeStyle = '#BDC3C7';
  ctx.lineWidth = 1;
  ctx.strokeRect(QR_BOX_OFFSET_X, QR_BOX_OFFSET_Y, QR_BOX_SIZE, QR_BOX_SIZE);
  
  // Bottom instruction
  ctx.fillStyle = '#7F8C8D';
  ctx.font = '14px Vazirmatn, Arial, sans-serif';
  ctx.fillText('کد رو اسکن کن، صفحه رو باز کن.', BASE_WIDTH/2, 720);
  
  return canvas.toDataURL('image/png');
};

const BirthdayCardModal: React.FC<BirthdayCardModalProps> = ({ isOpen, boardId, onClose }) => {
  const [cardDataURL, setCardDataURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && boardId) {
      generateCard();
    }
    return () => {
      // Clean up when modal closes
      setCardDataURL(null);
      setError(null);
    };
  }, [isOpen, boardId]);

  const generateCard = async () => {
    setLoading(true);
    setError(null);

    try {
      // Ensure Vazirmatn font is loaded
      if (document.fonts) {
        await document.fonts.load('16px Vazirmatn');
        await document.fonts.load('bold 32px Vazirmatn');
        await document.fonts.load('22px Vazirmatn');
        await document.fonts.load('18px Vazirmatn');
        await document.fonts.load('14px Vazirmatn');
      }

      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      // Set canvas dimensions with scale factor
      canvas.width = BASE_WIDTH * SCALE_FACTOR;
      canvas.height = BASE_HEIGHT * SCALE_FACTOR;

      // Try to load template image, fallback to generated template
      let templateDataURL: string;
      try {
        const templateImg = new Image();
        templateImg.crossOrigin = 'anonymous';
        
        await new Promise<void>((resolve, reject) => {
          templateImg.onload = () => resolve();
          templateImg.onerror = () => reject(new Error('Template not found'));
          templateImg.src = TEMPLATE_PATH;
        });
        templateDataURL = TEMPLATE_PATH;
      } catch {
        // Use fallback template
        templateDataURL = createFallbackTemplate();
      }

      // Load template (either from file or fallback)
      const templateImg = new Image();
      templateImg.crossOrigin = 'anonymous';
      
      await new Promise<void>((resolve, reject) => {
        templateImg.onload = () => resolve();
        templateImg.onerror = () => reject(new Error('Failed to load template'));
        templateImg.src = templateDataURL;
      });

      // Draw template image
      ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);

      // Generate QR code
      const boardURL = `${window.location.origin}/board/${boardId}`;
      const qrDataURL = await QRCode.toDataURL(boardURL, {
        width: QR_BOX_SIZE * SCALE_FACTOR,
        margin: 0,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });

      // Load QR code image
      const qrImg = new Image();
      await new Promise<void>((resolve, reject) => {
        qrImg.onload = () => resolve();
        qrImg.onerror = () => reject(new Error('Failed to load QR code'));
        qrImg.src = qrDataURL;
      });

      // Draw QR code on canvas with proper positioning
      ctx.drawImage(
        qrImg,
        QR_BOX_OFFSET_X * SCALE_FACTOR,
        QR_BOX_OFFSET_Y * SCALE_FACTOR,
        QR_BOX_SIZE * SCALE_FACTOR,
        QR_BOX_SIZE * SCALE_FACTOR
      );

      // Convert canvas to data URL with high quality
      const finalDataURL = canvas.toDataURL('image/png', 1.0);
      setCardDataURL(finalDataURL);

    } catch (err) {
      console.error('Error generating birthday card:', err);
      setError('خطا در ساخت کارت تبریک. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  const downloadCard = () => {
    if (!cardDataURL) return;

    const link = document.createElement('a');
    link.href = cardDataURL;
    link.download = `کارت-تبریک-${boardId}-${new Date().toISOString().split('T')[0]}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClose = () => {
    setCardDataURL(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    direction: 'rtl',
  };

  const modalContentStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    textAlign: 'center',
    fontFamily: "'Vazirmatn', sans-serif",
    maxWidth: '600px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
  };

  const buttonStyle: React.CSSProperties = {
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    margin: '0 5px'
  };

  const previewStyle: React.CSSProperties = {
    maxWidth: '100%',
    height: 'auto',
    border: '2px solid #ddd',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  };

  return (
    <div style={modalOverlayStyle} onClick={handleClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ 
          marginBottom: '20px', 
          color: '#2C3E50',
          fontFamily: "'Vazirmatn', sans-serif",
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          🎂 کارت تبریک تولد - {boardId}
        </h3>

        {loading && (
          <div style={{ margin: '20px 0', fontFamily: "'Vazirmatn', sans-serif" }}>
            <p style={{ fontSize: '16px', color: '#34495E' }}>در حال ساخت کارت تبریک...</p>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #FF69B4',
              borderRadius: '50%',
              margin: '10px auto',
              animation: 'spin 1s linear infinite'
            }}>
              <style>
                {`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}
              </style>
            </div>
          </div>
        )}

        {error && (
          <div style={{ 
            color: '#E74C3C', 
            backgroundColor: '#FDEDEC', 
            padding: '15px', 
            borderRadius: '8px',
            margin: '10px 0',
            fontFamily: "'Vazirmatn', sans-serif",
            border: '1px solid #F1948A'
          }}>
            {error}
          </div>
        )}

        {cardDataURL && !loading && (
          <div>
            <img 
              src={cardDataURL} 
              alt="کارت تبریک تولد" 
              style={previewStyle}
            />
            <div style={{ marginTop: '20px' }}>
              <button 
                style={{ 
                  ...buttonStyle, 
                  backgroundColor: '#27AE60', 
                  color: 'white',
                  fontFamily: "'Vazirmatn', sans-serif",
                  fontSize: '16px',
                  padding: '12px 25px',
                  marginRight: '10px'
                }} 
                onClick={downloadCard}
              >
                💾 دانلود کارت (PNG)
              </button>
              <button 
                style={{ 
                  ...buttonStyle, 
                  backgroundColor: '#E74C3C', 
                  color: 'white',
                  fontFamily: "'Vazirmatn', sans-serif",
                  fontSize: '16px',
                  padding: '12px 25px'
                }} 
                onClick={handleClose}
              >
                ✕ بستن
              </button>
            </div>
          </div>
        )}

        {!loading && !cardDataURL && !error && (
          <div style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
            <p style={{ color: '#7F8C8D', fontSize: '16px' }}>در حال آماده‌سازی کارت تبریک...</p>
            <button 
              style={{ 
                ...buttonStyle, 
                backgroundColor: '#BDC3C7',
                fontFamily: "'Vazirmatn', sans-serif",
                fontSize: '16px',
                padding: '12px 25px'
              }} 
              onClick={handleClose}
            >
              بستن
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BirthdayCardModal;
