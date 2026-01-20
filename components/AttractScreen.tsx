import React from 'react';
import { Play } from 'lucide-react';
import { audio } from '../utils/audio';

interface AttractScreenProps {
  onStart: () => void;
}

const AttractScreen: React.FC<AttractScreenProps> = ({ onStart }) => {
  const handleClick = () => {
    audio.init(); // Important: Unlock AudioContext on user interaction
    audio.playStart();
    onStart();
  };

  return (
    <div 
      onClick={handleClick}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 bg-[url('https://picsum.photos/id/1040/1920/1080')] bg-cover bg-center"
    >
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" />
      
      <div className="relative z-10 text-center animate-pulse cursor-pointer">
        <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-8 drop-shadow-2xl brand-font">
          PUZZLE
          <br />
          CHALLENGE
        </h1>
        <div className="inline-flex items-center gap-4 bg-cyan-500/20 px-12 py-6 rounded-full border border-cyan-500/50 hover:bg-cyan-500/30 transition-all shadow-[0_0_30px_rgba(6,182,212,0.5)]">
          <Play className="w-12 h-12 text-cyan-300 fill-cyan-300" />
          <span className="text-4xl font-bold text-cyan-100 tracking-wider">TAP TO START</span>
        </div>
      </div>
    </div>
  );
};

export default AttractScreen;