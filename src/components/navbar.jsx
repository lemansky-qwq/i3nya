import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">首页</Link>
      <Link to="/about">关于</Link>
      <Link to="/contact">联系</Link>
      <Link to="/games">小游戏</Link>
    </nav>
  );
}
