import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient'; // 你的 supabase 客户端路径
import './navbar.css';

export default function Navbar({ handleChangeTheme, user }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">首页</Link>
        <Link to="/about">关于</Link>
        <Link to="/games/games">小游戏</Link>
      </div>
      <div className="navbar-right">
        {user ? (
          <>
            <Link to={`/profile/${user.id}`} className="nav-button">我的主页</Link>
            <button className="nav-button" onClick={handleLogout}>登出</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-button">登录</Link>
            <Link to="/register" className="nav-button">注册</Link>
          </>
        )}
      </div>

      {/* 右下角的主题切换按钮 */}
      <div className="theme-toggle-button" onClick={toggleSidebar}>
        {isSidebarOpen ? '→' : '←'}
      </div>

      {/* 主题选择栏 */}
      <div className={`theme-sidebar ${isSidebarOpen ? 'open' : ''}`}>
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
