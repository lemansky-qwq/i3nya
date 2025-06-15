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
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h3>全球排行榜（跳一跳）</h3>
      <ol>
        {scores.map((item, index) => (
          <li key={index}>
            ID: {item.user_id?.slice(0, 6)}... | 分数：{item.score}
          </li>
        ))}
      </ol>
    </div>
  );
}