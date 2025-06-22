import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import './navbar.css';

export default function Navbar({ handleChangeTheme, user }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileId, setProfileId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfileId() {
      if (!user) {
        setProfileId(null);
        return;
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_uuid', user.id)  // 这里根据你的 profiles 表字段名调整
        .single();
      if (error) {
        console.error('获取profile id失败', error);
        setProfileId(null);
      } else {
        setProfileId(data.id);
      }
    }
    fetchProfileId();
  }, [user]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">首页</Link>
        <Link to="/about">关于</Link>
        <Link to="/games">小游戏</Link>
      </div>
      <div className="navbar-right">
        {user ? (
          <>
            {profileId ? (
              <Link to={`/profile/${profileId}`} className="nav-button">我的主页</Link>
            ) : (
              <span className="nav-button">加载中...</span>
            )}
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
