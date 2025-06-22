import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import './theme.css';

const themes = ['light', 'dark', 'spring', 'summer', 'autumn', 'winter', 'nightmare', 'auto'];

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'auto');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const detectSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const applyTheme = (theme) => {
    themes.forEach(t => document.body.classList.remove(`theme-${t}`));
    if (theme === 'auto') {
      const systemTheme = detectSystemTheme();
      document.body.classList.add(`theme-${systemTheme}`);
    } else {
      document.body.classList.add(`theme-${theme}`);
    }
    localStorage.setItem('theme', theme);
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const handleChangeTheme = (selectedTheme) => {
    setTheme(selectedTheme);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="App">
      <h1>主题切换示例</h1>
      <p>当前主题：{theme}</p>

      <Navbar handleChangeTheme={handleChangeTheme} />

      <div className={`theme-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button onClick={() => handleChangeTheme('auto')}>自动</button>
        <button onClick={() => handleChangeTheme('light')}>浅</button>
        <button onClick={() => handleChangeTheme('dark')}>深</button>
        <button onClick={() => handleChangeTheme('spring')}>春</button>
        <button onClick={() => handleChangeTheme('summer')}>夏</button>
        <button onClick={() => handleChangeTheme('autumn')}>秋</button>
        <button onClick={() => handleChangeTheme('winter')}>冬</button>
        <button onClick={() => handleChangeTheme('nightmare')}>噩梦</button>
      </div>

      <div className="theme-toggle-button" onClick={toggleSidebar}>
        {isSidebarOpen ? '→' : '←'}
      </div>
    </div>
  );
}

export default App;
