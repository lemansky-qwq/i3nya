// src/pages/Login.jsx
import { useState } from 'react';
import { signInWithEmail } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();

  let loginEmail = email;

  // 如果输入看起来不是邮箱 → 当作 nickname
  if (!email.includes('@')) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('nickname', email)
      .single();

    if (!data || error) {
      setError('找不到该用户名');
      return;
    }

    const userId = data.id;

    // 查 auth.users 表，拿到邮箱
    const { data: userData, error: userError } = await supabase
      .from('auth.users')
      .select('email')
      .eq('id', userId)
      .single();

    if (!userData || userError) {
      setError('账号信息错误');
      return;
    }

    loginEmail = userData.email;
  }

  // 然后用 email + password 登录
  const { error: loginError } = await signInWithEmail(loginEmail, password);

  if (loginError) {
    setError('登录失败：' + loginError.message);
  } else {
    navigate('/profile');
  }
};


  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>登录</h2>
      <form onSubmit={handleLogin}>
        <input
            type="text"
            placeholder="用户名或邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        没有账号？<Link to="/signup">立即注册</Link>
        </p>
        <button type="submit" style={{ width: '100%', padding: '0.5rem' }}>登录</button>

      </form>
    </div>
  );
}
