import { Link } from 'react-router-dom';

export default function Games() {
  return (
    <div>
      <h1>小游戏</h1>
      <ul>
        <li><Link to="/games/click">🖱️点击</Link></li>
        <p>全站首发，致敬老牌魔王：点击</p>
        <li><Link to="/games/jump">🕹️跳一跳</Link></li>
        <p>跳一跳寸止版</p>
      </ul>
    </div>
  );
}
