export const config = {
  api: {
    baseUrl: process.env.REACT_APP_API_URL || "http://localhost:3001/api",
    timeout: 30000,
  },
  websocket: {
    url: process.env.REACT_APP_WS_URL || "ws://localhost:3001/games",
    reconnectInterval: 3000,
    maxReconnectAttempts: 20,
  },
  game: {
    genres: [
      "Pop",
      "Rock",
      "Rap/Hip Hop",
      "Dance",
      "R&B",
      "Reggae",
      "Metal",
      "Iskelmä",
      "Latin Music",
    ],
    years: ["1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
    timePerSongOptions: [15, 20, 30, 40, 60],
    songCountOptions: [5, 10, 15, 20],
    minPlayers: 2,
    countdownDuration: 10,
  },
  youtube: {
    apiKey: process.env.REACT_APP_YOUTUBE_API_KEY || "",
  }
} as const;

export default config;
