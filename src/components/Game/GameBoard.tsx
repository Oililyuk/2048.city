
'use client';
declare global {
  interface Window {
    game?: any;
  }
}

import { useEffect, useRef } from 'react';
import './game-global.css';

interface GameBoardProps {
  session: any;
  onScoreSubmit?: (score: number, maxTile: number) => Promise<void>;
}

export default function GameBoard({ session, onScoreSubmit }: GameBoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const initGame = async () => {
      const { Game2048 } = await import('./game-logic');
      // @ts-ignore
      const game = new Game2048();
      
      // Set up game end callback to submit score
      game.onGameEnd = async (finalScore: number, won: boolean) => {
        if (session?.user) {
          try {
            // Calculate max tile from the game grid
            let maxTile = 0;
            for (let i = 0; i < game.size; i++) {
              for (let j = 0; j < game.size; j++) {
                const tile = game.grid[i][j];
                if (tile && tile.value > maxTile) {
                  maxTile = tile.value;
                }
              }
            }
            
            // submit score (no debug logging in production)
            
            // Submit score to API
            const response = await fetch('/api/scores/submit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                score: finalScore,
                maxTile: maxTile,
                moves: 0,
                gameDuration: 0
              })
            });
            
            const result = await response.json();
            
            if (!response.ok) {
              console.error('Score submission failed:', result);
            }
          } catch (error) {
            console.error('Failed to submit score:', error);
          }
        } else {
          // user not logged in; skipping score submit
        }
      };
      
      // @ts-ignore
      window.game = game;
    };

    initGame();
  }, [session]);

  return (
    <div className="game-root">
      <div className="container" ref={containerRef}>
        <div className="heading">
          <h1 className="game-title">2048</h1>
          <div className="score-container">
            <div className="score-box">
              <div className="score-label">Score</div>
              <div className="score" id="score">0</div>
            </div>
            <div className="score-box">
              <div className="score-label">Best</div>
              <div className="best-score" id="best-score">0</div>
            </div>
          </div>
        </div>

        <div className="game-container">
          <div className="grid-container">
            {[0, 1, 2, 3].map((row) => (
              <div className="grid-row" key={row}>
                {[0, 1, 2, 3].map((col) => (
                  <div className="grid-cell" key={col}></div>
                ))}
              </div>
            ))}
          </div>
          <div className="tile-container" id="tile-container"></div>
          <div className="game-message" id="game-message"></div>
        </div>
        
        <div className="controls">
          <button className="btn-new" onClick={() => { if (window.game) window.game.restart(); }}>New Game</button>
          <button className="btn-undo" id="undo-btn" onClick={() => { if (window.game) window.game.undo(); }}>Undo (<span id="undo-count">3</span>)</button>
        </div>

        <div className="game-instructions">
          <p className="instructions-text">
            <strong>How to play:</strong> Use arrow keys or swipe anywhere on screen to move tiles. When two tiles with the same number touch, they merge into one!
          </p>
        </div>
      </div>
    </div>
  );
}
