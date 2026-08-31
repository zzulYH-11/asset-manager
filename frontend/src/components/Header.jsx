import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const handleToggle = () => {
    toggleTheme();
    showToast(`${theme === 'light' ? '다크' : '라이트'} 모드로 전환되었습니다.`, 'info');
  };

  return (
    <header className="app-header">
      <div className="brand-wrapper">
        <div className="brand-logo"><i className="fa-solid fa-chart-pie"></i></div>
        <h1 className="brand-title">AssetManager</h1>
      </div>
      <div className="header-actions">
        <button className="theme-toggle-btn" onClick={handleToggle} title="테마 변경">
          <i className={`fa-solid ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
        </button>
        <div className="member-badge"><i className="fa-solid fa-user"></i> Member <span>#1</span></div>
      </div>
    </header>
  );
}
