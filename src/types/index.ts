// Game Types
export interface GameSettings {
  creatorName: string;
  timePerSong: number;
  songCount: number;
  genres: string[];
  years: string[];
}

export interface Player {
  id: string;
  name: string;
  score: number;
  isReady: boolean;
  answers?: Answer[];
}

export interface Answer {
  songId: string;
  guess: {
    artist: string;
    songName: string;
  };
  timestamp: Date;
  points: number;
}

export type GameStatus = "lobby" | "countdown" | "playing" | "finished";

export interface Game {
  gameId: string;
  settings: GameSettings;
  players: Player[];
  creator: string;
  status: GameStatus;
  currentSong: number;
  songs: Song[];
  createdAt: Date;
  startedAt?: Date;
  finishedAt?: Date;
}

// Song Types
export interface Song {
  id: string;
  artist: string;
  title: string;
  audioUrl: string;
  duration?: number;
  genre: string;
  year?: string;
  albumCover?: string;
}

// Result Types
export interface RoundResult {
  roundNumber: number;
  correctAnswer: {
    artist: string;
    songName: string;
  };
  playerScores: PlayerRoundScore[];
}

export interface PlayerRoundScore {
  playerId: string;
  playerName: string;
  guess: {
    artist: string;
    songName: string;
  };
  pointsEarned: number;
  totalScore: number;
  breakdown: {
    artistPoints: number;
    songPoints: number;
    speedBonus: number;
  };
}

export interface FinalResults {
  gameId: string;
  finalScores: FinalPlayerScore[];
  gameSettings: GameSettings;
}

export interface FinalPlayerScore {
  playerId: string;
  playerName: string;
  totalScore: number;
  placement: number;
  correctArtists: number;
  correctSongs: number;
  averageTime: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: any;
}

// Request Types
export interface CreateGameRequest {
  creatorName: string;
  timePerSong: number;
  songCount: number;
  genres?: string[];
  years?: string[];
}

export interface SubmitAnswerRequest {
  gameId: string;
  playerId: string;
  songId: string;
  guess: {
    artist: string;
    songName: string;
  };
  timestamp: Date;
}

export interface LocationState {
  playerName: string;
  playerId: string;
  isCreator: boolean;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  isReady: boolean;
}

export interface AnswerSubmittedPayload {
  game: Game;
}

export interface AllPlayersReadyPayload {
  result: RoundResult;
}


