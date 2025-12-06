// Game types
export interface Tile {
  id: number;
  value: number;
  merged: boolean;
}

export interface Position {
  row: number;
  col: number;
}

export interface Movement {
  tile: Tile;
  from: Position;
  to: Position;
}

export interface Merge {
  tiles: Tile[];
  result: Tile;
  position: Position;
}

export interface GameState {
  grid: (Tile | null)[][];
  score: number;
  undoCount: number;
  randomSeed: number;
  tileId: number;
}

// User and score types
export interface User {
  id: string;
  googleId: string;
  email: string;
  name: string;
  avatarUrl: string;
  createdAt: Date;
}

export interface Score {
  id: string;
  userId: string;
  score: number;
  maxTile: number;
  moves: number;
  gameDuration: number;
  createdAt: Date;
  user?: User;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  score: number;
  maxTile: number;
  createdAt: Date;
}
