import { usePlayer } from "../context/player/usePlayer";
import Waveform from "./Waveform";

function formatTime(sec = 0) {
  if (!sec || Number.isNaN(sec)) return "0:00";
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function AudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    currentTime,
    duration,
    seekTo,
    playNext,
    playPrevious,
    volume,
    isMuted,
    changeVolume,
    toggleMute,
    toggleShuffle,
    isShuffling,
    toggleRepeat,
    repeatMode,
    isLoading,
  } = usePlayer();

  const disabled = !currentTrack;

  return (
    <footer
      className={`
        fixed bottom-0 left-0 right-0 z-50
        h-[140px] px-6
        bg-white dark:bg-black
        text-black dark:text-white
        border-t border-black/10 dark:border-white/10
        transition-opacity
        ${disabled ? "opacity-50 pointer-events-none" : "opacity-100"}
      `}
    >
      {/* ───────── TOP ROW ───────── */}
      <div className="flex items-center justify-between h-[72px]">
        {/* LEFT — Track info */}
        <div className="flex items-center gap-4 w-[30%] min-w-0">
          {currentTrack ? (
            <>
              <img
                src={currentTrack.cover_url}
                alt={currentTrack.title}
                className="w-14 h-14 rounded-md object-cover"
              />
              <div className="min-w-0">
                <p className="font-medium truncate">
                  {currentTrack.title}
                </p>
                <p className="text-sm opacity-60 truncate">
                  {currentTrack.artist}
                </p>
              </div>
            </>
          ) : (
            <p className="text-sm opacity-60">Nothing playing</p>
          )}
        </div>

        {/* CENTER — Controls */}
        <div className="flex flex-col items-center w-[40%]">
          <div className="flex items-center gap-5 mb-2">
            <button
              onClick={toggleShuffle}
              className={isShuffling ? "text-accent" : "opacity-60 hover:opacity-100"}
              aria-label="Shuffle"
            >
              🔀
            </button>

            <button
              onClick={playPrevious}
              className="opacity-80 hover:opacity-100"
              aria-label="Previous"
            >
              ⏮
            </button>

            <button
              onClick={togglePlay}
              className="
                w-10 h-10 rounded-full
                bg-black text-white
                dark:bg-white dark:text-black
                flex items-center justify-center
                hover:scale-105 active:scale-95
                transition
              "
              aria-label="Play / Pause"
            >
              {isLoading ? "⏳" : isPlaying ? "❚❚" : "▶"}
            </button>

            <button
              onClick={playNext}
              className="opacity-80 hover:opacity-100"
              aria-label="Next"
            >
              ⏭
            </button>

            <button
              onClick={toggleRepeat}
              className={repeatMode !== "off" ? "text-accent" : "opacity-60 hover:opacity-100"}
              aria-label="Repeat"
            >
              🔁
            </button>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 w-full text-xs">
            <span className="w-10 text-right">
              {formatTime(currentTime)}
            </span>

            <input
              type="range"
              min="0"
              max={duration || 0}
              value={Math.min(currentTime, duration || 0)}
              onChange={(e) => seekTo(Number(e.target.value))}
              disabled={!duration}
              className="flex-1 accent-accent disabled:opacity-50"
            />

            <span className="w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* RIGHT — Volume */}
        <div className="flex items-center gap-3 w-[30%] justify-end">
          <button onClick={toggleMute} aria-label="Mute">
            {isMuted || volume === 0 ? "🔇" : "🔊"}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => changeVolume(Number(e.target.value))}
            className="w-24 accent-accent"
          />
        </div>
      </div>

      {/* ───────── WAVEFORM ───────── */}
      {!disabled && (
        <div className="h-[48px] mt-2 overflow-hidden flex items-center">
          <Waveform track={currentTrack} />
        </div>
      )}
    </footer>
  );
}
