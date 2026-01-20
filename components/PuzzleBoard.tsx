import React, { useMemo } from 'react';
import { GridSize } from '../types';

interface PuzzleBoardProps {
  image: string;
  size: GridSize;
  currentSlots: number[]; // Index = Tile ID, Value = Current Slot
  onTileClick: (tileId: number) => void;
  isWon: boolean;
  isShuffling?: boolean;
}

const PuzzleBoard: React.FC<PuzzleBoardProps> = ({ image, size, currentSlots, onTileClick, isWon, isShuffling }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // Calculate tile dimensions
  // We use percentage logic for fluid responsiveness
  const tilePercentage = 100 / size;
  
  // We need to render N*N tiles.
  // The last tile (ID = size*size - 1) is the empty one.
  const tiles = useMemo(() => {
    return Array.from({ length: size * size }, (_, i) => i);
  }, [size]);

  return (
    <div 
      className="relative aspect-square w-full max-w-[80vh] bg-slate-800 rounded-xl overflow-hidden shadow-2xl border-4 border-slate-700"
      ref={containerRef}
    >
      {/* Background hint (faint) */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none grayscale"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {tiles.map((tileId) => {
        const isEmptyTile = tileId === size * size - 1;
        
        // If it's the empty tile and we haven't won, don't render it (or render transparent)
        // If won, we typically fill the hole.
        if (isEmptyTile && !isWon) return null;

        const currentSlot = currentSlots[tileId];
        const currentRow = Math.floor(currentSlot / size);
        const currentCol = currentSlot % size;

        // Original position for background
        const originalRow = Math.floor(tileId / size);
        const originalCol = tileId % size;

        return (
          <div
            key={tileId}
            onClick={() => !isWon && !isShuffling && onTileClick(tileId)}
            className={`absolute ${isShuffling ? '' : 'transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]'} cursor-pointer ${
               isWon ? 'z-10' : 'z-20'
            } ${!isShuffling && !isWon ? 'hover:brightness-110 active:scale-95' : ''}`}
            style={{
              width: `calc(${tilePercentage}% - 4px)`, // Subtract gap
              height: `calc(${tilePercentage}% - 4px)`,
              left: `${currentCol * tilePercentage}%`,
              top: `${currentRow * tilePercentage}%`,
              margin: '2px', // Half gap
              backgroundImage: `url(${image})`,
              backgroundSize: `${size * 100}% ${size * 100}%`, // Scale background to cover full virtual grid
              backgroundPosition: `${(originalCol / (size - 1)) * 100}% ${(originalRow / (size - 1)) * 100}%`,
              borderRadius: isWon ? '0px' : '8px',
              boxShadow: isWon ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255,255,255,0.1)'
            }}
          >
            {/* Debug number overlay - can be removed for prod, but useful for accessibility or style */}
            {!isWon && (
                <div className="absolute top-1 left-2 text-white/50 text-xs font-bold drop-shadow-md">
                    {/* {tileId + 1} */} 
                </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PuzzleBoard;