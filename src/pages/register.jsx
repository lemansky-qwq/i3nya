import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');

    // 先注册账户
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    // 注册成功后，写入 profiles 表
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: data.user.id, nickname }]);

      if (profileError) {
        setMessage('注册成功，但写入用户名失败: ' + profileError.message);
        return;
      }

      setMessage('注册成功，请检查邮箱以完成验证');
    }
  };

  return (
    <div>
      <h2>注册</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="用户名"
          value={nickname}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="邮箱"
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
        />
        <button type="submit">注册</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
