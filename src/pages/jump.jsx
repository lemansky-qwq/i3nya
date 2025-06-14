import { useEffect, useRef, useState } from 'react';

export default function JumpGame() {
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [player, setPlayer] = useState({ x: 50, y: 250 });
  const [platforms, setPlatforms] = useState([
    { x: 0, width: 80 },
    { x: 160, width: 80 },
  ]);

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
    };

    draw();
  }, [player, platforms, gameOver]);

  const handleJump = () => {
    if (gameOver) return;

    const nextX = player.x + 80;

    // 判断是否落在平台上
    const landed = platforms.some(
      p => nextX >= p.x && nextX <= p.x + p.width
    );

    if (!landed) {
      setGameOver(true);
    } else {
      setPlayer({ x: nextX, y: 250 });
      // 动态添加新平台
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
    setPlayer({ x: 50, y: 250 });
    setPlatforms([
      { x: 0, width: 80 },
      { x: 160, width: 80 },
    ]);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
      <h1>跳一跳！Jump 1 Jump</h1>
      <canvas ref={canvasRef} style={{ border: '1px solid #ccc' }}></canvas>
      <br />
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
