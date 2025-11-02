import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Badge,
  Alert,
} from "react-bootstrap";
import { gameApi } from "../../services/api/gameApi";
import { config } from "../../config/config";
import "./CreateGamePage.css";

const CreateGamePage: React.FC = () => {
  const navigate = useNavigate();
  const [creatorName, setCreatorName] = useState("");
  const [timePerSong, setTimePerSong] = useState(30);
  const [songCount, setSongCount] = useState(10);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const toggleYear = (year: string) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  };

  const handleCreateGame = async () => {
    try {
      setLoading(true);
      setError("");

      const { gameId, game } = await gameApi.createGame({
        creatorName,
        timePerSong,
        songCount,
        genres: selectedGenres,
        years: selectedYears,
      });

      navigate(`/lobby/${gameId}`, {
        state: {
          playerName: creatorName,
          playerId: game.players[0].id,
          isCreator: true,
        },
      });
    } catch (err: any) {
      setError(err.message || "Failed to create game");
      console.error("Error creating game:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-game-page py-5 container-fluid position-relative overflow-hidden">
      {/* Background Gradient Elements */}
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
            right: "-200px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            filter: "blur(100px)",
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
          }}
        />
      </div>

      <Row
        className="justify-content-center position-relative"
        style={{ zIndex: 1 }}
      >
        <Col lg={8} xl={7}>
          <Card
            className="shadow-lg border-0"
            style={{
              backdropFilter: "blur(20px)",
              background: "rgba(255, 255, 255, 0.95)",
            }}
          >
            <Card.Header
              className="border-0 py-4"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
              }}
            >
              <div className="d-flex align-items-center">
                <div className="bg-white bg-opacity-25 rounded-circle p-2 me-3">
                  <span style={{ fontSize: "1.5rem" }}>🎮</span>
                </div>
                <h3 className="mb-0 fw-bold">Create New Game</h3>
              </div>
            </Card.Header>

            <Card.Body className="p-4 p-md-5">
              {error && (
                <Alert
                  variant="danger"
                  dismissible
                  onClose={() => setError("")}
                  className="border-0 shadow-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%)",
                  }}
                >
                  <div className="d-flex align-items-center">
                    <span className="me-2">⚠️</span>
                    {error}
                  </div>
                </Alert>
              )}

              <Form>
                {/* Name Input */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold text-secondary mb-2">
                    <span className="me-2">👤</span>
                    Your Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    value={creatorName}
                    onChange={(e) => setCreatorName(e.target.value)}
                    size="lg"
                    maxLength={50}
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

                {/* Song Count */}
                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold text-secondary mb-2">
                        <span className="me-2">🎵</span>
                        Number of Songs
                      </Form.Label>
                      <Form.Select
                        value={songCount}
                        onChange={(e) => setSongCount(Number(e.target.value))}
                        size="lg"
                        className="border-2 shadow-sm"
                        style={{ borderRadius: "12px" }}
                      >
                        {config.game.songCountOptions.map((count) => (
                          <option key={count} value={count}>
                            {count} songs
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Genres Selection */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold text-secondary mb-3">
                    <span className="me-2">🎸</span>
                    Music Genres
                    <span className="text-muted fw-normal ms-2 small">
                      (optional)
                    </span>
                  </Form.Label>
                  <div className="d-flex flex-wrap gap-2">
                    {config.game.genres.map((genre) => (
                      <Badge
                        key={genre}
                        className="p-2 px-3 genre-badge"
                        style={{
                          background: selectedGenres.includes(genre)
                            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            : "#e9ecef",
                          color: selectedGenres.includes(genre)
                            ? "white"
                            : "#ffffffff",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          fontWeight: "500",
                          border: "none",
                          borderRadius: "8px",
                          transition: "all 0.3s ease",
                          transform: "scale(1)",
                          boxShadow: selectedGenres.includes(genre)
                            ? "0 4px 15px rgba(102, 126, 234, 0.4)"
                            : "none",
                        }}
                        onClick={() => toggleGenre(genre)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.05)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                  <Form.Text className="text-muted mt-2 d-block">
                    Select your favorite genres or leave empty for variety
                  </Form.Text>
                </Form.Group>

                {/* Years Selection */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold text-secondary mb-3">
                    <span className="me-2">📅</span>
                    Music Years
                    <span className="text-muted fw-normal ms-2 small">
                      (optional)
                    </span>
                  </Form.Label>
                  <div className="d-flex flex-wrap gap-2">
                    {config.game.years.map((year) => (
                      <Badge
                        key={year}
                        className="p-2 px-3 year-badge"
                        style={{
                          background: selectedYears.includes(year)
                            ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                            : "#e9ecef",
                          color: selectedYears.includes(year)
                            ? "white"
                            : "#ffffffff",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          fontWeight: "500",
                          border: "none",
                          borderRadius: "8px",
                          transition: "all 0.3s ease",
                          transform: "scale(1)",
                          boxShadow: selectedYears.includes(year)
                            ? "0 4px 15px rgba(245, 87, 108, 0.4)"
                            : "none",
                        }}
                        onClick={() => toggleYear(year)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.05)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        {year}
                      </Badge>
                    ))}
                  </div>
                  <Form.Text className="text-muted mt-2 d-block">
                    Pick your era or leave empty for all years
                  </Form.Text>
                </Form.Group>

                {/* Action Buttons */}
                <div className="d-grid gap-3 mt-5">
                  <Button
                    size="lg"
                    onClick={handleCreateGame}
                    disabled={!creatorName.trim() || loading}
                    className="py-3 fw-semibold border-0"
                    style={{
                      background:
                        !creatorName.trim() || loading
                          ? "#e9ecef"
                          : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color:
                        !creatorName.trim() || loading ? "#6c757d" : "white",
                      borderRadius: "12px",
                      boxShadow:
                        !creatorName.trim() || loading
                          ? "none"
                          : "0 10px 30px rgba(102, 126, 234, 0.4)",
                      transition: "all 0.3s ease",
                      transform: "translateY(0)",
                    }}
                    onMouseEnter={(e) => {
                      if (!loading && creatorName.trim()) {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 15px 40px rgba(102, 126, 234, 0.5)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        !creatorName.trim() || loading
                          ? "none"
                          : "0 10px 30px rgba(102, 126, 234, 0.4)";
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Creating Game...
                      </>
                    ) : (
                      <>
                        <span className="me-2">🚀</span>
                        Create Game
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
                          "rgba(0, 0, 0, 0.54)";
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
        </Col>
      </Row>
    </div>
  );
};

export default CreateGamePage;
