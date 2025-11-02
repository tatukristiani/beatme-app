import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import CreateGamePage from "./pages/CreateGamePage/CreateGamePage";
import JoinGamePage from "./pages/JoinGamePage/JoinGamePage";
import GameLobbyPage from "./pages/GameLobbyPage/GameLobbyPage";
import GamePlayPage from "./pages/GamePlayPage/GamePlayPage";
import ResultsPage from "./pages/ResultsPage/ResultsPage";
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateGamePage />} />
          <Route path="/join" element={<JoinGamePage />} />
          <Route path="/lobby/:gameId" element={<GameLobbyPage />} />
          <Route path="/play/:gameId" element={<GamePlayPage />} />
          <Route path="/results/:gameId" element={<ResultsPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
