import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import './App.css';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'auto');

  const userPreferredTheme = localStorage.getItem('theme') || 'auto';

  const detectSystemTheme = () => {
    if (userPreferredTheme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return userPreferredTheme;
  };

  useEffect(() => {
    applyTheme(detectSystemTheme());
  }, []);

  const applyTheme = (theme) => {
    document.body.className = ''; // 清除现有的主题
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem('theme', theme); // 保存用户选择的主题
  };

  const handleChangeTheme = (selectedTheme) => {
    setTheme(selectedTheme);
    applyTheme(selectedTheme);
  };

  return (
    <div className="App">
      <h1>主题切换示例</h1>
      <p>当前主题：{theme}</p>

      {/* 导航栏组件 */}
      <Navbar handleChangeTheme={handleChangeTheme} />
    </div>
  );
}

export default App;
