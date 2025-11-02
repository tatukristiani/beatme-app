import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Badge,
  Button,
  Alert,
} from "react-bootstrap";
import { gameApi } from "../../services/api/gameApi";
import { FinalResults } from "../../types";
import "./ResultsPage.css";

const ResultsPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [results, setResults] = useState<FinalResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!gameId) return;

      try {
        setLoading(true);
        const data = await gameApi.getFinalResults(gameId);
        setResults(data);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      } catch (err: any) {
        setError(err.message || "Failed to load results");
        console.error("Error fetching results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [gameId]);

  if (loading) {
    return (
      <div className="py-5 text-center container-fluid">
        <div
          className="spinner-border text-primary mb-3"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted fs-5">Calculating final scores...</p>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="py-5 text-center container-fluid">
        <Alert
          variant="danger"
          className="border-0 shadow-lg"
          style={{ maxWidth: "500px", margin: "0 auto" }}
        >
          <h4 className="mb-3">⚠️ {error || "Failed to load results"}</h4>
          <Button
            variant="primary"
            onClick={() => navigate("/")}
            className="mt-3"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
            }}
          >
            Return Home
          </Button>
        </Alert>
      </div>
    );
  }

  const medals = ["🥇", "🥈", "🥉"];
  const winner = results.finalScores[0];

  return (
    <div className="results-page py-5 container-fluid position-relative overflow-hidden">
      {/* Animated Background */}
      <div
        className="position-absolute w-100 h-100 top-0 start-0"
        style={{ zIndex: 0 }}
      >
        <div
          className="position-absolute rounded-circle opacity-10"
          style={{
            width: "600px",
            height: "600px",
            top: "-200px",
            right: "-100px",
            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            filter: "blur(100px)",
            animation: "float-celebration 8s ease-in-out infinite",
          }}
        />
        <div
          className="position-absolute rounded-circle opacity-10"
          style={{
            width: "500px",
            height: "500px",
            bottom: "-150px",
            left: "-100px",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            filter: "blur(100px)",
            animation: "float-celebration 10s ease-in-out infinite reverse",
          }}
        />
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div
          className="position-absolute w-100 h-100 top-0 start-0"
          style={{ zIndex: 2, pointerEvents: "none" }}
        >
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="position-absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: "-20px",
                width: "10px",
                height: "10px",
                background: ["#f59e0b", "#10b981", "#667eea", "#f5576c"][
                  Math.floor(Math.random() * 4)
                ],
                animation: `fall ${2 + Math.random() * 3}s linear forwards`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: 0.8,
              }}
            />
          ))}
        </div>
      )}

      <Row
        className="justify-content-center position-relative"
        style={{ zIndex: 1 }}
      >
        <Col lg={8} xl={7}>
          <Card
            className="shadow-lg border-0 overflow-hidden"
            style={{
              backdropFilter: "blur(20px)",
              background: "rgba(255, 255, 255, 0.95)",
            }}
          >
            {/* Header with Winner Celebration */}
            <Card.Header
              className="border-0 text-center py-5 position-relative"
              style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                color: "white",
              }}
            >
              <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 70%)",
                  animation: "pulse-glow 2s ease-in-out infinite",
                }}
              />
              <div className="position-relative">
                <div
                  style={{
                    fontSize: "4rem",
                    animation: "bounce 1s ease-in-out infinite",
                  }}
                >
                  🎉
                </div>
                <h1 className="display-4 mb-2 fw-bold">Game Over!</h1>
                <p className="mb-0 fs-5 opacity-90">Final Results</p>
              </div>
            </Card.Header>

            <Card.Body className="p-4 p-md-5">
              {/* Winner Spotlight */}
              <div
                className="mb-4 p-4 rounded-3 text-center position-relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                  border: "3px solid #f59e0b",
                }}
              >
                <div
                  className="position-absolute top-0 start-0 w-100 h-100"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 0%, rgba(245,158,11,0.2) 0%, transparent 70%)",
                  }}
                />
                <div className="position-relative">
                  <div style={{ fontSize: "3rem" }}>👑</div>
                  <h3 className="mb-2 fw-bold" style={{ color: "#d97706" }}>
                    {winner.playerName}
                  </h3>
                  <Badge
                    className="px-4 py-2 fs-5"
                    style={{
                      background:
                        "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    }}
                  >
                    Winner!
                  </Badge>
                  <div className="mt-3">
                    <div
                      className="display-4 fw-bold"
                      style={{ color: "#d97706" }}
                    >
                      {winner.totalScore}
                    </div>
                    <small className="text-muted fw-semibold">POINTS</small>
                  </div>
                </div>
              </div>

              {/* Full Leaderboard */}
              <h5 className="mb-3 text-secondary">
                <span className="me-2">🏆</span>
                Final Standings
              </h5>
              <ListGroup className="shadow-sm mb-4">
                {results.finalScores.map((player, index) => (
                  <ListGroup.Item
                    key={player.playerId}
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
                          : index === 2
                          ? "#cd7f32"
                          : "transparent",
                      transform: "scale(1)",
                      transition: "transform 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.02)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: "50px",
                            height: "50px",
                            background:
                              index === 0
                                ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                                : index === 1
                                ? "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)"
                                : index === 2
                                ? "linear-gradient(135deg, #cd7f32 0%, #a0522d 100%)"
                                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                            boxShadow:
                              index < 3 ? "0 4px 15px rgba(0,0,0,0.2)" : "none",
                          }}
                        >
                          {medals[index] || `${index + 1}`}
                        </div>
                        <div>
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <div className="fw-bold fs-5">
                              {player.playerName}
                            </div>
                            {index === 0 && (
                              <Badge
                                className="px-2 py-1"
                                style={{
                                  background:
                                    "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                                }}
                              >
                                Champion
                              </Badge>
                            )}
                          </div>
                          <div className="small text-muted">
                            <span className="me-3">
                              <span className="me-1">🎤</span>
                              {player.correctArtists} artists
                            </span>
                            <span>
                              <span className="me-1">🎵</span>
                              {player.correctSongs} songs
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-end">
                        <div
                          className="fs-3 fw-bold"
                          style={{
                            color: index === 0 ? "#d97706" : "#667eea",
                            textShadow:
                              index === 0
                                ? "0 2px 10px rgba(245,158,11,0.3)"
                                : "none",
                          }}
                        >
                          {player.totalScore}
                        </div>
                        <small className="text-muted fw-semibold">points</small>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              {/* Action Buttons */}
              <div className="d-grid gap-3">
                <Button
                  size="lg"
                  onClick={() => navigate("/create")}
                  className="py-3 fw-semibold border-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(102, 126, 234, 0.4)",
                    transition: "all 0.3s ease",
                    transform: "translateY(0)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 15px 40px rgba(102, 126, 234, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(102, 126, 234, 0.4)";
                  }}
                >
                  <span className="me-2">🎮</span>
                  Play Again
                </Button>

                <Button
                  variant="outline-secondary"
                  size="lg"
                  onClick={() => navigate("/")}
                  className="border-2"
                  style={{
                    borderRadius: "12px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "rgba(108, 117, 125, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span className="me-2">🏠</span>
                  Back to Home
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style>{`
        @keyframes float-celebration {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(5deg); }
          66% { transform: translate(-20px, 20px) rotate(-5deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ResultsPage;
