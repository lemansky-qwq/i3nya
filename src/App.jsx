import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import About from './pages/about';
import Games from './pages/games';
import GameClick from './pages/gameclick';
import NotFound from './pages/notfound';
import Navbar from './components/navbar';
import JumpGame from './pages/jump';




export default function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/click" element={<GameClick />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/games/jump" element={<JumpGame />} />
        </Routes>
      </div>
    </>
  );
}
