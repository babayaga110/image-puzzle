import React, { useEffect, useState } from 'react';
import { GridSize } from '../types';
import PuzzleBoard from './PuzzleBoard';
import { Clock, Move, RotateCcw, ArrowLeft } from 'lucide-react';
import { generateSolvedState, shuffleGrid, isAdjacent, checkWin } from '../utils/gameLogic';

interface GameScreenProps {
  image: string;
  size: GridSize;
  onWin: (time: number, moves: number) => void;
  onExit: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ image, size, onWin, onExit }) => {
  // Map of TileID -> CurrentSlot
  const [tileState, setTileState] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize game
  useEffect(() => {
    // Start with a brief solved state so user sees target, then shuffle
    setTileState(generateSolvedState(size));
    
    const timer = setTimeout(() => {
      const shuffled = shuffleGrid(size);
      setTileState(shuffled);
      setIsInitializing(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [image, size]);

  // Game Timer
  useEffect(() => {
    if (isInitializing) return;
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isInitializing]);

  const handleTileClick = (tileId: number) => {
    if (isInitializing) return;

    const currentSlot = tileState[tileId];
    const emptyTileId = size * size - 1;
    const emptySlot = tileState[emptyTileId];

    if (isAdjacent(currentSlot, emptySlot, size)) {
      // Valid move: Swap slots
      const newTileState = [...tileState];
      newTileState[tileId] = emptySlot;
      newTileState[emptyTileId] = currentSlot;
      
      setTileState(newTileState);
      setMoves(m => m + 1);

      // Check win
      if (checkWin(newTileState)) {
        onWin(seconds, moves + 1);
      }
    }
  };

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full w-full flex flex-col md:flex-row animate-in fade-in duration-500">
      
      {/* Sidebar / Topbar */}
      <div className="w-full md:w-80 p-6 flex flex-row md:flex-col gap-4 justify-between md:justify-start z-10 bg-slate-900/50 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border-b md:border-b-0 md:border-r border-slate-700">
        <button 
          onClick={onExit}
          className="p-3 bg-slate-800 rounded-xl border border-slate-600 hover:bg-red-900/50 hover:border-red-500 transition-colors text-slate-300"
        >
          <ArrowLeft />
        </button>

        <div className="flex flex-row md:flex-col gap-6 flex-1 justify-center md:justify-start">
          <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Clock className="text-blue-400 w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Time</div>
              <div className="text-2xl font-mono text-white brand-font">{formatTime(seconds)}</div>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Move className="text-purple-400 w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Moves</div>
              <div className="text-2xl font-mono text-white brand-font">{moves}</div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => {
            setIsInitializing(true);
            setMoves(0);
            setSeconds(0);
            setTimeout(() => {
                setTileState(shuffleGrid(size));
                setIsInitializing(false);
            }, 500);
          }}
          className="hidden md:flex p-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-600 gap-3 items-center justify-center font-bold transition-all"
        >
          <RotateCcw className="w-5 h-5" /> RESTART
        </button>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 p-4 md:p-8 flex items-center justify-center bg-slate-950/50 relative">
        {isInitializing ? (
           <div className="absolute inset-0 flex items-center justify-center z-50 bg-slate-950/80 backdrop-blur-sm">
             <div className="text-3xl font-black text-cyan-400 animate-pulse brand-font">SHUFFLING...</div>
           </div>
        ) : null}
        
        <PuzzleBoard 
          image={image}
          size={size}
          currentSlots={tileState}
          onTileClick={handleTileClick}
          isWon={false}
        />
      </div>
    </div>
  );
};

export default GameScreen;
