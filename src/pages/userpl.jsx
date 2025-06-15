import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function UserPublicProfile() {
  const { uid } = useParams();
  const [nickname, setNickname] = useState('');
  const [scores, setScores] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchUserData() {
      if (!uid) return;

      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('nickname')
        .eq('id', uid)
        .single();

      if (profileError || !profile) {
        setError('找不到该用户');
        return;
      }

      setNickname(profile.nickname);

      const { data: jumpScores } = await supabase
        .from('scores_jump')
        .select('score, created_at')
        .eq('user_id', uid)
        .order('score', { ascending: false });

      setScores(jumpScores || []);
    }

    fetchUserData();
  }, [uid]);

  if (error) return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <h2>用户主页</h2>
      <p><strong>UID：</strong> {uid}</p>
      <p><strong>昵称：</strong> {nickname}</p>

      <h3 style={{ marginTop: '2rem' }}>跳一跳成绩</h3>
      <ul>
        {scores.length === 0 ? (
          <li>暂无成绩</li>
        ) : (
          scores.map((s, i) => (
            <li key={i}>得分：{s.score}（{new Date(s.created_at).toLocaleString()}）</li>
          ))
        )}
      </ul>
    </div>
  );
}
