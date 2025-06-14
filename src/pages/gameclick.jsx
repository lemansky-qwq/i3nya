import { useState, useEffect } from 'react';

export default function GameClick() {
  const [count, setCount] = useState(() => parseInt(localStorage.getItem('clickCount') || '0'));

  useEffect(() => {
    localStorage.setItem('clickCount', count);
  }, [count]);

  return (
    <div>
      <h1>点击1.0</h1>
      <p>点击次数：{count}</p>

      <button onClick={() => setCount(count + 1)}>点击</button>

      <button onClick={() => setCount(0)}>重置</button>
    </div>
  );
}
