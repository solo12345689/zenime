import { faBackward, faForward } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function WatchControls({
  episodeId,
  episodes = [],
  onButtonClick,
}) {
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(
    episodes?.findIndex((episode) => episode.slug === episodeId)
  );

  useEffect(() => {
    if (episodes?.length > 0) {
      const newIndex = episodes.findIndex(
        (episode) => episode.slug === episodeId
      );
      setCurrentEpisodeIndex(newIndex);
    }
  }, [episodeId, episodes]);

  return (
    <div className="bg-[#11101A] w-full flex justify-end px-4 py-4 max-[1200px]:bg-[#14151A]">
      <div className="flex gap-x-6 max-[575px]:gap-x-4">
        <button
          onClick={() => {
            if (currentEpisodeIndex > 0) {
              onButtonClick(episodes[currentEpisodeIndex - 1].slug);
            }
          }}
          disabled={currentEpisodeIndex <= 0}
          className={`${
            currentEpisodeIndex <= 0 ? "opacity-50 cursor-not-allowed" : "hover:text-[#ffbade]"
          }`}
        >
          <FontAwesomeIcon
            icon={faBackward}
            className="text-[20px] max-[575px]:text-[16px] text-white"
          />
        </button>
        <button
          onClick={() => {
            if (currentEpisodeIndex < episodes?.length - 1) {
              onButtonClick(episodes[currentEpisodeIndex + 1].slug);
            }
          }}
          disabled={currentEpisodeIndex >= episodes?.length - 1}
          className={`${
            currentEpisodeIndex >= episodes?.length - 1 ? "opacity-50 cursor-not-allowed" : "hover:text-[#ffbade]"
          }`}
        >
          <FontAwesomeIcon
            icon={faForward}
            className="text-[20px] max-[575px]:text-[16px] text-white"
          />
        </button>
      </div>
    </div>
  );
}

