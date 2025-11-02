import React from "react";
import ReactPlayer from "react-player";

export function SongPlayer({ url }: { url: string }) {
  return (
    <div style={{ maxWidth: 400 }}>
      <ReactPlayer
        src={url}
        playing={true}
        controls={true}
        width="100%"
        height="50px"
        loop
      />
    </div>
  );
}
