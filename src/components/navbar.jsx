// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthProvider';
import { signOut } from '../lib/supabaseClient';
import './Navbar.css'; // 导入样式文件
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';


export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    const fetchNickname = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('user_profiles')
        .select('nickname')
        .eq('id', user.id)
        .single();
      if (data) setNickname(data.nickname);
    };
    fetchNickname();
  }, [user]);


  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">首页</Link>
        <Link to="/about">关于</Link>
        <Link to="/games">小游戏</Link>
      </div>
      <div className="navbar-right">
        {!user ? (
          <Link to="/login">登录 / 注册</Link>
        ) : (
          <>
            <span>Hello，{nickname || '用户'}</span>
            <button onClick={handleLogout}>登出</button>
          </>
        )}
      </div>
    </nav>
  );
}
