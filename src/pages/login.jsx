import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('登录成功！');
      // 登录成功，跳转主页
      window.location.href = '/';
    }
  };

  return (
    <div>
      <h2>登录</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required />
        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required />
        <button type="submit">登录</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
