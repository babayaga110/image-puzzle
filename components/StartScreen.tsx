import React, { useState } from 'react';
import { SAMPLE_IMAGES } from '../constants';
import { GridSize } from '../types';
import { Upload, Image as ImageIcon, Check, Play } from 'lucide-react';
import { audio } from '../utils/audio';

interface StartScreenProps {
  onStartGame: (image: string, size: GridSize) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartGame }) => {
  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_IMAGES[0]);
  const [difficulty, setDifficulty] = useState<GridSize>(3);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      audio.playSelect();
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setSelectedImage(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageSelect = (img: string) => {
    if (selectedImage !== img) {
        audio.playClick();
        setSelectedImage(img);
    }
  };

  const handleDifficultySelect = (size: GridSize) => {
    if (difficulty !== size) {
        audio.playClick();
        setDifficulty(size);
    }
  };

  const handleStart = () => {
      audio.playStart();
      onStartGame(selectedImage, difficulty);
  };

  return (
    <div className="h-full w-full flex flex-col md:flex-row p-8 gap-8 animate-in fade-in duration-500">
      {/* Left Panel - Image Selection */}
      <div className="flex-1 glass-panel rounded-3xl p-6 flex flex-col min-h-0">
        <h2 className="text-3xl font-bold text-cyan-400 mb-6 flex items-center gap-3">
          <ImageIcon className="w-8 h-8" />
          CHOOSE IMAGE
        </h2>
        
        {/* Main Preview */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-900 shadow-xl mb-6 group">
            <img 
              src={selectedImage} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-6">
                <span className="text-white/80 font-mono text-sm">CURRENT SELECTION</span>
            </div>
        </div>

        {/* Thumbnails */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {SAMPLE_IMAGES.map((img, idx) => (
            <button
              key={idx}
              onClick={() => handleImageSelect(img)}
              className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105 active:scale-95 ${selectedImage === img ? 'border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'border-transparent opacity-60 hover:opacity-100'}`}
            >
              <img src={img} alt={`Sample ${idx}`} className="w-full h-full object-cover" />
              {selectedImage === img && (
                <div className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center">
                  <Check className="w-8 h-8 text-white drop-shadow-md" />
                </div>
              )}
            </button>
          ))}
          
          {/* Upload Button */}
          <label className="relative aspect-square rounded-xl border-2 border-dashed border-slate-500 hover:border-cyan-400 hover:bg-slate-800/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-cyan-400">
            <Upload className="w-8 h-8" />
            <span className="text-xs font-bold">UPLOAD</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      </div>

      {/* Right Panel - Settings & Start */}
      <div className="w-full md:w-96 flex flex-col gap-6">
        <div className="glass-panel rounded-3xl p-6">
          <h2 className="text-2xl font-bold text-cyan-400 mb-6">DIFFICULTY</h2>
          <div className="grid grid-cols-1 gap-4">
            {[3, 4, 5].map((size) => (
              <button
                key={size}
                onClick={() => handleDifficultySelect(size as GridSize)}
                className={`p-4 rounded-xl border-2 flex items-center justify-between transition-all ${
                  difficulty === size 
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_15px_rgba(34,211,238,0.3)]' 
                    : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-800'
                }`}
              >
                <div className="flex flex-col items-start">
                  <span className="text-xl font-black brand-font">{size} x {size}</span>
                  <span className="text-xs uppercase opacity-70">
                    {size === 3 ? 'Easy' : size === 4 ? 'Normal' : 'Expert'}
                  </span>
                </div>
                {difficulty === size && <Check className="w-6 h-6" />}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleStart}
          className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-3xl p-8 flex flex-col items-center justify-center gap-4 shadow-lg hover:shadow-cyan-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="text-4xl font-black brand-font tracking-wider">START</span>
          <Play className="w-12 h-12 fill-white" />
        </button>
      </div>
    </div>
  );
};

export default StartScreen;