// src/components/JumpLeaderboard.jsx
import { useEffect, useState } from 'react';
import { getTopJumpScores } from '../lib/supabaseClient';

export default function JumpLeaderboard() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    async function fetchScores() {
      const { data } = await getTopJumpScores();
      setScores(data || []);
    }
    fetchScores();
  }, []);

  return (
    <div>
      <h3>跳一跳排行榜</h3>
      <ul>
        {scores.map((s, i) => (
          <li key={i}>{s.nickname || '匿名'} - {s.score}</li>
        ))}
      </ul>
    </div>
  );
}
