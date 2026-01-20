import React, { useEffect } from 'react';
import { Play, RotateCcw, Trophy } from 'lucide-react';

interface WinScreenProps {
  image: string;
  time: number;
  moves: number;
  onReplay: () => void;
  onNewGame: () => void;
}

// Simple confetti particle system since we can't guarantee external libs
const Confetti: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 rounded-sm animate-fall"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-5%`,
            backgroundColor: ['#22d3ee', '#3b82f6', '#f472b6', '#a855f7'][Math.floor(Math.random() * 4)],
            animationDuration: `${2 + Math.random() * 3}s`,
            animationDelay: `${Math.random() * 2}s`,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-fall {
          animation-name: fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
};

const WinScreen: React.FC<WinScreenProps> = ({ image, time, moves, onReplay, onNewGame }) => {
  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full w-full flex items-center justify-center p-8 bg-slate-900/90 backdrop-blur-md animate-in zoom-in duration-500 relative">
      <Confetti />
      
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-12 items-center z-10">
        
        {/* Left: Image Result */}
        <div className="flex flex-col gap-4">
           <div className="relative aspect-square w-full rounded-2xl overflow-hidden border-4 border-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.3)] rotate-3 hover:rotate-0 transition-transform duration-500">
             <img src={image} className="w-full h-full object-cover" alt="Completed Puzzle" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-6">
                <div className="flex items-center gap-2 text-yellow-400 font-bold text-xl">
                   <Trophy className="fill-yellow-400" /> PUZZLE SOLVED
                </div>
             </div>
           </div>
        </div>

        {/* Right: Stats & Actions */}
        <div className="flex flex-col gap-8 text-center md:text-left">
           <div>
             <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 brand-font mb-2">
               GREAT JOB!
             </h1>
             <p className="text-slate-400 text-lg">You mastered the chaos.</p>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <div className="text-slate-400 text-sm font-bold uppercase mb-1">Total Time</div>
                <div className="text-3xl text-white font-mono">{formatTime(time)}</div>
              </div>
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <div className="text-slate-400 text-sm font-bold uppercase mb-1">Total Moves</div>
                <div className="text-3xl text-white font-mono">{moves}</div>
              </div>
           </div>

           <div className="flex flex-col gap-3">
             <button 
               onClick={onReplay}
               className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 text-xl transition-transform active:scale-95"
             >
                <RotateCcw /> PLAY AGAIN
             </button>
             <button 
               onClick={onNewGame}
               className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-600 flex items-center justify-center gap-2 text-xl transition-colors"
             >
                <Play /> NEW IMAGE
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WinScreen;
