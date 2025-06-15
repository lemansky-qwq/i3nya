// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthProvider';
import { signOut } from '../lib/supabaseClient';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>首页</Link>
      <Link to="/about" style={{ marginRight: '1rem' }}>关于</Link>
      <Link to="/games" style={{ marginRight: '1rem' }}>小游戏</Link>

      <span style={{ float: 'right' }}>
        {!user ? (
          <Link to="/login">登录</Link>
        ) : (
          <>
            👋 欢迎，{user.email.split('@')[0]} &nbsp;
            <button onClick={handleLogout}>登出</button>
          </>
        )}
      </span>
    </nav>
  );
}
