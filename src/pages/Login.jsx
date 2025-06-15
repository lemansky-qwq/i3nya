import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
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

    // 判断是不是邮箱格式
    const isEmail = loginEmail.includes('@');

    // 如果是昵称，先查 user_profiles → 找到对应用户 ID → 再查 auth.users 获取邮箱
    if (!isEmail) {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id', { head: false })
        .eq('nickname', loginEmail)
        .single();

      if (profileError || !profile) {
        setError('❌ 找不到该用户名');
        setLoading(false);
        return;
      }

      const { data: user, error: userError } = await supabase
        .from('auth.users')
        .select('email', { head: false })
        .eq('id', profile.id)
        .single();

      if (userError || !user) {
        setError('❌ 获取邮箱失败');
        setLoading(false);
        return;
      }

      loginEmail = user.email;
    }

    // 登录（邮箱 + 密码）
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password,
    });

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
        {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '0.5rem' }}
        >
          {loading ? '登录中...' : '登录'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          没有账号？<Link to="/signup">立即注册</Link>
        </p>
      </form>
    </div>
  );
}
