import {
  faBackward,
  faForward,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";

const ToggleButton = ({ label, isActive, onClick }) => (
  <button className="flex gap-x-2" onClick={onClick}>
    <h1 className="capitalize text-[13px]">{label}</h1>
    <span
      className={`capitalize text-[13px] ${
        isActive ? "text-[#00f2fe]" : "text-red-500"
      }`}
    >
      {isActive ? "on" : "off"}
    </span>
  </button>
);

export default function WatchControls({
  autoPlay,
  setAutoPlay,
  autoSkipIntro,
  setAutoSkipIntro,
  autoNext,
  setAutoNext,
  episodeId,
  animeInfo,
  episodes = [],
  onButtonClick,
}) {
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(
    episodes?.findIndex(
      (episode) => episode.id.match(/ep=(\d+)/)?.[1] === episodeId
    )
  );

  useEffect(() => {
    if (episodes?.length > 0) {
      const newIndex = episodes.findIndex(
        (episode) => episode.id.match(/ep=(\d+)/)?.[1] === episodeId
      );
      setCurrentEpisodeIndex(newIndex);
    }
  }, [episodeId, episodes]);

  const statusOptions = [
    "Watching",
    "On-Hold",
    "Plan to Watch",
    "Dropped",
    "Completed",
  ];

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = async (status) => {
    setDropdownOpen(false);
 
    try {
      const res = await fetch("/api/user-anime-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          animeId: animeInfo.id,
          title: animeInfo.title || animeInfo.japanese_title,
          poster: animeInfo.poster || "",
          status,
        }),
      });

      if (!res.ok) {
        const msg = await res.json();
        console.error("Error:", msg.message);
      } else {
        console.log("Saved to list");
      }
    } catch (error) {
      console.error("Failed to save:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-[#11101A] w-full flex justify-between flex-wrap px-4 pt-4 max-[1200px]:bg-[#14151A] max-[375px]:flex-col max-[375px]:gap-y-2">
      <div className="flex gap-x-4 flex-wrap">
        <ToggleButton
          label="auto play"
          isActive={autoPlay}
          onClick={() => setAutoPlay((prev) => !prev)}
        />
        <ToggleButton
          label="auto skip intro"
          isActive={autoSkipIntro}
          onClick={() => setAutoSkipIntro((prev) => !prev)}
        />
        <ToggleButton
          label="auto next"
          isActive={autoNext}
          onClick={() => setAutoNext((prev) => !prev)}
        />
      </div>
      <div className="flex gap-x-6 max-[575px]:gap-x-4 max-[375px]:justify-end">
        <button
          onClick={() => {
            if (currentEpisodeIndex > 0) {
              onButtonClick(
                episodes[currentEpisodeIndex - 1].id.match(/ep=(\d+)/)?.[1]
              );
            }
          }}
          disabled={currentEpisodeIndex <= 0}
        >
          <FontAwesomeIcon
            icon={faBackward}
            className="text-[20px] max-[575px]:text-[16px] text-white"
          />
        </button>
        <button
          onClick={() => {
            if (currentEpisodeIndex < episodes?.length - 1) {
              onButtonClick(
                episodes[currentEpisodeIndex + 1].id.match(/ep=(\d+)/)?.[1]
              );
            }
          }}
          disabled={currentEpisodeIndex >= episodes?.length - 1}
        >
          <FontAwesomeIcon
            icon={faForward}
            className="text-[20px] max-[575px]:text-[16px] text-white"
          />
        </button>
        <div className="relative w-fit" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            // className="flex gap-x-2 text-white items-center rounded-3xl"
          >
            <FontAwesomeIcon
              icon={faPlus}
              className="text-[20px] max-[575px]:text-[16px] text-white"
            />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-max max-w-[calc(100vw-16px)] bg-white shadow-lg rounded-lg z-50 border border-gray-200 overflow-x-auto">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => handleSelect(status)}
                  className="block w-full px-4 py-2 text-left text-black hover:bg-[#00f2fe]/20 hover:text-black transition duration-150 ease-in-out"
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
