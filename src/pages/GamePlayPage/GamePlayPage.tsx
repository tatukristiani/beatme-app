import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  ListGroup,
  Badge,
  ProgressBar,
  Modal,
  Alert,
} from "react-bootstrap";
import { gameApi } from "../../services/api/gameApi";
import { useCountdown } from "../../hooks/useCountdown";
import { Game, RoundResult, Song } from "../../types";
import "./GamePlayPage.css";
import config from "../../config/config";
import { webSocketService } from "../../services/webSocket/WebSocketService";

interface LocationState {
  playerName: string;
  playerId: string;
}

interface Player {
  id: string;
  name: string;
  score: number;
  isReady: boolean;
}

interface AnswerSubmittedPayload {
  game: Game;
}

interface AllPlayersReadyPayload {
  result: RoundResult;
}

const GamePlayPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const audioRef = useRef<AudioPlayer>(null);

  const [artistGuess, setArtistGuess] = useState("");
  const [songGuess, setSongGuess] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showScores, setShowScores] = useState(false);
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [game, setGame] = useState<Game | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  const { seconds, isRunning, start, stop, reset } = useCountdown(
    30,
    async () => {
      console.log("Time's up! Auto-submitting answer.");
      await handleReady();
    }
  );

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current && audioRef.current.audio.current) {
      audioRef.current.audio.current.volume = volume / 100;
    }
  }, [volume]);

  // Fetch song data when game updates
  useEffect(() => {
    if (!game) return;

    const fetchSongData = async () => {
      try {
        const currentSongId = game.songs[game.currentSong];
        const songData = await gameApi.getSongData(currentSongId.toString());
        console.log("Fetched song data:", songData);
        setCurrentSong(songData.song);
        setPreviewUrl(songData.song.audioUrl);
        setIsPlaying(true);
      } catch (err) {
        console.error("Error fetching song data:", err);
        setError("Failed to load song data");
      }
    };

    fetchSongData();
  }, [game]);

  // Main game initialization and WebSocket setup
  useEffect(() => {
    if (!gameId) return;

    setLoading(true);
    setError("");

    if (!gameId || !state?.playerId) {
      setError("Game ID or player ID missing.");
      setLoading(false);
      return;
    }

    const fetchGame = async () => {
      try {
        const fetchedGame = await gameApi.getGame(gameId);
        console.log("Fetched game details:", fetchedGame);

        if (fetchedGame.currentSong >= fetchedGame.songs.length) {
          navigate(`/results/${gameId}`, {
            state: {
              playerName: state?.playerName,
              playerId: state?.playerId,
            },
          });
          return;
        }
        setGame(fetchedGame);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch game details.");
        setLoading(false);
      }
    };

    // Check if game is complete
    if (
      game?.currentSong != null &&
      game.currentSong + 1 >= game?.settings.songCount
    ) {
      navigate(`/results/${gameId}`, {
        state: {
          playerName: state?.playerName,
          playerId: state?.playerId,
        },
      });
      return;
    }

    fetchGame();
    webSocketService.connect(config.websocket.url);

    if (!isRunning) start();

    // WebSocket event handlers
    const handleAnswerSubmitted = (payload: AnswerSubmittedPayload) => {
      console.log(
        `Answer submitted event received. Data: ${JSON.stringify(payload)}`
      );
      setGame(payload.game);
    };

    const handleAllPlayersReady = (payload: AllPlayersReadyPayload) => {
      console.log(
        `All players are ready event received. Data: ${JSON.stringify(payload)}`
      );
      setRoundResult(payload.result);
      setShowScores(true);

      setTimeout(() => {
        setShowScores(false);
        setIsReady(false);
        setArtistGuess("");
        setSongGuess("");
        fetchGame();
        reset();
        start();
      }, 10000);
    };

    webSocketService.on("answerSubmitted", handleAnswerSubmitted);
    webSocketService.on("allPlayersReady", handleAllPlayersReady);

    return () => {
      webSocketService.off("answerSubmitted", handleAnswerSubmitted);
      webSocketService.off("allPlayersReady", handleAllPlayersReady);
    };
  }, [gameId, navigate, state?.playerId]);

  const handleReady = async () => {
    if (isReady || !gameId) return;

    setIsReady(true);
    stop();

    // Pause audio when answer is submitted
    if (audioRef.current && audioRef.current.audio.current) {
      audioRef.current.audio.current.pause();
      setIsPlaying(false);
    }

    const submitMessage = {
      gameId: gameId,
      playerId: state.playerId,
      songId: game?.songs[game.currentSong].toString() || "",
      guess: { artist: artistGuess, songName: songGuess },
      timestamp: new Date(),
    };

    webSocketService.send("submitAnswer", submitMessage);
  };

  const togglePlayPause = () => {
    if (audioRef.current && audioRef.current.audio.current) {
      if (isPlaying) {
        audioRef.current.audio.current.pause();
      } else {
        audioRef.current.audio.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioPlay = () => {
    setIsPlaying(true);
  };

  const handleAudioPause = () => {
    setIsPlaying(false);
  };

  if (loading) {
    return (
      <div className="py-5 text-center container-fluid">
        <div
          className="spinner-border text-primary mb-3"
          style={{ width: "3rem", height: "3rem" }}
        />
        <p className="mt-3 fs-5">Loading game...</p>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="py-5 text-center container-fluid">
        <Alert
          variant="danger"
          className="border-0 shadow-lg"
          style={{ maxWidth: "500px", margin: "0 auto" }}
        >
          {error || "Game not found"}
        </Alert>
      </div>
    );
  }

  const currentSongNumber = game.currentSong + 1;
  const totalSongs = game.settings.songCount;
  const progressPercent = (currentSongNumber / totalSongs) * 100;

  return (
    <div className="play-page py-4 container-fluid position-relative overflow-hidden">
      {/* Background */}
      <div
        className="position-absolute w-100 h-100 top-0 start-0"
        style={{ zIndex: 0 }}
      >
        <div
          className="position-absolute rounded-circle opacity-10"
          style={{
            width: "500px",
            height: "500px",
            top: "-100px",
            right: "-100px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      <Row
        className="justify-content-center position-relative"
        style={{ zIndex: 1 }}
      >
        <Col lg={10} xl={9}>
          {/* Progress Card */}
          <Card
            className="shadow-lg mb-4 border-0"
            style={{
              backdropFilter: "blur(20px)",
              background: "rgba(255, 255, 255, 0.95)",
            }}
          >
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="mb-1 fw-bold">
                    <span className="me-2">🎵</span>
                    Song {currentSongNumber} of {totalSongs}
                  </h5>
                  <small className="text-muted">Keep guessing!</small>
                </div>
                <Badge
                  className="px-4 py-3 fs-5"
                  style={{
                    background:
                      seconds <= 10
                        ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "12px",
                    animation:
                      seconds <= 10 ? "pulse-danger 1s infinite" : "none",
                  }}
                >
                  ⏱️ {seconds}s
                </Badge>
              </div>
              <ProgressBar
                now={progressPercent}
                style={{ height: "12px", borderRadius: "10px" }}
              >
                <ProgressBar
                  now={progressPercent}
                  style={{
                    background:
                      "linear-gradient(90deg, #10b981 0%, #059669 100%)",
                  }}
                />
              </ProgressBar>
            </Card.Body>
          </Card>

          <Row>
            <Col lg={8}>
              {/* Player Card */}
              <Card
                className="shadow-lg mb-4 border-0"
                style={{
                  backdropFilter: "blur(20px)",
                  background: "rgba(255, 255, 255, 0.95)",
                }}
              >
                <Card.Body className="p-4 p-md-5">
                  {/* Music Visual */}
                  <div className="text-center mb-4">
                    <div
                      className="d-inline-flex align-items-center justify-content-center mb-3 position-relative"
                      style={{ width: "140px", height: "140px" }}
                    >
                      <div
                        className="position-absolute w-100 h-100 rounded-circle"
                        style={{
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          opacity: 0.2,
                          animation: isPlaying
                            ? "pulse-ring 2s ease-out infinite"
                            : "none",
                        }}
                      />
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center position-relative"
                        style={{
                          width: "120px",
                          height: "120px",
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          boxShadow: "0 10px 40px rgba(102, 126, 234, 0.4)",
                          animation: isPlaying
                            ? "spin 3s linear infinite"
                            : "none",
                        }}
                      >
                        <span style={{ fontSize: "3rem" }}>🎵</span>
                      </div>
                    </div>
                    <h4 className="mb-0">Now Playing...</h4>
                    <p className="text-muted">
                      Listen carefully and make your guess
                    </p>
                  </div>

                  {/* Hidden Audio Player - just for playback control */}
                  <div style={{ display: "none" }}>
                    <AudioPlayer
                      ref={audioRef}
                      src={previewUrl || ""}
                      autoPlay
                      loop
                      onPlay={handleAudioPlay}
                      onPause={handleAudioPause}
                    />
                  </div>

                  {/* Custom Audio Controls */}
                  <div
                    className="mb-4 p-4 rounded-3"
                    style={{
                      background:
                        "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                    }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <Button
                        onClick={togglePlayPause}
                        size="lg"
                        className="border-0 rounded-circle"
                        style={{
                          width: "60px",
                          height: "60px",
                          background: isPlaying
                            ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                            : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                          boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                          fontSize: "1.5rem",
                        }}
                      >
                        {isPlaying ? "⏸️" : "▶️"}
                      </Button>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <Form.Label className="mb-0 small fw-semibold text-secondary">
                            <span className="me-1">🔊</span>
                            Volume
                          </Form.Label>
                          <span className="text-muted fw-semibold">
                            {volume}%
                          </span>
                        </div>
                        <Form.Range
                          value={volume}
                          onChange={(e) => setVolume(Number(e.target.value))}
                          style={{
                            height: "8px",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Guess Form */}
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold text-secondary mb-2">
                        <span className="me-2">🎤</span>
                        Artist Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Who's singing?"
                        value={artistGuess}
                        onChange={(e) => setArtistGuess(e.target.value)}
                        disabled={isReady}
                        size="lg"
                        className="border-2 shadow-sm"
                        style={{
                          borderRadius: "12px",
                          background: isReady ? "#f8f9fa" : "white",
                        }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold text-secondary mb-2">
                        <span className="me-2">🎼</span>
                        Song Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="What's the song called?"
                        value={songGuess}
                        onChange={(e) => setSongGuess(e.target.value)}
                        disabled={isReady}
                        size="lg"
                        className="border-2 shadow-sm"
                        style={{
                          borderRadius: "12px",
                          background: isReady ? "#f8f9fa" : "white",
                        }}
                      />
                    </Form.Group>

                    <div className="d-grid">
                      <Button
                        size="lg"
                        onClick={handleReady}
                        disabled={isReady}
                        className="py-3 fw-semibold border-0"
                        style={{
                          background: isReady
                            ? "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)"
                            : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                          borderRadius: "12px",
                          boxShadow: isReady
                            ? "none"
                            : "0 10px 30px rgba(16, 185, 129, 0.4)",
                          transition: "all 0.3s ease",
                          transform: "translateY(0)",
                        }}
                        onMouseEnter={(e) => {
                          if (!isReady) {
                            e.currentTarget.style.transform =
                              "translateY(-2px)";
                            e.currentTarget.style.boxShadow =
                              "0 15px 40px rgba(16, 185, 129, 0.5)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = isReady
                            ? "none"
                            : "0 10px 30px rgba(16, 185, 129, 0.4)";
                        }}
                      >
                        {isReady ? (
                          <>
                            <span className="me-2">✓</span>
                            Locked In
                          </>
                        ) : (
                          <>
                            <span className="me-2">✓</span>
                            Submit Answer
                          </>
                        )}
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              {/* Players Status */}
              <Card
                className="shadow-lg border-0 sticky-top"
                style={{
                  top: "20px",
                  backdropFilter: "blur(20px)",
                  background: "rgba(255, 255, 255, 0.95)",
                }}
              >
                <Card.Header
                  className="border-0 py-3"
                  style={{
                    background:
                      "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
                    color: "white",
                  }}
                >
                  <h5 className="mb-0 fw-semibold">
                    <span className="me-2">👥</span>
                    Players
                  </h5>
                </Card.Header>
                <ListGroup variant="flush">
                  {game.players?.map((player: Player, index: number) => (
                    <ListGroup.Item
                      key={player.id}
                      className="border-0 py-3"
                      style={{
                        background: index % 2 === 0 ? "#fff" : "#f8f9fa",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center me-2"
                            style={{
                              width: "36px",
                              height: "36px",
                              background:
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              color: "white",
                              fontSize: "0.9rem",
                              fontWeight: "bold",
                            }}
                          >
                            {player.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="fw-semibold small">
                              {player.name}
                            </div>
                            <small className="text-muted">
                              <span className="me-1">⭐</span>
                              {player.score} pts
                            </small>
                          </div>
                        </div>
                        {player.isReady && (
                          <Badge
                            className="px-2 py-1"
                            style={{
                              background:
                                "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                            }}
                          >
                            ✓
                          </Badge>
                        )}
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Scores Modal */}
      <Modal show={showScores} centered backdrop="static" size="lg">
        <Modal.Header
          className="border-0 py-4"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <Modal.Title className="w-100 text-center">
            <div className="mb-2" style={{ fontSize: "2.5rem" }}>
              🎉
            </div>
            <h3 className="mb-0">Round Complete!</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {roundResult && (
            <>
              <div
                className="mb-4 p-4 rounded-3 text-center"
                style={{
                  background:
                    "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                  border: "2px solid #10b981",
                }}
              >
                <h6 className="mb-2 text-secondary">
                  <span className="me-2">✓</span>
                  Correct Answer
                </h6>
                <h4 className="mb-1 fw-bold" style={{ color: "#059669" }}>
                  {roundResult.correctAnswer.artist}
                </h4>
                <p className="mb-0 fs-5">
                  "{roundResult.correctAnswer.songName}"
                </p>
              </div>

              <h5 className="mb-3 text-secondary">
                <span className="me-2">🏆</span>
                Leaderboard
              </h5>
              <ListGroup className="shadow-sm">
                {roundResult.playerScores.map((playerScore, index) => (
                  <ListGroup.Item
                    key={playerScore.playerId}
                    className="border-0 py-3"
                    style={{
                      background:
                        index === 0
                          ? "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)"
                          : index % 2 === 0
                          ? "#fff"
                          : "#f8f9fa",
                      borderLeft: index < 3 ? "4px solid" : "none",
                      borderLeftColor:
                        index === 0
                          ? "#f59e0b"
                          : index === 1
                          ? "#94a3b8"
                          : "#cd7f32",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{
                            width: "40px",
                            height: "40px",
                            background:
                              index === 0
                                ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "1.1rem",
                          }}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <div className="fw-bold">
                            {playerScore.playerName}
                            {playerScore.pointsEarned > 0 && (
                              <Badge
                                className="ms-2 px-2 py-1"
                                style={{
                                  background:
                                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                }}
                              >
                                +{playerScore.pointsEarned}
                              </Badge>
                            )}
                          </div>
                          <small className="text-muted">Total Score</small>
                        </div>
                      </div>
                      <div className="text-end">
                        <div
                          className="fs-4 fw-bold"
                          style={{
                            color: index === 0 ? "#d97706" : "#667eea",
                          }}
                        >
                          {playerScore.totalScore}
                        </div>
                        <small className="text-muted">points</small>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <div
                className="text-center mt-4 p-3 rounded-3"
                style={{
                  background:
                    "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
                }}
              >
                <div className="mb-2">
                  <div className="spinner-border spinner-border-sm text-primary me-2" />
                  <span className="text-muted">Next song starting soon...</span>
                </div>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>

      <style>{`
        @keyframes pulse-danger {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 0.3; }
          100% { transform: scale(1.15); opacity: 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default GamePlayPage;
