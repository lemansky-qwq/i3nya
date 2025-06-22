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
    const [historyScores, setHistoryScores] = useState(() => {
        return JSON.parse(localStorage.getItem('jumpHistoryScores') || '[]');
    });

    // 游戏结束时检查分数并保存
    const finishJump = (x) => {
        const playerMidX = x + 10;
        const currentPlatform = platforms[platforms.length - 2]; // 倒数第二个
        const nextPlatform = platforms[platforms.length - 1];

        const isOnNext = playerMidX >= nextPlatform.x && playerMidX <= nextPlatform.x + nextPlatform.width;
        const isOnCurrent = playerMidX >= currentPlatform.x && playerMidX <= currentPlatform.x + currentPlatform.width;

        if (isOnNext) {
            setPlayer({ x, y: 250 });
            setScore(prev => prev + 1);
        } else if (isOnCurrent) {
            setPlayer({ x, y: 250 });
        } else {
            setGameOver(true);

            // 更新历史成绩
            if (score > highScore) {
                setHighScore(score);
                localStorage.setItem('jumpHighScore', score);
            }

            // 将当前分数添加到历史成绩数组
            const updatedHistoryScores = [...historyScores, score];

            // 保证只保存最高的 5 次成绩
            const topScores = updatedHistoryScores
                .sort((a, b) => b - a) // 按分数降序排序
                .slice(0, 5); // 保留前 5 个成绩

            setHistoryScores(topScores);
            localStorage.setItem('jumpHistoryScores', JSON.stringify(topScores));
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

    return (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <h1>跳一跳！Jump 1 Jump 3.3</h1>
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
                    onTouchStart={(e) => { e.preventDefault(); startCharge(); }}
                    onTouchEnd={(e) => { e.preventDefault(); releaseJump(); }}
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

            {/* 历史成绩显示 */}
            <div>
                <h3>最高 5 次成绩</h3>
                {historyScores.length === 0 ? (
                    <p>没有历史成绩</p>
                ) : (
                    <ul>
                        {historyScores.map((score, index) => (
                            <li key={index}>第 {index + 1} 局：{score} 分</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
