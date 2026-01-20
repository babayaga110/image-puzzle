export enum GameState {
  IDLE = 'IDLE',
  START = 'START',
  PLAYING = 'PLAYING',
  WON = 'WON'
}

export type GridSize = 3 | 4 | 5;

export interface PuzzleConfig {
  imageUrl: string;
  gridSize: GridSize;
}

export interface TilePosition {
  tileId: number; // 0 to N-1. The last one is the empty one.
  currentSlot: number; // 0 to N-1. Current position in the grid.
}
