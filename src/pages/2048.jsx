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

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      const keyMap = {
        ArrowUp: 'ArrowUp',
        ArrowDown: 'ArrowDown',
        ArrowLeft: 'ArrowLeft',
        ArrowRight: 'ArrowRight',
        w: 'ArrowUp',
        W: 'ArrowUp',
        s: 'ArrowDown',
        S: 'ArrowDown',
        a: 'ArrowLeft',
        A: 'ArrowLeft',
        d: 'ArrowRight',
        D: 'ArrowRight',
      };

      if (keyMap[key]) {
        e.preventDefault();
        handleMove(keyMap[key]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [grid]);

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

  const moveGrid = (grid, direction) => {
    const newGrid = grid.map(row => [...row]);
    let scoreGained = 0;

    const rotateRight = (matrix) =>
      matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());

    const rotateLeft = (matrix) =>
      matrix[0].map((_, i) => matrix.map(row => row[i])).reverse();

    let workingGrid = [...newGrid];

    if (direction === 'ArrowUp') {
      workingGrid = rotateLeft(workingGrid);
    } else if (direction === 'ArrowDown') {
      workingGrid = rotateRight(workingGrid);
    } else if (direction === 'ArrowRight') {
      workingGrid = workingGrid.map(row => row.reverse());
    }

    const mergedGrid = workingGrid.map(row => {
      const newRow = row.filter(val => val !== 0);
      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          scoreGained += newRow[i];
          newRow[i + 1] = 0;
        }
      }
      const finalRow = newRow.filter(val => val !== 0);
      while (finalRow.length < 4) finalRow.push(0);
      return finalRow;
    });

    let finalGrid = mergedGrid;

    if (direction === 'ArrowRight') {
      finalGrid = finalGrid.map(row => row.reverse());
    } else if (direction === 'ArrowDown') {
      finalGrid = rotateLeft(finalGrid);
    } else if (direction === 'ArrowUp') {
      finalGrid = rotateRight(finalGrid);
    }

    return [finalGrid, scoreGained];
  };

  const resetGame = () => {
    const empty = generateEmptyGrid();
    const startGrid = addRandomNumber(addRandomNumber(empty));
    setGrid(startGrid);
    setScore(0);
  };

  return (
    <div className="game-container">
      <h1>2048</h1>
      <p>分数：{score}　最高分：{highScore}</p>
      <p>使用 ↑ ↓ ← → 或 W A S D 键移动</p>
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
      <button onClick={resetGame}>重开一局</button>
    </div>
  );
};

export default Game2048;
