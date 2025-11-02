// src/services/api/gameApi.ts
import { apiClient } from "./apiClient";
import {
  Game,
  CreateGameRequest,
  SubmitAnswerRequest,
  FinalResults,
} from "../../types";

export const gameApi = {
  // Create a new game
  createGame: async (
    settings: CreateGameRequest
  ): Promise<{ gameId: string; game: Game }> => {
    return apiClient.post("/games", settings);
  },

  // Get game by ID
  getGame: async (gameId: string): Promise<Game> => {
    return apiClient.get(`/games/${gameId}`);
  },

  // Join a game
  joinGame: async (
    gameId: string,
    playerName: string
  ): Promise<{ playerId: string; game: Game }> => {
    return apiClient.post(`/games/${gameId}/join`, { playerName });
  },

  // Start a game
  startGame: async (gameId: string): Promise<void> => {
    return apiClient.post(`/games/${gameId}/start`);
  },

  // Cancel a game
  cancelGame: async (gameId: string): Promise<void> => {
    return apiClient.delete(`/games/${gameId}`);
  },

  // Leave a game
  leaveGame: async (gameId: string, playerId: string): Promise<void> => {
    return apiClient.delete(`/games/${gameId}/players/${playerId}`);
  },

  // Submit an answer
  submitAnswer: async (
    gameId: string,
    answer: SubmitAnswerRequest
  ): Promise<void> => {
    return apiClient.post(`/games/${gameId}/answers`, answer);
  },

  // Get final results
  getFinalResults: async (gameId: string): Promise<FinalResults> => {
    return apiClient.get(`/games/${gameId}/results`);
  },

  // Get song data
  getSongData: async (songId: string): Promise<any> => {
    return apiClient.get(`/songs/${songId}`);
  },
};
