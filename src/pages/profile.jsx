import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Profile() {
  const { uid } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', Number(uid))
        .single();

      if (error) {
        console.error(error);
        setProfile(null);
      } else {
        setProfile(data);
      }
      setLoading(false);
    }
    fetchProfile();
  }, [uid]);

  if (loading) return <p>加载中...</p>;
  if (!profile) return <p>用户不存在</p>;

  return (
    <div>
      <h1>{profile.nickname || '匿名用户'}</h1>
      <p>Email: {profile.email || '未公开'}</p>
      {/* 更多资料展示 */}
    </div>
  );
}
