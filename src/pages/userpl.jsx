// src/pages/UserProfile.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../lib/AuthProvider';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function UserProfile() {
  const { user, loading } = useAuth();
  const [nickname, setNickname] = useState('');
  const [scores, setScores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [loading, user, navigate]);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('nickname')
        .eq('id', user.id)
        .single();

      const { data: scores } = await supabase
        .from('scores_jump')
        .select('score, created_at')
        .eq('user_id', user.id)
        .order('score', { ascending: false });

      if (profile) setNickname(profile.nickname);
      if (scores) setScores(scores);
    }

    fetchData();
  }, [user]);

  if (!user) return null;

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <h2>用户资料</h2>
      <p><strong>UID：</strong> {user.id}</p>
      <p><strong>邮箱：</strong> {user.email}</p>
      <p><strong>用户名：</strong> {nickname || '未设置'}</p>

      <h3 style={{ marginTop: '2rem' }}>🎮 我的跳一跳成绩</h3>
      <ul>
        {scores.length === 0 ? (
          <li>暂无成绩</li>
        ) : (
          scores.map((s, idx) => (
            <li key={idx}>得分：{s.score}（{new Date(s.created_at).toLocaleString()}）</li>
          ))
        )}
      </ul>
    </div>
  );
}
