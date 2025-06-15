import { Link } from 'react-router-dom';
import './games.css';

export default function Games() {
  const games = [
    { title: '点击', path: '/games/click', description: '全站首发，致敬老牌魔王' },
    { title: '🕹️ 跳一跳', path: '/games/jump', description: 'Jump 1 Jump 3.3' },
    { title: '2048', path: '/games/2048', description: '2048 1.1' },
  ];

  return (
    <div className="games-page">
      <h1>小游戏</h1>
      <div className="games-grid">
        {games.map((game, i) => (
          <Link to={game.path} className="game-card" key={i}>
            <h3>{game.title}</h3>
            <p>{game.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
