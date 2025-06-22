import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './theme.css';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'auto');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 控制切换栏展开/收起状态

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

  // 切换右侧的切换栏
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="App">
      <h1>主题切换示例</h1>
      <p>当前主题：{theme}</p>

      {/* 导航栏组件 */}
      <Navbar handleChangeTheme={handleChangeTheme} />

      {/* 右侧的主题切换栏 */}
      <div className={`theme-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button onClick={() => handleChangeTheme('light')}>浅</button>
        <button onClick={() => handleChangeTheme('dark')}>深</button>
        <button onClick={() => handleChangeTheme('spring')}>春</button>
        <button onClick={() => handleChangeTheme('summer')}>夏</button>
        <button onClick={() => handleChangeTheme('autumn')}>秋</button>
        <button onClick={() => handleChangeTheme('winter')}>冬</button>
        <button onClick={() => handleChangeTheme('nightmare')}>噩梦</button>
      </div>

      {/* 右下角的切换按钮 */}
      <div className="theme-toggle-button" onClick={toggleSidebar}>
        {isSidebarOpen ? '←' : '→'}
      </div>
    </div>
  );
}

export default App;
