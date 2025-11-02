import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { gameApi } from "../../services/api/gameApi";
import "./JoinGamePage.css";

const JoinGamePage: React.FC = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState("");
  const [gameId, setGameId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoinGame = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await gameApi.joinGame(gameId.trim(), playerName.trim());

      navigate(`/lobby/${gameId}`, {
        state: {
          playerName: playerName.trim(),
          playerId: result.playerId,
          isCreator: false,
        },
      });
    } catch (err: any) {
      setError(err.message || "Failed to join game");
      console.error("Error joining game:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="join-game-page min-vh-100 d-flex align-items-center justify-content-center container-fluid position-relative overflow-hidden">
      {/* Animated Background */}
      <div
        className="position-absolute w-100 h-100 top-0 start-0"
        style={{ zIndex: 0 }}
      >
        <div
          className="position-absolute rounded-circle opacity-10"
          style={{
            width: "500px",
            height: "500px",
            top: "-150px",
            right: "-100px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            filter: "blur(100px)",
            animation: "float 6s ease-in-out infinite",
          }}
        />
        <div
          className="position-absolute rounded-circle opacity-10"
          style={{
            width: "400px",
            height: "400px",
            bottom: "-100px",
            left: "-100px",
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            filter: "blur(80px)",
            animation: "float 8s ease-in-out infinite reverse",
          }}
        />
      </div>

      <Card
        className="shadow-lg join-card border-0 position-relative"
        style={{
          maxWidth: "500px",
          width: "100%",
          backdropFilter: "blur(20px)",
          background: "rgba(255, 255, 255, 0.95)",
          zIndex: 1,
        }}
      >
        <Card.Header
          className="border-0 py-4"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <div className="d-flex align-items-center justify-content-center">
            <div className="bg-white bg-opacity-25 rounded-circle p-2 me-3">
              <span style={{ fontSize: "1.5rem" }}>🚪</span>
            </div>
            <h3 className="mb-0 fw-bold">Join Game</h3>
          </div>
        </Card.Header>

        <Card.Body className="p-4 p-md-5">
          {error && (
            <Alert
              variant="danger"
              dismissible
              onClose={() => setError("")}
              className="border-0 shadow-sm mb-4"
              style={{
                background: "linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%)",
                borderRadius: "12px",
              }}
            >
              <div className="d-flex align-items-center">
                <span className="me-2">⚠️</span>
                {error}
              </div>
            </Alert>
          )}

          <Form>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold text-secondary mb-2">
                <span className="me-2">👤</span>
                Your Name
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                size="lg"
                maxLength={50}
                disabled={loading}
                className="border-2 shadow-sm"
                style={{
                  borderRadius: "12px",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#667eea";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 0.2rem rgba(102, 126, 234, 0.25)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "";
                  e.currentTarget.style.boxShadow = "";
                }}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold text-secondary mb-2">
                <span className="me-2">🎮</span>
                Game Code
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter code"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                size="lg"
                disabled={loading}
                className="border-2 shadow-sm text-center fw-bold"
                style={{
                  borderRadius: "12px",
                  fontSize: "1.5rem",
                  letterSpacing: "0.2em",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#667eea";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 0.2rem rgba(102, 126, 234, 0.25)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "";
                  e.currentTarget.style.boxShadow = "";
                }}
              />
              <Form.Text className="text-muted mt-2 d-block text-center">
                <span className="me-1">💡</span>
                Ask the host for the game code
              </Form.Text>
            </Form.Group>

            <div className="d-grid gap-3 mt-5">
              <Button
                size="lg"
                onClick={handleJoinGame}
                disabled={!playerName.trim() || !gameId.trim() || loading}
                className="py-3 fw-semibold border-0"
                style={{
                  background:
                    !playerName.trim() || !gameId.trim() || loading
                      ? "#e9ecef"
                      : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color:
                    !playerName.trim() || !gameId.trim() || loading
                      ? "#6c757d"
                      : "white",
                  borderRadius: "12px",
                  boxShadow:
                    !playerName.trim() || !gameId.trim() || loading
                      ? "none"
                      : "0 10px 30px rgba(102, 126, 234, 0.4)",
                  transition: "all 0.3s ease",
                  transform: "translateY(0)",
                }}
                onMouseEnter={(e) => {
                  if (!loading && playerName.trim() && gameId.trim()) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 15px 40px rgba(102, 126, 234, 0.5)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    !playerName.trim() || !gameId.trim() || loading
                      ? "none"
                      : "0 10px 30px rgba(102, 126, 234, 0.4)";
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Joining Game...
                  </>
                ) : (
                  <>
                    <span className="me-2">🎵</span>
                    Join Game
                  </>
                )}
              </Button>

              <Button
                variant="outline-secondary"
                size="lg"
                onClick={() => navigate("/")}
                disabled={loading}
                className="border-2"
                style={{
                  borderRadius: "12px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background =
                      "rgba(108, 117, 125, 0.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <span className="me-2">←</span>
                Back
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, 20px); }
        }
      `}</style>
    </div>
  );
};

export default JoinGamePage;
