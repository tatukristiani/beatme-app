import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import YouTube, { YouTubePlayer } from "react-youtube";
import config from "../config/config";

interface YouTubePreviewProps {
  artist: string;
  title: string;
  duration: number; // seconds, default = 10
  startAt?: number; // how many seconds to skip from start
  onPlay?: () => void;
  onPause?: () => void;
}

export interface YouTubePreviewHandle {
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void; // 0-100
}

const API_KEY = config.youtube.apiKey;

const YouTubePreview = forwardRef<YouTubePreviewHandle, YouTubePreviewProps>(
  ({ artist, title, duration, startAt = 60, onPlay, onPause }, ref) => {
    const [videoId, setVideoId] = useState<string | null>(null);
    const playerRef = useRef<YouTubePlayer | null>(null);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      play: () => {
        playerRef.current?.playVideo();
      },
      pause: () => {
        playerRef.current?.pauseVideo();
      },
      setVolume: (volume: number) => {
        playerRef.current?.setVolume(volume);
      },
    }));

    // Step 1: Fetch videoId from YouTube API
    useEffect(() => {
      const fetchVideo = async () => {
        try {
          const query = encodeURIComponent(`${artist} ${title}`);
          const res = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&maxResults=1&key=${API_KEY}`
          );
          const data = await res.json();
          if (data.items && data.items.length > 0) {
            setVideoId(data.items[0].id.videoId);
          }
        } catch (err) {
          console.error("Error fetching YouTube video:", err);
        }
      };

      if (artist && title) fetchVideo();
    }, [artist, title]);

    // Step 2: Player options (compliant with YouTube branding rules)
    const playerOptions = {
      height: "0", // Hidden video (audio only)
      width: "0",
      playerVars: {
        autoplay: 1,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        mute: 0,
        origin: window.location.origin,
      },
    };

    // Step 3: Handle player events
    const onReady = (event: { target: YouTubePlayer }) => {
      playerRef.current = event.target;

      // Jump to specified startAt time
      playerRef.current.seekTo(startAt, true);
      playerRef.current.playVideo();
    };

    const onStateChange = (event: { data: number }) => {
      // YouTube player states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
      if (event.data === 1) {
        onPlay?.();
      } else if (event.data === 2) {
        onPause?.();
      }
    };

    return (
      <>
        {videoId ? (
          <YouTube
            videoId={videoId}
            opts={playerOptions}
            onReady={onReady}
            onStateChange={onStateChange}
          />
        ) : (
          <p>Loading preview...</p>
        )}
      </>
    );
  }
);

YouTubePreview.displayName = "YouTubePreview";

export default YouTubePreview;
