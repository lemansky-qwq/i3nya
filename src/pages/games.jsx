import { Link } from 'react-router-dom';

export default function Games() {
  return (
    <div>
      <h1>小游戏</h1>
      <ul>
        <li><Link to="/games/click">点击</Link></li>
        <p>全站首发，致敬老牌魔王</p>
        <li><Link to="/games/jump">🕹️跳一跳</Link></li>
        <p>Jump 1 Jump 3.3</p>
        <li><Link to="/games/2048">2048</Link></li>
        <p>2048 1.1</p>
      </ul>
    </div>
  );
}
