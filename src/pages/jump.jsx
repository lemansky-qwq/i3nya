// src/pages/jump.jsx - v3 蓄力跳跃 + 动画跳跃 + 计分
import { useEffect, useRef, useState } from 'react';

export default function JumpGame() {
  const canvasRef = useRef(null);
  const [player, setPlayer] = useState({ x: 0, y: 250 });
  const [platforms, setPlatforms] = useState([
    { x: 0, width: 80 },
    { x: 100, width: 80 },
  ]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('jumpHighScore') || '0'));
  const [gameOver, setGameOver] = useState(false);
  const [charging, setCharging] = useState(false);
  const [chargeStart, setChargeStart] = useState(0);
  const [isJumping, setIsJumping] = useState(false);

  const gravity = 1;
  const jumpBase = 10;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 300;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#eee';
      ctx.fillRect(0, 280, canvas.width, 20);

      ctx.fillStyle = '#888';
      platforms.forEach(p => ctx.fillRect(p.x, 260, p.width, 20));

      ctx.fillStyle = gameOver ? 'red' : '#007bff';
      ctx.fillRect(player.x, player.y, 20, 20);

      ctx.fillStyle = '#333';
      ctx.font = '16px sans-serif';
      ctx.fillText(`得分：${score}`, 10, 20);
      ctx.fillText(`最高分：${highScore}`, 280, 20);
    };

    draw();
  }, [player, platforms, gameOver, score, highScore]);

  const animateJump = (power) => {
    setIsJumping(true);
    const distance = Math.min(160, power * 2); // 限制最大距离
    const jumpHeight = Math.min(100, power * 1.5);

    let frame = 0;
    const totalFrames = 30;
    const startX = player.x;
    const startY = player.y;

    const jumpFrame = () => {
      frame++;
      const t = frame / totalFrames;
      const x = startX + distance * t;
      const y = startY - (4 * jumpHeight * t * (1 - t)); // 抛物线
      setPlayer({ x, y });

      if (frame < totalFrames) {
        requestAnimationFrame(jumpFrame);
      } else {
        finishJump(x);
      }
    };

    requestAnimationFrame(jumpFrame);
  };

  const finishJump = (x) => {
    const landed = platforms.some(p => x + 10 >= p.x && x + 10 <= p.x + p.width);

    if (!landed) {
      setGameOver(true);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('jumpHighScore', score);
      }
    } else {
      setPlayer({ x, y: 250 });
      setScore(prev => prev + 1);
      const lastPlatform = platforms[platforms.length - 1];
      const newPlatform = {
        x: lastPlatform.x + 80 + Math.random() * 60,
        width: 60 + Math.random() * 40,
      };
      setPlatforms([...platforms, newPlatform]);
    }
    setIsJumping(false);
  };

  const reset = () => {
    setGameOver(false);
    setScore(0);
    setPlayer({ x: 0, y: 250 });
    setPlatforms([
      { x: 0, width: 80 },
      { x: 100, width: 80 },
    ]);
    setIsJumping(false);
  };

  const startCharge = () => {
    if (!isJumping && !gameOver) {
      setCharging(true);
      setChargeStart(performance.now());
    }
  };

  const releaseJump = () => {
    if (charging && !isJumping && !gameOver) {
      const duration = performance.now() - chargeStart;
      const power = Math.min(duration / 10, 80); // 蓄力限制
      setCharging(false);
      animateJump(power);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
      <h1>跳一跳！Jump 1 Jump</h1>
      <canvas ref={canvasRef} style={{ border: '1px solid #ccc' }}></canvas>
      <p>得分：{score} | 最高分：{highScore}</p>

      {gameOver ? (
        <div>
          <p style={{ color: 'red' }}>你掉了！</p>
          <button onClick={reset}>重新开始</button>
        </div>
      ) : (
        <button
          onMouseDown={startCharge}
          onMouseUp={releaseJump}
          onTouchStart={startCharge}
          onTouchEnd={releaseJump}
          disabled={isJumping}
          style={{ marginTop: '1rem', padding: '1rem 2rem', fontSize: '1.2rem' }}
        >
          {charging ? '蓄力中...' : '跳！'}
        </button>
      )}
    </div>
  );
}