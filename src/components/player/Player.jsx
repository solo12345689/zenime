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
    <div className="w-full h-full bg-black relative">
      <iframe
        src={streamUrl}
        className="w-full h-full border-0 absolute inset-0"
        allowFullScreen
        scrolling="no"
        allow="autoplay; encrypted-media; picture-in-picture"
      />
    </div>
  );
}
