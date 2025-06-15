// src/pages/Signup.jsx
import { useState } from 'react';
import { signUpWithEmail, supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    // 检查昵称是否被占用
    const { data: existing, error: checkError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('nickname', nickname)
      .single();

    if (existing && !checkError) {
      setError('昵称已被占用，请换一个');
      return;
    }

    // 注册用户
    const { data, error: signupError } = await signUpWithEmail(email, password);
    if (signupError) {
      setError(signupError.message);
      return;
    }

    const user = data?.user;
    if (!user) {
      setError('注册失败，请稍后重试');
      return;
    }

    // 插入 nickname 到 user_profiles
    const { error: profileError } = await supabase.from('user_profiles').insert({
      id: user.id,
      nickname
    });

    if (profileError) {
      setError('用户信息保存失败：' + profileError.message);
      return;
    }

    alert('注册成功！');
    navigate('/login');
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
        <button type="submit" style={{ width: '100%', padding: '0.5rem' }}>
          注册
        </button>
      </form>
    </div>
  );
}
