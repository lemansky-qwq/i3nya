import { Link } from 'react-router-dom';

export default function Games() {
  return (
    <div>
      <h1>小游戏合集</h1>
      <ul>
        <li><Link to="/games/click">🖱️ 点击挑战</Link></li>
      </ul>
    </div>
  );
}
