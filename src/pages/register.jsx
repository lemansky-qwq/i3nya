import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');

    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('注册成功，请检查邮箱以完成验证');
    }
  };

  return (
    <div>
      <h2>注册</h2>
      <form onSubmit={handleRegister}>
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
        <button type="submit">注册</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
