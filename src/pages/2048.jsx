import React, { useState, useEffect } from 'react';
import './20480.css';

const generateEmptyGrid = () => {
  return Array.from({ length: 4 }, () => Array(4).fill(0));
};

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
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('highScore')) || 0;
  });
  const [historyScores, setHistoryScores] = useState(() => {
    return JSON.parse(localStorage.getItem('historyScores')) || [];
  });

  // 用来处理用户的点击方向按钮操作
  const handleMove = (direction) => {
    const [newGrid, gained] = moveGrid(grid, direction);
    if (JSON.stringify(newGrid) !== JSON.stringify(grid)) {
      const updatedGrid = addRandomNumber(newGrid);
      setGrid(updatedGrid);
      const newScore = score + gained;
      setScore(newScore);
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('highScore', newScore);
      }
    }
  };

  // 游戏结束时保存成绩
  const endGame = () => {
    const updatedScores = [...historyScores, score];

    // 按照分数降序排序，并保留最高的 5 个分数
    const topScores = updatedScores.sort((a, b) => b - a).slice(0, 5);

    setHistoryScores(topScores);
    localStorage.setItem('historyScores', JSON.stringify(topScores));
  };

  // 游戏重开
  const resetGame = () => {
    const empty = generateEmptyGrid();
    const startGrid = addRandomNumber(addRandomNumber(empty));
    setGrid(startGrid);
    setScore(0);
    endGame();
  };

  return (
    <div className="game-container">
      <h1>2048</h1>
      <p>分数：{score}　最高分：{highScore}</p>
      <p>点击按钮进行操作</p>
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

      {/* 操作按钮 */}
      <div className="buttons-container">
        <button className="move-button" onClick={() => handleMove('ArrowUp')}>↑</button>
        <div className="row-buttons">
          <button className="move-button" onClick={() => handleMove('ArrowLeft')}>←</button>
          <button className="move-button" onClick={() => handleMove('ArrowRight')}>→</button>
        </div>
        <button className="move-button" onClick={() => handleMove('ArrowDown')}>↓</button>
      </div>

      <button onClick={resetGame}>重开一局</button>

      {/* 历史成绩显示 */}
      <div>
        <h3>最高 5 次成绩</h3>
        {historyScores.length === 0 ? (
          <p>没有历史成绩</p>
        ) : (
          <ul>
            {historyScores.map((score, index) => (
              <li key={index}>第 {index + 1} 名：{score} 分</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// 移动的逻辑
const moveGrid = (grid, direction) => {
  const clone = grid.map(row => [...row]);
  let rotated = clone;
  let scoreGained = 0;

  const rotateRight = (matrix) =>
    matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());

  const rotateLeft = (matrix) =>
    matrix[0].map((_, i) => matrix.map(row => row[row.length - 1 - i]));

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

  // 旋转处理
  if (direction === 'ArrowLeft') rotated = rotateLeft(clone);
  if (direction === 'ArrowRight') rotated = rotateRight(clone);
  if (direction === 'ArrowDown') rotated = rotate180(clone);

  const moved = rotated.map(row => slideAndMerge(row));

  // 反向旋转回去
  if (direction === 'ArrowLeft') rotated = rotateRight(moved);
  else if (direction === 'ArrowRight') rotated = rotateLeft(moved);
  else if (direction === 'ArrowDown') rotated = rotate180(moved);
  else rotated = moved; // ArrowLeft 无需旋转

  return [rotated, scoreGained];
};

export default Game2048;
