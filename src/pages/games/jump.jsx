// src/pages/jump.jsx - v6.4 精准判断只允许跳到“当前目标平台”，否则不加分不生成
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



    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = 600;
        canvas.height = 300;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const viewOffset = Math.max(0, player.x - 150);

            ctx.fillStyle = '#eee';
            ctx.fillRect(0, 280, canvas.width, 20);

            ctx.fillStyle = '#888';
            platforms.forEach((p, i) => {
                ctx.fillStyle = (i === platforms.length - 1) ? '#555' : '#888';
                ctx.fillRect(p.x - viewOffset, 260, p.width, 20);
            });

            ctx.fillStyle = gameOver ? 'red' : '#007bff';
            ctx.fillRect(player.x - viewOffset, player.y, 20, 20);

        };

        draw();
    }, [player, platforms, gameOver, score, highScore]);

    const animateJump = (power) => {
        setIsJumping(true);
        const distance = Math.min(200, power * 2);
        const jumpHeight = Math.min(100, power * 1.5);

        let frame = 0;
        const totalFrames = 30;
        const startX = player.x;
        const startY = player.y;

        const jumpFrame = () => {
            frame++;
            const t = frame / totalFrames;
            const x = startX + distance * t;
            const y = startY - (4 * jumpHeight * t * (1 - t));
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
        const playerMidX = x + 10;
        const currentPlatform = platforms[platforms.length - 2]; // 倒数第二个
        const nextPlatform = platforms[platforms.length - 1];

        const isOnNext = playerMidX >= nextPlatform.x && playerMidX <= nextPlatform.x + nextPlatform.width;
        const isOnCurrent = playerMidX >= currentPlatform.x && playerMidX <= currentPlatform.x + currentPlatform.width;

        if (isOnNext) {
            setPlayer({ x, y: 250 });
            setScore(prev => prev + 1);
            const difficultyScale = Math.min(score / 10, 1);
            const minGap = 80 + difficultyScale * 40;
            const maxGap = 140 + difficultyScale * 60;
            const minWidth = 60 - difficultyScale * 20;
            const maxWidth = 100 - difficultyScale * 30;

            const newPlatform = {
                x: nextPlatform.x + minGap + Math.random() * (maxGap - minGap),
                width: minWidth + Math.random() * (maxWidth - minWidth),
            };

            setPlatforms([...platforms, newPlatform]);
        } else if (isOnCurrent) {
            setPlayer({ x, y: 250 });
        } else {
            setGameOver(true);
            if (score > highScore) {
                setHighScore(score);
                localStorage.setItem('jumpHighScore', score);
            }
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
            const power = Math.min(duration / 10, 100);
            setCharging(false);
            animateJump(power);
        }
    };
    
    document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
}, false);


    return (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <h1>跳一跳！Jump 1 Jump 3.4</h1>
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
                    onTouchStart={(e) => { e.preventDefault(); startCharge(); }} // 防止长按选中文本
                    onTouchEnd={(e) => { e.preventDefault(); releaseJump(); }}   // 防止长按选中文本
                    disabled={isJumping}
                    style={{
                        marginTop: '1rem',
                        padding: '1rem 2rem',
                        fontSize: '1.2rem',
                        userSelect: 'none', // 禁止文字选中
                    }}
                >
                    {charging ? '蓄力中...' : '跳！'}
                </button>
            )}
        </div>
    );
}
