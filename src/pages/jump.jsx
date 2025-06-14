// src/pages/jump.jsx - 简易“跳一跳”游戏带计分功能
import { useEffect, useRef, useState } from 'react';

export default function JumpGame() {
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [player, setPlayer] = useState({ x: 0, y: 250 });
  const [platforms, setPlatforms] = useState([
    { x: 0, width: 80 },
    { x: 80, width: 80 },
  ]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('jumpHighScore') || '0'));

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 300;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 地面
      ctx.fillStyle = '#eee';
      ctx.fillRect(0, 280, canvas.width, 20);

      // 平台
      ctx.fillStyle = '#888';
      platforms.forEach(p => {
        ctx.fillRect(p.x, 260, p.width, 20);
      });

      // 玩家方块
      ctx.fillStyle = gameOver ? 'red' : '#007bff';
      ctx.fillRect(player.x, player.y, 20, 20);

      // 分数显示
      ctx.fillStyle = '#333';
      ctx.font = '16px sans-serif';
      ctx.fillText(`得分：${score}`, 10, 20);
      ctx.fillText(`最高分：${highScore}`, 280, 20);
    };

    draw();
  }, [player, platforms, gameOver, score, highScore]);

  const handleJump = () => {
    if (gameOver) return;

    const nextX = player.x + 80;
    const landed = platforms.some(p => nextX >= p.x && nextX <= p.x + p.width);

    if (!landed) {
      setGameOver(true);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('jumpHighScore', score);
      }
    } else {
      setPlayer({ x: nextX, y: 250 });
      setScore(score + 1);
      const lastPlatform = platforms[platforms.length - 1];
      const newPlatform = {
        x: lastPlatform.x + 160,
        width: 80,
      };
      setPlatforms([...platforms, newPlatform]);
    }
  };

  const reset = () => {
    setGameOver(false);
    setScore(0);
    setPlayer({ x: 0, y: 250 });
    setPlatforms([
      { x: 0, width: 80 },
      { x: 80, width: 80 },
    ]);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
      <h1>跳一跳！Jump 1 Jump</h1>
      <canvas ref={canvasRef} style={{ border: '1px solid #ccc' }}></canvas>
      <p>得分：{score} | 最高：{highScore}</p>
      {gameOver ? (
        <div>
          <p style={{ color: 'red' }}>你掉了！游戏结束。</p>
          <button onClick={reset}>重新开始</button>
        </div>
      ) : (
        <button onClick={handleJump} style={{ marginTop: '1rem' }}>
          跳！
        </button>
      )}
    </div>
  );
}