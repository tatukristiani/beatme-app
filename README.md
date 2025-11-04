# 🎵 BeatMe - Multiplayer Song Guessing Game

A real-time multiplayer web application where players compete to guess song titles and artists. Built as a fun project for my younger brother who wanted to challenge his friends' music knowledge!

## 🎮 What It Does

BeatMe is an interactive music guessing game that brings the excitement of music trivia to your browser:

- **Create Custom Games**: Set up games with configurable settings (song count, time limits, genres, decades)
- **Multiplayer Action**: Invite friends using a shareable game code
- **Real-Time Competition**: Live score updates and player status tracking
- **YouTube Integration**: Automatically fetches and plays song previews from YouTube

## 🎯 How It Works

1. **Host Creates Game**: Choose number of songs, time per song, and filter by genre/decade
2. **Players Join**: Friends join using a unique game code
3. **Gameplay**: Listen to song clips and guess the artist and title
4. **Scoring**: Earn points for correct answers
5. **Results**: See final leaderboard with detailed statistics

## 🛠️ Technologies Used

### Frontend
- **React** with TypeScript for type-safe component development
- **React Router** for seamless navigation
- **Bootstrap** for UI components
- **WebSockets** for real-time game state synchronization
- **YouTube API** for fetching and playing song previews

### Key Features Demonstrated
- Real-time bidirectional communication with WebSocket
- State management across multiple components
- RESTful API integration

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── YouTubePreview   # YouTube player integration
│   
├── pages/              # Route-based page components
│   ├── HomePage        # Landing page
│   ├── CreateGamePage  # Game creation
│   ├── JoinGamePage    # Game joining
│   ├── GameLobbyPage   # Pre-game waiting room
│   ├── GamePlayPage    # Active gameplay
│   └── ResultsPage     # Final scores
├── services/           # Business logic & external services
│   ├── api/           # REST API client
│   └── webSocket/     # WebSocket service
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
└── config/            # Application configuration
```

## 📝 Personal Note

This project was born from my little brother's request for a fun way to compete with his friends over their music knowledge. What started as a simple idea evolved into a full-featured multiplayer application. Building this taught me a lot about real-time systems, game state management, and creating engaging user experiences.

## 🔮 Future Enhancement Ideas

- [ ] Spotify API integration for broader music library
- [ ] Custom playlist support
- [ ] Player statistics and history

## 📄 License

MIT License - feel free to use this project for learning or building your own version!

---