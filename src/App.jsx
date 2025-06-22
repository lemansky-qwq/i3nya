import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/home';
import About from './pages/about';
import Games from './pages/games';
import GameClick from './pages/gameclick';
import NotFound from './pages/notfound';
import Navbar from './components/navbar';
import JumpGame from './pages/jump';
import Game2048 from './pages/2048';
import './theme.css'; // 确保样式生效

const themes = ['light', 'dark', 'spring', 'summer', 'autumn', 'winter', 'nightmare', 'auto'];

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'auto');

  const detectSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const applyTheme = (theme) => {
    themes.forEach(t => document.body.classList.remove(`theme-${t}`));
    const actual = theme === 'auto' ? detectSystemTheme() : theme;
    document.body.classList.add(`theme-${actual}`);
    localStorage.setItem('theme', theme);
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const handleChangeTheme = (selectedTheme) => {
    setTheme(selectedTheme);
  };

  return (
    <>
      <Navbar handleChangeTheme={handleChangeTheme} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/click" element={<GameClick />} />
          <Route path="/games/jump" element={<JumpGame />} />
          <Route path="/games/2048" element={<Game2048 />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}
