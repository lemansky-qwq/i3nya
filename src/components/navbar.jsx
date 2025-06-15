import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthProvider';
import { signOut, supabase } from '../lib/supabaseClient';
import './Navbar.css';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

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
    </nav>
  );
}
