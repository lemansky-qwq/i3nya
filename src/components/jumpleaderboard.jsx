// src/components/JumpLeaderboard.jsx
import { useEffect, useState } from 'react';
import { getTopJumpScores } from '../lib/supabaseClient';

export default function JumpLeaderboard() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    async function fetchScores() {
      const { data, error } = await getTopJumpScores();
      if (!error && data) setScores(data);
    }
    fetchScores();
  }, []);

  return (
    <div style={{ maxWidth: '480px', margin: '2rem auto' }}>
      <h3>全球排行榜（跳一跳）</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ccc' }}>
            <th style={{ textAlign: 'left' }}>昵称</th>
            <th style={{ textAlign: 'right' }}>分数</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((item, index) => (
            <tr key={index}>
              <td>{item.user?.nickname || '匿名用户'}</td>
              <td style={{ textAlign: 'right' }}>{item.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}