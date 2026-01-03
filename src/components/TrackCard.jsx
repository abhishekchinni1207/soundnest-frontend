import { useState, memo, useCallback } from "react";
import { usePlayer } from "../context/player/usePlayer";
import AddToPlaylistModal from "./AddToPlaylistModal";
import MiniEqualizer from "./MiniEqualizer";
import { downloadTrack } from "../offline/download";

const TrackCard = memo(function TrackCard({ track }) {
  const { playTrack, togglePlay, currentTrack, isPlaying } = usePlayer();
  const [openAdd, setOpenAdd] = useState(false);

  const isActive = currentTrack?.id === track?.id;

  const handlePlayClick = useCallback(() => {
    if (!track) return;

    if (isActive) {
      togglePlay();
    } else {
      playTrack(track);
    }
  }, [isActive, togglePlay, playTrack, track]);

  /* ✅ SAFE FALLBACK RENDER (instead of early return) */
  if (!track) {
    return (
      <div className="rounded-2xl p-4 bg-gray-100 dark:bg-darkCard opacity-60">
        <p className="text-sm text-center">Track unavailable</p>
      </div>
    );
  }

  return (
    <div
      className="
        group rounded-2xl
        bg-white dark:bg-darkCard
        border border-black/5 dark:border-white/10
        shadow-sm hover:shadow-xl
        transition-all duration-300
      "
    >
      {/* COVER */}
      <div className="relative w-full h-48 rounded-t-2xl overflow-hidden">
        <img
          src={track.cover_url}
          alt={track.title}
          loading="lazy"
          className={`
            w-full h-full object-cover
            transition-all duration-300
            ${isActive && isPlaying ? "opacity-70" : "opacity-100"}
          `}
        />

        {/* HOVER OVERLAY */}
        <div
          className="
            absolute inset-0
            bg-black/40 backdrop-blur-sm
            opacity-0 group-hover:opacity-100
            flex items-center justify-center
            transition-opacity duration-300
          "
        >
        </div>

        {/* MINI EQUALIZER */}
        {isActive && isPlaying && (
          <div className="absolute inset-0 z-20 flex items-end justify-center pb-4">
            <MiniEqualizer />
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-2">
        <div>
          <h3 className="font-semibold truncate dark:text-white">{track.title}</h3>
          <p className="text-sm opacity-70 truncate dark:text-white">{track.artist}</p>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handlePlayClick}
            className="
              px-4 py-1.5 rounded-full
              text-sm font-medium
              bg-black/5 dark:bg-white/10 dark:text-white
              hover:bg-accent hover:text-black
              transition
            "
          >
            {isActive && isPlaying ? "Pause" : "Play"}
          </button>

          <div className="flex items-center gap-3 text-sm opacity-70">
            <button
              type="button"
              onClick={() => setOpenAdd(true)}
              className="hover:text-accent transition dark:text-white"
            >
              + Add to Playlist
            </button>

            <button
              type="button"
              onClick={() => downloadTrack(track)}
              className="hover:text-accent transition dark:text-white"
            >
              ⬇ Download
            </button>
          </div>
        </div>
      </div>

      <AddToPlaylistModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        trackId={track.id}
      />
    </div>
  );
});

export default TrackCard;
