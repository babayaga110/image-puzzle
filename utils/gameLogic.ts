// Check if two slots are adjacent (up, down, left, right)
export const isAdjacent = (index1: number, index2: number, size: number): boolean => {
  const row1 = Math.floor(index1 / size);
  const col1 = index1 % size;
  const row2 = Math.floor(index2 / size);
  const col2 = index2 % size;

  return (
    (Math.abs(row1 - row2) === 1 && col1 === col2) ||
    (Math.abs(col1 - col2) === 1 && row1 === row2)
  );
};

// Generate a solved grid: [0, 1, 2, ..., size*size - 1]
// Where array index = tile ID, value = current slot
// Actually for our state we want: map tileID -> currentSlot
export const generateSolvedState = (size: number): number[] => {
  const total = size * size;
  // Initially tile 0 is at slot 0, tile 1 at slot 1, etc.
  return Array.from({ length: total }, (_, i) => i);
};

// Shuffle by simulating valid moves to ensure solvability
export const shuffleGrid = (size: number, moves = 150): number[] => {
  const total = size * size;
  // Current position of the empty tile (the last tile ID)
  let emptySlot = total - 1;
  
  // State: mapping of Slot Index -> Tile ID
  // This is easier for shuffling logic, we convert back to TileID -> Slot later
  const slots = Array.from({ length: total }, (_, i) => i);

  let previousSlot = -1;

  for (let i = 0; i < moves; i++) {
    // Find neighbors of empty slot
    const row = Math.floor(emptySlot / size);
    const col = emptySlot % size;
    const neighbors = [];

    if (row > 0) neighbors.push(emptySlot - size); // Up
    if (row < size - 1) neighbors.push(emptySlot + size); // Down
    if (col > 0) neighbors.push(emptySlot - 1); // Left
    if (col < size - 1) neighbors.push(emptySlot + 1); // Right

    // Don't undo the immediate last move if possible, to promote mixing
    const validNeighbors = neighbors.filter(n => n !== previousSlot);
    const candidates = validNeighbors.length > 0 ? validNeighbors : neighbors;
    
    // Pick random neighbor
    const randomNeighborSlot = candidates[Math.floor(Math.random() * candidates.length)];

    // Swap empty slot with neighbor
    const tileAtNeighbor = slots[randomNeighborSlot];
    const tileAtEmpty = slots[emptySlot]; // This is the "empty" tile ID

    slots[emptySlot] = tileAtNeighbor;
    slots[randomNeighborSlot] = tileAtEmpty;

    previousSlot = emptySlot;
    emptySlot = randomNeighborSlot;
  }

  // Convert Slot -> TileID map  TO  TileID -> Slot map
  const finalState = new Array(total).fill(0);
  for (let s = 0; s < total; s++) {
    const tileId = slots[s];
    finalState[tileId] = s;
  }
  
  return finalState;
};

export const checkWin = (currentSlots: number[]): boolean => {
  // Win if every tile ID i is at slot i
  return currentSlots.every((slot, id) => slot === id);
};