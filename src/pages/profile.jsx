// src/pages/profile.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function Profile() {
  const { uid } = useParams();
  const [profile, setProfile] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles') // 确保你有这个表
        .select('*')
        .eq('id', uid) // id 是你保存的 uid，例如 1、2、3 或 Supabase 的 UUID
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setProfile(data);
      }
    };

    fetchProfile();
  }, [uid]);

  if (notFound) return <p>用户不存在</p>;
  if (!profile) return <p>加载中...</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h1>用户资料</h1>
      <p>UID: {profile.id}</p>
      <p>昵称: {profile.nickname || '（未设置）'}</p>
      <p>邮箱: {profile.email || '（未公开）'}</p>
    </div>
  );
}
