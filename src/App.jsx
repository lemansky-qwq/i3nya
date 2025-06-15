import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import About from './pages/about';
import Games from './pages/games';
import GameClick from './pages/gameclick';
import NotFound from './pages/notfound';
import Navbar from './components/navbar';
import JumpGame from './pages/jump';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Userpl from './pages/userpl';




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
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/userpl/:nickname" element={<Userpl />} />
        </Routes>
      </div>
    </>
  );
}
