// src/pages/Signup.jsx
import { useState } from 'react';
import { signUpWithEmail } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');


  const handleSignup = async (e) => {
    e.preventDefault();
    const { data, error } = await signUpWithEmail(email, password);
    if (error) {
    setError(error.message);
    } else {
    const user = data.user;
    // 写入 nickname 到数据库
    await supabase.from('user_profiles').insert({
        id: user.id,
        nickname: nickname
    });
    alert('注册成功！');
    navigate('/login');
    }

  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>注册账号</h2>
      <form onSubmit={handleSignup}>
            <input
            type="text"
            placeholder="用户名"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />

        <input
          type="email"
          placeholder="邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />
        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ width: '100%', padding: '0.5rem' }}>注册</button>
      </form>
    </div>
  );
}
