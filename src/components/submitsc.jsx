// src/components/SubmitScore.jsx
import { useState } from 'react';
import { uploadJumpScore } from '../lib/supabaseClient';

export default function SubmitScore() {
  const [nickname, setNickname] = useState('');
  const [score, setScore] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const { error } = await uploadJumpScore(nickname, parseInt(score));
    if (error) alert('提交失败');
    else alert('提交成功');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="昵称" value={nickname} onChange={e => setNickname(e.target.value)} />
      <input placeholder="分数" value={score} onChange={e => setScore(e.target.value)} type="number" />
      <button type="submit">提交</button>
    </form>
  );
}
