import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

export default function Navbar({ handleChangeTheme }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">首页</Link>
        <Link to="/about">关于</Link>
        <Link to="/games">小游戏</Link>
      </div>

      <div className="theme-toggle-button" onClick={toggleSidebar}>
        {isSidebarOpen ? '→' : '←'}
      </div>

      <div className={`theme-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button onClick={() => handleChangeTheme('auto')}>自动</button>
        <button onClick={() => handleChangeTheme('light')}>浅</button>
        <button onClick={() => handleChangeTheme('dark')}>深</button>
        <button onClick={() => handleChangeTheme('spring')}>春</button>
        <button onClick={() => handleChangeTheme('summer')}>夏</button>
        <button onClick={() => handleChangeTheme('autumn')}>秋</button>
        <button onClick={() => handleChangeTheme('winter')}>冬</button>
        <button onClick={() => handleChangeTheme('nightmare')}>噩梦</button>
      </div>
    </nav>
  );
}
