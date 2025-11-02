import { useState, useEffect, useCallback } from "react";

export const useCountdown = (
  initialSeconds: number,
  onComplete?: () => void
) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  const start = useCallback(() => {
    setSeconds(initialSeconds);
    setIsRunning(true);
  }, [initialSeconds]);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setSeconds(initialSeconds);
    setIsRunning(false);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning || seconds <= 0) {
      if (seconds === 0 && onComplete) {
        onComplete();
      }
      return;
    }

    const timer = setTimeout(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isRunning, seconds, onComplete]);

  return {
    seconds,
    isRunning,
    start,
    stop,
    reset,
  };
};
