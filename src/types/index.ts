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

// WebSocket Types
export enum WSEvent {
  PLAYER_JOINED = "player_joined",
  PLAYER_LEFT = "player_left",
  GAME_STARTED = "game_started",
  GAME_STATUS = "game_status",
  PLAYER_READY = "player_ready",
  ROUND_COMPLETE = "round_complete",
  GAME_COMPLETE = "game_complete",
  ERROR = "error",
}

export interface WSMessage {
  event: WSEvent;
  data: any;
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

export interface JoinGameRequest {
  playerName: string;
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

export interface PlayerJoinedEvent {
  event: "playerJoined";
  payload: { game: Game };
}

export interface StartGameEvent {
  event: "startGame";
  payload: { success: boolean; message?: string };
}

export interface AnswerSubmittedEvent {
  event: "answerSubmitted";
  payload: { game: Game };
}

export interface AllPlayersReadyEvent {
  event: "allPlayersReady";
  payload: { result: RoundResult | null };
}

export interface AnswerSubmitPayload {
  gameId: string;
  playerId: string;
}

export type ServerEvent =
  | PlayerJoinedEvent
  | StartGameEvent
  | AnswerSubmittedEvent
  | AllPlayersReadyEvent;
