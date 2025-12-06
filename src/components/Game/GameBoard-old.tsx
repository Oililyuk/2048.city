'use client';

import { useEffect, useRef, useState } from 'react';
import { Game2048 } from './game-logic';
import styles from './game.module.css';
import './game-global.css'; // 导入全局样式（用于动态创建的游戏方块）

interface GameBoardProps {
  session: any;
  onScoreSubmit?: (score: number, maxTile: number) => Promise<void>;
}

export default function GameBoard({ session, onScoreSubmit }: GameBoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game2048 | null>(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // 初始化游戏
    const game = new Game2048(containerRef.current);
    gameRef.current = game;

    // 设置分数更新回调
    game.onScoreUpdate = (newScore: number, newBest: number) => {
      setScore(newScore);
      setBestScore(newBest);
    };

    // 设置游戏结束回调
    game.onGameEnd = async (finalScore: number, won: boolean) => {
      if (session?.user && onScoreSubmit) {
        try {
          // 计算最大方块
          let maxTile = 0;
          for (let i = 0; i < game.size; i++) {
            for (let j = 0; j < game.size; j++) {
              const tile = game.grid[i][j];
              if (tile && tile.value > maxTile) {
                maxTile = tile.value;
              }
            }
          }
          
          await onScoreSubmit(finalScore, maxTile);
        } catch (error) {
          console.error('Failed to submit score:', error);
        }
      }
    };

    // 清理函数
    return () => {
      game.destroy();
    };
  }, [session, onScoreSubmit]);

  const handleRestart = () => {
    if (gameRef.current) {
      gameRef.current.restart();
    }
  };

  const handleUndo = () => {
    if (gameRef.current) {
      gameRef.current.undo();
    }
  };

  return (
    <div ref={containerRef} className={styles.container}>
      {/* SVG Filter Definitions */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          {/* Liquid Glass Effect Filter */}
          <filter id="glass-distortion">
            <feTurbulence type="fractalNoise" baseFrequency="0.01 0.01" numOctaves={1} seed={5} result="turbulence"/>
            <feGaussianBlur in="turbulence" stdDeviation={3} result="softMap"/>
            <feSpecularLighting in="softMap" surfaceScale={5} specularConstant={1} specularExponent={100} lightingColor="white" result="specLight">
              <fePointLight x={-200} y={-200} z={300}/>
            </feSpecularLighting>
            <feComposite in="specLight" operator="arithmetic" k1={0} k2={1} k3={1} k4={0} result="litImage"/>
            <feDisplacementMap in="SourceGraphic" in2="softMap" scale={15} xChannelSelector="R" yChannelSelector="G"/>
          </filter>
          
          {/* Burst Effect on Merge */}
          <filter id="liquid-burst" x="-100%" y="-100%" width="300%" height="300%">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency={0.015}
              numOctaves={4}
              result="turbulence" />
              
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="turbulence" 
              scale={40}
              xChannelSelector="R" 
              yChannelSelector="G" />
              
            <feGaussianBlur stdDeviation={0.8} />
          </filter>
        </defs>
      </svg>
      
      <header className={styles.header}>
        <h1>2048.city</h1>
        <div className={styles.scoreContainer}>
          <div className={styles.scoreBox}>
            <div className={styles.liquidGlassEffect}></div>
            <div className={styles.liquidGlassTint}></div>
            <div className={styles.liquidGlassShine}></div>
            <div className={styles.liquidGlassContent}>
              <div className={styles.scoreLabel}>Score</div>
              <div className={styles.score} id="score">{score}</div>
            </div>
          </div>
          <div className={styles.scoreBox}>
            <div className={styles.liquidGlassEffect}></div>
            <div className={styles.liquidGlassTint}></div>
            <div className={styles.liquidGlassShine}></div>
            <div className={styles.liquidGlassContent}>
              <div className={styles.scoreLabel}>Best</div>
              <div className={styles.bestScore} id="best-score">{bestScore}</div>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.gameMessage} id="game-message">
          <p></p>
        </div>
        
        <div className={styles.gameContainer}>
          <div className={styles.gridContainer}>
            {/* 4x4 Grid Background */}
            {[...Array(4)].map((_, row) => (
              <div key={row} className={styles.gridRow}>
                {[...Array(4)].map((_, col) => (
                  <div key={col} className={styles.gridCell}></div>
                ))}
              </div>
            ))}
          </div>
          
          <div className={styles.tileContainer} id="tile-container">
            {/* Number tiles will be dynamically generated here */}
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.controls}>
          <button className={styles.btnNew} onClick={handleRestart}>
            <span className={styles.liquidGlassEffect}></span>
            <span className={styles.liquidGlassTint}></span>
            <span className={styles.liquidGlassShine}></span>
            <span className={styles.liquidGlassContent}>New Game</span>
          </button>
          <button className={styles.btnUndo} onClick={handleUndo}>
            <span className={styles.liquidGlassEffect}></span>
            <span className={styles.liquidGlassTint}></span>
            <span className={styles.liquidGlassShine}></span>
            <span className={styles.liquidGlassContent}>Undo</span>
          </button>
        </div>
        <div className={styles.instructions}>
          <p><strong>Free 2048 Game</strong> – Use arrow keys or swipe to play!</p>
        </div>
      </footer>
    </div>
  );
}
