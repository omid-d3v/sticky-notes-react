import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      fontFamily: "'Vazirmatn', sans-serif",
      background: 'linear-gradient(to bottom right, #ffecd2, #fcb69f)'
    }}>
      <h1 className="app-title" style={{fontSize: '3rem'}}>🎂 تخته پیام تبریک تولد 🎂</h1>
      <p style={{fontSize: '1.2rem', color: '#555', maxWidth: '500px', margin: '20px 0'}}>
        یک راه ساده و زیبا برای جمع‌آوری پیام‌های تبریک از دوستان و همکاران برای مناسبت‌های خاص!
      </p>
      <div>
        <Link to="/manage" style={{
            textDecoration: 'none',
            padding: '12px 25px',
            backgroundColor: '#d81b60',
            color: 'white',
            borderRadius: '30px',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}>
          ورود به پنل مدیریت
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;