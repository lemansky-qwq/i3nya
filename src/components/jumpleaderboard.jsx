// src/components/JumpLeaderboard.jsx

import { useEffect, useState } from 'react';
import { getTopJumpScores } from '../lib/supabaseClient';


export default function JumpLeaderboard() {
  const [scores, setScores] = useState([]);


  useEffect(() => {
    console.log('排行榜加载了');
    async function fetchScores() {
      const { data, error } = await getTopJumpScores();
      console.log('排行榜数据', data);
      if (error) console.error('查询失败：', error.message);
      setScores(data || []);
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
              <td>{item.user_profiles?.nickname || '匿名'}</td>
              <td style={{ textAlign: 'right' }}>{item.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}