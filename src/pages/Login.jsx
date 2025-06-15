// src/pages/Login.jsx
import { useState } from 'react';
import { signInWithEmail, supabase } from '../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [emailOrNickname, setEmailOrNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let loginEmail = emailOrNickname.trim();

    // 如果不是邮箱格式，则尝试通过 nickname 获取邮箱
    if (!loginEmail.includes('@')) {
      const { data: profile, error: nicknameError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('nickname', loginEmail)
        .single();

      if (!profile || nicknameError) {
        setError('❌ 找不到该用户名');
        setLoading(false);
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from('auth.users')
        .select('email')
        .eq('id', profile.id)
        .single();

      if (!userData || userError) {
        setError('❌ 无法获取对应邮箱');
        setLoading(false);
        return;
      }

      loginEmail = userData.email;
    }

    // 使用邮箱 + 密码登录
    const { error: loginError } = await signInWithEmail(loginEmail, password);

    if (loginError) {
      setError('❌ 登录失败：' + loginError.message);
    } else {
      navigate('/profile');
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>登录</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="用户名或邮箱"
          value={emailOrNickname}
          onChange={(e) => setEmailOrNickname(e.target.value)}
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

        {error && (
          <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>
        )}

        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          没有账号？<Link to="/signup">立即注册</Link>
        </p>

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '0.5rem' }}
        >
          {loading ? '登录中...' : '登录'}
        </button>
      </form>
    </div>
  );
}
