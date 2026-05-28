'use client';

declare global {
  interface Window {
    game?: any;
  }
}

import { useEffect, useMemo, useRef, useState } from 'react';
import { RefreshCcw, Share2, Undo2 } from 'lucide-react';
import './game-global.css';

type GameMode = 'classic' | 'practice' | 'daily';

interface RunStats {
  mode: GameMode;
  score: number;
  bestScore: number;
  maxTile: number;
  moves: number;
  duration: number;
  undoCount: number;
  undoUsed: number;
  seed: number;
  dailyKey?: string;
  isLeaderboardEligible: boolean;
}

interface RunSummary extends RunStats {
  won: boolean;
  board: number[][];
  advice: string[];
}

interface GameBoardProps {
  session: any;
  initialMode?: GameMode;
  onScoreSubmit?: (score: number, maxTile: number) => Promise<void>;
}

const modeOptions: Array<{ value: GameMode; label: string }> = [
  { value: 'classic', label: 'Classic' },
  { value: 'practice', label: 'Practice' },
  { value: 'daily', label: 'Daily' },
];

const modeLabels: Record<GameMode, string> = {
  classic: 'Classic',
  practice: 'Practice',
  daily: 'Daily',
};

function isGameMode(value: string | null): value is GameMode {
  return value === 'classic' || value === 'practice' || value === 'daily';
}

function getDailyKey() {
  return new Date().toISOString().slice(0, 10);
}

function hashToSeed(input: string) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash) || 1;
}

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function formatShareSummary(summary: RunSummary) {
  const board = summary.board
    .map((row) => row.map((cell) => (cell ? String(cell).padStart(5, ' ') : '    .')).join(' '))
    .join('\n');

  return [
    `2048.city ${modeLabels[summary.mode]} run`,
    `Score: ${summary.score.toLocaleString()}`,
    `Max tile: ${summary.maxTile}`,
    `Moves: ${summary.moves}`,
    `Time: ${formatDuration(summary.duration)}`,
    `Seed: ${summary.dailyKey || summary.seed}`,
    '',
    board,
    '',
    'https://2048.city',
  ].join('\n');
}

export default function GameBoard({ session, initialMode = 'classic', onScoreSubmit }: GameBoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<GameMode>(initialMode);

  useEffect(() => {
    const storedMode = window.localStorage.getItem('2048.city.mode');
    if (isGameMode(storedMode) && initialMode === 'classic') {
      setMode(storedMode);
    }
  }, [initialMode]);

  const [stats, setStats] = useState<RunStats | null>(null);
  const [endSummary, setEndSummary] = useState<RunSummary | null>(null);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const dailyKey = useMemo(() => getDailyKey(), []);

  useEffect(() => {
    if (!containerRef.current) return;

    let activeGame: any;
    let cancelled = false;

    async function initGame() {
      const { Game2048 } = await import('./game-logic');
      if (cancelled) return;

      const seed = mode === 'daily' ? hashToSeed(`2048.city:${dailyKey}`) : Date.now();
      window.localStorage.setItem('2048.city.mode', mode);
      setEndSummary(null);
      setSubmitStatus(null);
      setShareStatus(null);

      activeGame = new Game2048({
        mode,
        seed,
        dailyKey: mode === 'daily' ? dailyKey : undefined,
        onStatsUpdate: (nextStats: RunStats) => setStats(nextStats),
        onRestart: () => {
          setEndSummary(null);
          setSubmitStatus(null);
          setShareStatus(null);
        },
        onGameEnd: async (summary: RunSummary) => {
          setEndSummary(summary);
          setShareStatus(null);

          if (!summary.isLeaderboardEligible) {
            setSubmitStatus('Local run saved. Classic and Daily runs without undo qualify for leaderboards.');
            return;
          }

          if (!session?.user) {
            setSubmitStatus(`Sign in to save this ${summary.mode === 'daily' ? 'Daily' : 'Classic'} score.`);
            return;
          }

          try {
            const response = await fetch('/api/scores/submit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                score: summary.score,
                maxTile: summary.maxTile,
                moves: summary.moves,
                gameDuration: summary.duration,
                mode: summary.mode,
                undoUsed: summary.undoUsed,
                seed: summary.seed,
                finalBoard: summary.board,
              }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
              setSubmitStatus(result.isPersonalBest ? 'New personal best saved.' : 'Score saved to the leaderboard.');
              await onScoreSubmit?.(summary.score, summary.maxTile);
            } else if (result.belowThreshold) {
              setSubmitStatus(`Reach ${result.threshold?.minTile || 512} tile or ${result.threshold?.minScore || 2000} points to qualify.`);
            } else {
              setSubmitStatus(result.message || result.error || 'Score was not submitted.');
            }
          } catch (error) {
            console.error('Failed to submit score:', error);
            setSubmitStatus('Score submission failed. The run is still saved locally.');
          }
        },
      });

      window.game = activeGame;
    }

    initGame();

    return () => {
      cancelled = true;
      if (activeGame?.destroy) activeGame.destroy();
      if (window.game === activeGame) delete window.game;
    };
  }, [dailyKey, mode, onScoreSubmit, session?.user]);

  async function shareRun() {
    if (!endSummary) return;

    const text = formatShareSummary(endSummary);
    try {
      if (navigator.share) {
        await navigator.share({
          title: '2048.city run',
          text,
        });
        setShareStatus('Shared.');
      } else {
        await navigator.clipboard.writeText(text);
        setShareStatus('Copied.');
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        setShareStatus('Could not share this run.');
      }
    }
  }

  const currentStats: RunStats = stats || {
    mode,
    score: 0,
    bestScore: 0,
    maxTile: 0,
    moves: 0,
    duration: 0,
    undoCount: mode === 'practice' ? 3 : 0,
    undoUsed: 0,
    seed: mode === 'daily' ? hashToSeed(`2048.city:${dailyKey}`) : 0,
    dailyKey: mode === 'daily' ? dailyKey : undefined,
    isLeaderboardEligible: mode === 'classic',
  };

  return (
    <div className="game-root">
      <div className="container" ref={containerRef}>
        <div className="mode-switch" role="tablist" aria-label="Game mode">
          {modeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`mode-button ${mode === option.value ? 'active' : ''}`}
              aria-selected={mode === option.value}
              role="tab"
              onClick={() => setMode(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="heading">
          <h1 className="game-title">2048</h1>
          <div className="score-container">
            <div className="score-box liquidGlass-wrapper">
              <div className="liquidGlass-effect"></div>
              <div className="liquidGlass-tint"></div>
              <div className="liquidGlass-shine"></div>
              <div className="liquidGlass-content">
                <div className="score-label">Score</div>
                <div className="score" id="score">0</div>
              </div>
            </div>
            <div className="score-box liquidGlass-wrapper">
              <div className="liquidGlass-effect"></div>
              <div className="liquidGlass-tint"></div>
              <div className="liquidGlass-shine"></div>
              <div className="liquidGlass-content">
                <div className="score-label">Best</div>
                <div className="best-score" id="best-score">0</div>
              </div>
            </div>
          </div>
        </div>

        <div className="run-panel" aria-live="polite">
          <div>
            <span>Mode</span>
            <strong>{modeLabels[currentStats.mode]}</strong>
          </div>
          <div>
            <span>Moves</span>
            <strong>{currentStats.moves}</strong>
          </div>
          <div>
            <span>Time</span>
            <strong>{formatDuration(currentStats.duration)}</strong>
          </div>
          <div>
            <span>Max</span>
            <strong>{currentStats.maxTile || 2}</strong>
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

        <div className="footer">
          <div className="controls">
            <button className="btn-new" onClick={() => { if (window.game) window.game.restart(); }}>
              <RefreshCcw size={16} aria-hidden="true" /> New Game
            </button>
            <button className="btn-undo" id="undo-btn" onClick={() => { if (window.game) window.game.undo(); }}>
              <Undo2 size={16} aria-hidden="true" /> Undo (<span id="undo-count">3</span>)
            </button>
          </div>

          {currentStats.dailyKey && (
            <div className="daily-seed">Daily seed {currentStats.dailyKey}</div>
          )}
        </div>

        {endSummary && (
          <section className="post-game-panel" aria-label="Run analysis">
            <div className="post-game-header">
              <div>
                <span className="panel-kicker">{modeLabels[endSummary.mode]} result</span>
                <h2>{endSummary.maxTile >= 2048 ? '2048 reached' : 'Run complete'}</h2>
              </div>
              <button type="button" className="share-run-button" onClick={shareRun}>
                <Share2 size={16} aria-hidden="true" /> Share
              </button>
            </div>
            <div className="result-grid">
              <div><span>Score</span><strong>{endSummary.score.toLocaleString()}</strong></div>
              <div><span>Max</span><strong>{endSummary.maxTile}</strong></div>
              <div><span>Moves</span><strong>{endSummary.moves}</strong></div>
              <div><span>Time</span><strong>{formatDuration(endSummary.duration)}</strong></div>
            </div>
            <ul className="analysis-list">
              {endSummary.advice.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {(submitStatus || shareStatus) && (
              <p className="run-status">{shareStatus || submitStatus}</p>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
