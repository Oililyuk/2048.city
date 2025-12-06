'use client';

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
      // @ts-ignore
      window.game = game;
    };

    initGame();
  }, []);

  return (
    <>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="glass-distortion">
            <feTurbulence type="fractalNoise" baseFrequency="0.01 0.01" numOctaves={1} seed={5} result="turbulence"/>
            <feGaussianBlur in="turbulence" stdDeviation={3} result="softMap"/>
            <feSpecularLighting in="softMap" surfaceScale={5} specularConstant={1} specularExponent={100} lightingColor="white" result="specLight">
              <fePointLight x={-200} y={-200} z={300}/>
            </feSpecularLighting>
            <feComposite in="specLight" operator="arithmetic" k1={0} k2={1} k3={1} k4={0} result="litImage"/>
            <feDisplacementMap in="SourceGraphic" in2="softMap" scale={15} xChannelSelector="R" yChannelSelector="G"/>
          </filter>
          <filter id="liquid-burst" x="-100%" y="-100%" width="300%" height="300%">
            <feTurbulence type="fractalNoise" baseFrequency={0.015} numOctaves={4} result="turbulence" />
            <feDisplacementMap in="SourceGraphic" in2="turbulence" scale={40} xChannelSelector="R" yChannelSelector="G" />
            <feGaussianBlur stdDeviation={0.8} />
          </filter>
        </defs>
      </svg>
      
      <div className="container" ref={containerRef}>
        <header className="header">
          <h1>Free 2048</h1>
          <div className="score-container">
            <div className="score-box ui-liquid-wrapper">
              <div className="liquidGlass-effect"></div>
              <div className="liquidGlass-tint"></div>
              <div className="liquidGlass-shine"></div>
              <div className="liquidGlass-content">
                <div className="score-label">Score</div>
                <div className="score" id="score">0</div>
              </div>
            </div>
            <div className="score-box ui-liquid-wrapper">
              <div className="liquidGlass-effect"></div>
              <div className="liquidGlass-tint"></div>
              <div className="liquidGlass-shine"></div>
              <div className="liquidGlass-content">
                <div className="score-label">Best</div>
                <div className="best-score" id="best-score">0</div>
              </div>
            </div>
          </div>
        </header>

        <main className="main-content">
          <div className="game-message" id="game-message">
            <p></p>
            <button className="restart-button" onClick={() => {
              // @ts-ignore
              if (window.game) window.game.restart();
            }}>Try Again</button>
          </div>
          
          <div className="game-container">
            <div className="liquid-glass-effect"></div>
            <div className="grid-container">
              <div className="grid-row">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="grid-cell"></div>
                ))}
              </div>
              <div className="grid-row">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="grid-cell"></div>
                ))}
              </div>
              <div className="grid-row">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="grid-cell"></div>
                ))}
              </div>
              <div className="grid-row">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="grid-cell"></div>
                ))}
              </div>
            </div>
            
            <div className="tile-container" id="tile-container"></div>
          </div>
        </main>

        <footer className="footer">
          <div className="controls">
            <button className="btn-new ui-liquid-wrapper" onClick={() => {
              // @ts-ignore
              if (window.game) window.game.restart();
            }}>
              <span className="liquidGlass-effect"></span>
              <span className="liquidGlass-tint"></span>
              <span className="liquidGlass-shine"></span>
              <span className="liquidGlass-content">New Game</span>
            </button>
            <button className="btn-undo ui-liquid-wrapper" id="undo-btn" onClick={() => {
              // @ts-ignore
              if (window.game) window.game.undo();
            }}>
              <span className="liquidGlass-effect"></span>
              <span className="liquidGlass-tint"></span>
              <span className="liquidGlass-shine"></span>
              <span className="liquidGlass-content">Undo (<span id="undo-count">3</span>)</span>
            </button>
          </div>
          <div className="button-spacer" style={{ height: '60px' }}></div>
        </footer>
      </div>
    </>
  );
}
