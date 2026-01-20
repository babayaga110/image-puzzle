import React, { useState, useEffect } from 'react';
import { GameState, GridSize } from './types';
import AttractScreen from './components/AttractScreen';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import WinScreen from './components/WinScreen';
import { IDLE_TIMEOUT_MS } from './constants';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  
  // Game Config State
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [gridSize, setGridSize] = useState<GridSize>(3);
  
  // Results State
  const [winStats, setWinStats] = useState({ time: 0, moves: 0 });

  // Idle Timer Logic
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const resetIdleTimer = () => {
      if (gameState === GameState.IDLE) return;
      
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // Only go to idle if we aren't already there
        setGameState(GameState.IDLE);
      }, IDLE_TIMEOUT_MS);
    };

    // Events to track activity
    const events = ['mousedown', 'touchstart', 'click', 'keydown'];
    events.forEach(event => window.addEventListener(event, resetIdleTimer));

    resetIdleTimer(); // Start timer

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, resetIdleTimer));
    };
  }, [gameState]);

  // Navigation Handlers
  const handleStartApp = () => {
    setGameState(GameState.START);
  };

  const handleStartGame = (image: string, size: GridSize) => {
    setSelectedImage(image);
    setGridSize(size);
    setGameState(GameState.PLAYING);
  };

  const handleWin = (time: number, moves: number) => {
    setWinStats({ time, moves });
    setGameState(GameState.WON);
  };

  const handleReplay = () => {
    setGameState(GameState.PLAYING);
  };

  const handleNewGame = () => {
    setGameState(GameState.START);
  };

  return (
    <div className="w-screen h-screen bg-slate-950 text-slate-100 overflow-hidden relative selection:bg-cyan-500/30">
      
      {gameState === GameState.IDLE && (
        <AttractScreen onStart={handleStartApp} />
      )}

      {gameState === GameState.START && (
        <StartScreen onStartGame={handleStartGame} />
      )}

      {gameState === GameState.PLAYING && (
        <GameScreen 
          image={selectedImage}
          size={gridSize}
          onWin={handleWin}
          onExit={handleNewGame}
        />
      )}

      {gameState === GameState.WON && (
        <WinScreen 
          image={selectedImage}
          time={winStats.time}
          moves={winStats.moves}
          onReplay={handleReplay}
          onNewGame={handleNewGame}
        />
      )}
      
      {/* Background ambience overlay (noise/vignette) */}
      <div className="absolute inset-0 pointer-events-none z-50 mix-blend-overlay opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  );
};

export default App;