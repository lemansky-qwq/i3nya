import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function GameClick() {
  const [user, setUser] = useState(null);
  const [count, setCount] = useState(() => parseInt(localStorage.getItem('clickCount') || '0'));
  const [message, setMessage] = useState('');

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('clickCount', count);
  }, [count]);

  const saveScore = async () => {
  if (!user) {
    setMessage('请先登录');
    return;
  }

  // 查询该用户是否已有记录（忽略错误，手动判断data是否存在）
  const { data: existing, error: fetchError } = await supabase
    .from('gamescores')
    .select('click')
    .eq('user_uuid', user.id)
    .limit(1)
    .maybeSingle();  // maybeSingle不会因无数据报错

  if (fetchError) {
    setMessage('查询失败: ' + fetchError.message);
    return;
  }

  if (existing) {
    if (count > existing.click) {
      const { error: updateError } = await supabase
        .from('gamescores')
        .update({ click: count })
        .eq('user_uuid', user.id);

      if (updateError) {
        setMessage('更新失败: ' + updateError.message);
      } else {
        setMessage('新纪录，分数已更新');
      }
    } else {
      setMessage(`未超过历史最高分：${existing.click}，未更新`);
    }
  } else {
    // 插入前再查一次，防止并发问题
    const { data: doubleCheck } = await supabase
      .from('gamescores')
      .select('click')
      .eq('user_uuid', user.id)
      .limit(1)
      .maybeSingle();

    if (existing) {
  if (count > existing.click) {
    const { error } = await supabase
      .from('gamescores')
      .update({ click: count })
      .eq('user_uuid', user.id);

    setMessage(error ? '更新失败: ' + error.message : '新纪录，分数已更新');
  } else {
    setMessage(`未超过历史最高分：${existing.click}，未更新`);
  }
} else {
  // ✔ 改为 upsert 解决并发写入冲突
  const { error } = await supabase
    .from('gamescores')
    .upsert({ user_uuid: user.id, click: count }, { onConflict: ['user_uuid'] });

  setMessage(error ? '插入失败: ' + error.message : '首次提交，分数已保存');
}

  }
};



  return (
    <div>
      <h1>点击1.0</h1>
      <p>点击次数：{count}</p>

      <button onClick={() => setCount(count + 1)}>点击</button>
      <button onClick={() => setCount(0)}>重置</button>
      <button onClick={saveScore}>保存分数</button>

      {message && <p>{message}</p>}
    </div>
  );
}
