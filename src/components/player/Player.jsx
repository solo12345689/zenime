import React from "react";
import "./Player.css";

export default function Player({ streamUrl }) {
  if (!streamUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-white font-medium text-[15px]">
        No streaming source selected.
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-full bg-black relative flex items-center justify-center overflow-hidden">
      <iframe
        src={streamUrl}
        className="w-full h-full min-h-full border-0 absolute top-0 left-0"
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "100%",
          maxHeight: "100%",
        }}
        allowFullScreen
        webkitallowfullscreen="true"
        mozallowfullscreen="true"
        playsInline
        webkit-playsinline="true"
        scrolling="no"
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
      />
    </div>
  );
}
