import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import "./HomePage.css";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page min-vh-100 d-flex align-items-center justify-content-center container-fluid position-relative overflow-hidden">
      {/* Animated Background Elements */}
      <div
        className="position-absolute w-100 h-100 top-0 start-0"
        style={{ zIndex: 0 }}
      >
        <div
          className="position-absolute rounded-circle bg-primary opacity-10 blur-effect"
          style={{
            width: "400px",
            height: "400px",
            top: "-100px",
            right: "-100px",
            filter: "blur(100px)",
          }}
        />
        <div
          className="position-absolute rounded-circle bg-success opacity-10 blur-effect"
          style={{
            width: "500px",
            height: "500px",
            bottom: "-150px",
            left: "-150px",
            filter: "blur(120px)",
          }}
        />
        <div
          className="position-absolute rounded-circle bg-info opacity-10 blur-effect"
          style={{
            width: "300px",
            height: "300px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <Card
        className="shadow-lg home-card border-0 position-relative"
        style={{
          maxWidth: "550px",
          backdropFilter: "blur(20px)",
          background: "rgba(255, 255, 255, 0.95)",
          zIndex: 1,
        }}
      >
        <Card.Body className="p-5 text-center">
          {/* Logo Section with Animation */}
          <div className="mb-5">
            <div className="d-inline-flex align-items-center justify-content-center mb-3 position-relative">
              <div
                className="position-absolute rounded-circle bg-primary opacity-25"
                style={{
                  width: "140px",
                  height: "140px",
                  animation: "pulse 2s ease-in-out infinite",
                }}
              />
              <div
                className="position-relative bg-gradient rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: "120px",
                  height: "120px",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  boxShadow: "0 10px 40px rgba(102, 126, 234, 0.4)",
                  transform: "translateY(0)",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-5px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <span style={{ fontSize: "3.5rem" }}>🎵</span>
              </div>
            </div>
            <h1
              className="display-3 fw-bold mb-2"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              BeatMe
            </h1>

            <p className="text-muted fs-5 mb-0">
              Guess the song, beat your friends!
            </p>
          </div>
          {/* Action Buttons */}
          <div className="d-grid gap-3">
            <Button
              size="lg"
              onClick={() => navigate("/create")}
              className="py-3 fw-semibold border-0 position-relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
              Create Game
            </Button>

            <Button
              size="lg"
              onClick={() => navigate("/join")}
              className="py-3 fw-semibold border-2 position-relative overflow-hidden"
              style={{
                background: "transparent",
                borderColor: "#667eea",
                color: "#667eea",
                transition: "all 0.3s ease",
                transform: "translateY(0)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(102, 126, 234, 0.1)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 30px rgba(102, 126, 234, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span className="me-2">🚪</span>
              Join Game
            </Button>
          </div>

          {/* Footer Info */}
          <div className="mt-4 pt-3 border-top">
            <p className="text-muted small mb-0">
              🎧 Test your music knowledge with friends
            </p>
          </div>
        </Card.Body>
      </Card>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.25; }
          50% { transform: scale(1.1); opacity: 0.15; }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
