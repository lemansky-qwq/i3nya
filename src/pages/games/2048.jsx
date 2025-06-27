import React, { useState, useEffect } from 'react';
import './20480.css';
import { supabase } from '../lib/supabaseClient'; // 请根据你项目路径修改
import { useUser } from '@supabase/auth-helpers-react';

const generateEmptyGrid = () => Array.from({ length: 4 }, () => Array(4).fill(0));

const getRandomEmptyCell = (grid) => {
  const emptyCells = [];
  grid.forEach((row, i) =>
    row.forEach((cell, j) => {
      if (cell === 0) emptyCells.push([i, j]);
    })
  );
  if (emptyCells.length === 0) return null;
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

const addRandomNumber = (grid) => {
  const newGrid = grid.map(row => [...row]);
  const cell = getRandomEmptyCell(newGrid);
  if (cell) {
    const [i, j] = cell;
    newGrid[i][j] = Math.random() < 0.9 ? 2 : 4;
  }
  return newGrid;
};

const Game2048 = () => {
  const [grid, setGrid] = useState(() => addRandomNumber(addRandomNumber(generateEmptyGrid())));
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() =>
    parseInt(localStorage.getItem('highScore')) || 0
  );
  const [message, setMessage] = useState('');
  const user = useUser();

  // 保存排行榜分数到 Supabase
  const saveScore = async () => {
    if (!user) {
      setMessage('请先登录');
      return;
    }

    const { data: existing, error: fetchError } = await supabase
      .from('gamescores')
      .select('2048')
      .eq('user_uuid', user.id)
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      setMessage('查询失败: ' + fetchError.message);
      return;
    }

    if (existing) {
      if (score > existing['2048']) {
        const { error: updateError } = await supabase
          .from('gamescores')
          .update({ '2048': score })
          .eq('user_uuid', user.id);

        setMessage(updateError ? '更新失败: ' + updateError.message : '新纪录，分数已更新');
      } else {
        setMessage(`未超过历史最高分：${existing['2048']}，未更新`);
      }
    } else {
      const { error } = await supabase
        .from('gamescores')
        .upsert({ user_uuid: user.id, '2048': score }, { onConflict: ['user_uuid'] });

      setMessage(error ? '插入失败: ' + error.message : '首次提交，分数已保存');
    }
  };

  // 当得分变成新高时自动触发上传
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('highScore', score);
      saveScore(); // 上传排行榜
    }
  }, [score]);

  const handleKeyDown = (e) => {
    let key = e.key;
    if (key === 'w' || key === 'W') key = 'ArrowUp';
    if (key === 'a' || key === 'A') key = 'ArrowLeft';
    if (key === 's' || key === 'S') key = 'ArrowDown';
    if (key === 'd' || key === 'D') key = 'ArrowRight';

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
      e.preventDefault();
      handleMove(key);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [grid]);

  const handleMove = (direction) => {
    const [newGrid, gained] = moveGrid(grid, direction);
    if (JSON.stringify(newGrid) !== JSON.stringify(grid)) {
      const updatedGrid = addRandomNumber(newGrid);
      setGrid(updatedGrid);
      setScore(prev => prev + gained);
    }
  };

  const resetGame = () => {
    const empty = generateEmptyGrid();
    const startGrid = addRandomNumber(addRandomNumber(empty));
    setGrid(startGrid);
    setScore(0);
    setMessage('');
  };

  return (
    <div className="game-container">
      <h1>2048</h1>
      <p>分数：{score}　最高分：{highScore}</p>
      <p>点击下方按钮或键盘WASD进行操作</p>
      <div className="grid">
        {grid.map((row, i) =>
          <div className="row" key={i}>
            {row.map((cell, j) =>
              <div className={`cell value-${cell}`} key={j}>
                {cell !== 0 ? cell : ''}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="buttons-container">
        <button className="move-button" onClick={() => handleMove('ArrowUp')}>↑</button>
        <div className="row-buttons">
          <button className="move-button" onClick={() => handleMove('ArrowLeft')}>←</button>
          <button className="move-button" onClick={() => handleMove('ArrowRight')}>→</button>
        </div>
        <button className="move-button" onClick={() => handleMove('ArrowDown')}>↓</button>
      </div>

      <button onClick={resetGame}>重开一局</button>
      <p style={{ color: 'green' }}>{message}</p>
    </div>
  );
};

// 移动逻辑
const moveGrid = (grid, direction) => {
  const clone = grid.map(row => [...row]);
  let rotated = clone;
  let scoreGained = 0;

  const rotateRight = (matrix) => matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());
  const rotateLeft = (matrix) => matrix[0].map((_, i) => matrix.map(row => row[row.length - 1 - i]));
  const rotate180 = (matrix) => rotateLeft(rotateLeft(matrix));

  const slideAndMerge = (row) => {
    const newRow = row.filter(val => val !== 0);
    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        scoreGained += newRow[i];
        newRow[i + 1] = 0;
      }
    }
    return newRow.filter(val => val !== 0).concat(Array(4 - newRow.filter(val => val !== 0).length).fill(0));
  };

  if (direction === 'ArrowLeft') rotated = rotateLeft(clone);
  if (direction === 'ArrowRight') rotated = rotateRight(clone);
  if (direction === 'ArrowDown') rotated = rotate180(clone);

  const moved = rotated.map(row => slideAndMerge(row));

  if (direction === 'ArrowLeft') rotated = rotateRight(moved);
  else if (direction === 'ArrowRight') rotated = rotateLeft(moved);
  else if (direction === 'ArrowDown') rotated = rotate180(moved);
  else rotated = moved;

  return [rotated, scoreGained];
};

export default Game2048;
