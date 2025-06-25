import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ClickLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);

      // 联表查询 user_uuid -> profiles.nickname
      const { data, error } = await supabase
        .from('gamescores')
        .select('click, profiles(nickname)')
        .order('click', { ascending: false })
        .limit(10);

      if (error) {
        setError('获取排行榜失败：' + error.message);
      } else {
        setLeaderboard(data);
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <p>排行榜加载中...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (leaderboard.length === 0) return <p>暂无排行榜数据</p>;

  return (
    <div>
      <h2>点击游戏排行榜</h2>
      <ol>
        {leaderboard.map(({ click, profiles }, idx) => (
          <li key={idx}>
            <strong>{profiles?.nickname || '匿名'}</strong> - 分数: {click}
          </li>
        ))}
      </ol>
    </div>
  );
}
