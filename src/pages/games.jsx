import { Link } from 'react-router-dom';

export default function Games() {
  return (
    <div>
      <h1>小游戏</h1>
      <ul>
        <li><Link to="/games/click">🖱️点击</Link></li>
        <p>全站首发，致敬点击</p>
      </ul>
    </div>
  );
}
