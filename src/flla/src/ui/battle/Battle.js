import React from 'react';

const Game = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <iframe
        title="Unity Game"
        src={`${process.env.PUBLIC_URL}/game/fight_game_build/index.html`}
        width="800"
        height="600"
        style={{ border: 'none' }}
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default Game;
