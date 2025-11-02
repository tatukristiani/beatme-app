import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ListGroup,
  Badge,
  Alert,
} from "react-bootstrap";
import { gameApi } from "../../services/api/gameApi";
import { Game } from "../../types";
import "./GameLobbyPage.css";
import config from "../../config/config";
import { webSocketService } from "../../services/webSocket/WebSocketService";

interface LocationState {
  playerName: string;
  playerId: string;
  isCreator: boolean;
}

const GameLobbyPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");
    if (!gameId || !state?.playerName) {
      setError("Invalid game ID or player name");
      setLoading(false);
      return;
    }

    webSocketService.connect(config.websocket.url, () => {
      webSocketService.send("joinGame", {
        gameId: gameId,
        playerId: state.playerId,
      });
    });

    webSocketService.on("playerJoined", (payload: any) => {
      console.log("[GameLobby] Player joined:", payload);
      setGame(payload.game);
    });

    webSocketService.on("startGame", (payload: any) => {
      navigate(`/play/${gameId}`, {
        state: {
          playerName: state?.playerName,
          playerId: state?.playerId,
        },
      });
    });

    setLoading(false);

    return () => {
      webSocketService.off("playerJoined", () => {});
      webSocketService.off("startGame", () => {});
    };
  }, [gameId, navigate, state?.playerId]);

  const handleStartGame = async () => {
    if (!gameId) return;

    try {
      console.log("[GameLobby] Starting game...");
      await gameApi.startGame(gameId);
      webSocketService.send("startGame", { gameId });
      navigate(`/play/${gameId}`, {
        state: {
          playerName: state?.playerName,
          playerId: state?.playerId,
        },
      });
    } catch (err: any) {
      console.error("Error starting game:", err);
      alert(`Failed to start game: ${err.message}`);
    }
  };

  const handleCancelGame = async () => {
    if (!gameId) return;

    try {
      await gameApi.cancelGame(gameId);
      navigate("/");
    } catch (err: any) {
      console.error("Error canceling game:", err);
      navigate("/");
    }
  };

  const handleCopyCode = () => {
    if (gameId) {
      navigator.clipboard.writeText(gameId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="py-5 text-center container-fluid">
        <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted fs-5">Loading game lobby...</p>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="py-5 text-center container-fluid">
        <Alert variant="danger" className="border-0 shadow-lg" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h4 className="mb-3">⚠️ {error || "Game not found"}</h4>
          <Button 
            variant="primary" 
            onClick={() => navigate("/")}
            className="mt-3"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none'
            }}
          >
            Return Home
          </Button>
        </Alert>
      </div>
    );
  }

  const isCreator = state?.isCreator || false;
  const canStartGame = game.players.length >= 2;

  return (
    <div className="lobby-page py-5 container-fluid position-relative overflow-hidden">
      {/* Background Elements */}
      <div className="position-absolute w-100 h-100 top-0 start-0" style={{ zIndex: 0 }}>
        <div className="position-absolute rounded-circle opacity-10"
          style={{ 
            width: '600px', 
            height: '600px', 
            top: '-200px', 
            right: '-200px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            filter: 'blur(100px)'
          }} />
      </div>

      <Row className="justify-content-center position-relative" style={{ zIndex: 1 }}>
        <Col lg={8} xl={7}>
          <Card className="shadow-lg mb-4 border-0" style={{
            backdropFilter: 'blur(20px)',
            background: 'rgba(255, 255, 255, 0.95)'
          }}>
            <Card.Header className="border-0 py-4" style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white'
            }}>
              <div className="d-flex align-items-center">
                <div className="bg-white bg-opacity-25 rounded-circle p-2 me-3">
                  <span style={{ fontSize: '1.5rem' }}>🎵</span>
                </div>
                <h3 className="mb-0 fw-bold">Game Lobby</h3>
              </div>
            </Card.Header>

            <Card.Body className="p-4 p-md-5">
              {/* Game Code Section */}
              <div className="mb-4 p-4 rounded-3 position-relative overflow-hidden" style={{
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                border: '2px dashed #667eea'
              }}>
                <div className="position-absolute top-0 end-0 mt-2 me-2">
                  <Badge bg="primary" className="px-3 py-2">
                    Share this code
                  </Badge>
                </div>
                <h5 className="mb-3 text-secondary">
                  <span className="me-2">🎮</span>
                  Game Code
                </h5>
                <div className="d-flex align-items-center gap-3">
                  <code className="fs-2 text-primary fw-bold flex-grow-1 bg-white px-3 py-2 rounded" style={{
                    letterSpacing: '0.1em',
                    fontFamily: 'monospace'
                  }}>
                    {gameId}
                  </code>
                  <Button
                    size="lg"
                    onClick={handleCopyCode}
                    className="border-0"
                    style={{
                      background: copied 
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      minWidth: '120px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {copied ? (
                      <>
                        <span className="me-2">✓</span>
                        Copied!
                      </>
                    ) : (
                      <>
                        <span className="me-2">📋</span>
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Game Settings */}
              <div className="mb-4 p-4 rounded-3" style={{
                background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                border: '1px solid #e9ecef'
              }}>
                <h5 className="mb-3 text-secondary">
                  <span className="me-2">⚙️</span>
                  Game Settings
                </h5>
                <Row className="g-3">
                  <Col md={6}>
                    <div className="d-flex align-items-center p-2 rounded" style={{ background: '#f8f9fa' }}>
                      <span className="me-2">⏱️</span>
                      <div>
                        <small className="text-muted d-block">Time per song</small>
                        <strong>{game.settings?.timePerSong || 30}s</strong>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex align-items-center p-2 rounded" style={{ background: '#f8f9fa' }}>
                      <span className="me-2">🎵</span>
                      <div>
                        <small className="text-muted d-block">Number of songs</small>
                        <strong>{game.settings?.songCount || 10}</strong>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex align-items-center p-2 rounded" style={{ background: '#f8f9fa' }}>
                      <span className="me-2">🎸</span>
                      <div>
                        <small className="text-muted d-block">Genres</small>
                        <strong>
                          {game.settings?.genres && game.settings.genres.length > 0
                            ? game.settings.genres.join(", ")
                            : "All"}
                        </strong>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex align-items-center p-2 rounded" style={{ background: '#f8f9fa' }}>
                      <span className="me-2">📅</span>
                      <div>
                        <small className="text-muted d-block">Years</small>
                        <strong>
                          {game.settings?.years && game.settings.years.length > 0
                            ? game.settings.years.join(", ")
                            : "All"}
                        </strong>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Players List */}
              <div className="mb-4">
                <h5 className="mb-3 text-secondary d-flex align-items-center justify-content-between">
                  <span>
                    <span className="me-2">👥</span>
                    Players
                  </span>
                  <Badge 
                    className="px-3 py-2"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}
                  >
                    {game?.players?.length || 0} joined
                  </Badge>
                </h5>
                <ListGroup className="shadow-sm">
                  {game.players?.map((player, index) => (
                    <ListGroup.Item
                      key={player.id}
                      className="border-0 py-3"
                      style={{
                        background: index % 2 === 0 ? '#fff' : '#f8f9fa',
                        borderLeft: player.name === state?.playerName ? '4px solid #667eea' : 'none',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <div 
                            className="rounded-circle d-flex align-items-center justify-content-center me-3"
                            style={{
                              width: '40px',
                              height: '40px',
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          >
                            {player.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="fw-semibold">{player.name}</div>
                            <div className="d-flex gap-2 mt-1">
                              {player.name === game.settings?.creatorName && (
                                <Badge bg="warning" text="dark" className="small">
                                  👑 Host
                                </Badge>
                              )}
                              {player.name === state?.playerName && (
                                <Badge 
                                  className="small"
                                  style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                  }}
                                >
                                  You
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Badge 
                          className="px-3 py-2"
                          style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                          }}
                        >
                          ✓ Ready
                        </Badge>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>

              {/* Action Buttons */}
              {isCreator && (
                <div className="d-grid gap-3">
                  <Button
                    size="lg"
                    onClick={handleStartGame}
                    disabled={!canStartGame}
                    className="py-3 fw-semibold border-0"
                    style={{
                      background: canStartGame
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : '#e9ecef',
                      color: canStartGame ? 'white' : '#6c757d',
                      borderRadius: '12px',
                      boxShadow: canStartGame ? '0 10px 30px rgba(16, 185, 129, 0.4)' : 'none',
                      transition: 'all 0.3s ease',
                      transform: 'translateY(0)'
                    }}
                    onMouseEnter={(e) => {
                      if (canStartGame) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 15px 40px rgba(16, 185, 129, 0.5)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = canStartGame ? '0 10px 30px rgba(16, 185, 129, 0.4)' : 'none';
                    }}
                  >
                    <span className="me-2">🚀</span>
                    Start Game
                  </Button>
                  {!canStartGame && (
                    <Alert variant="info" className="mb-0 border-0 text-center" style={{
                      background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)'
                    }}>
                      <span className="me-2">⏳</span>
                      Waiting for at least 2 players to start...
                    </Alert>
                  )}
                  <Button 
                    variant="outline-danger" 
                    size="lg"
                    onClick={handleCancelGame}
                    className="border-2"
                    style={{ borderRadius: '12px' }}
                  >
                    <span className="me-2">✕</span>
                    Cancel Game
                  </Button>
                </div>
              )}

              {!isCreator && (
                <Alert variant="info" className="mb-0 border-0 text-center py-4" style={{
                  background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
                  borderRadius: '12px'
                }}>
                  <div className="mb-2" style={{ fontSize: '2rem' }}>⏳</div>
                  <h5 className="mb-2">Waiting for host...</h5>
                  <p className="mb-0 text-muted">The host will start the game when everyone is ready</p>
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default GameLobbyPage;