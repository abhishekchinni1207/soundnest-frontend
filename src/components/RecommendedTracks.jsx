import { useEffect, useState } from "react";
import { usePlayer } from "../context/player/usePlayer";
import api from "../services/api";

export default function RecommendedTracks({ currentTrack }) {
  const { playTrack } = usePlayer();

  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentTrack?.id) return;

    let cancelled = false;
    setLoading(true);

    async function loadRecommendations() {
      try {
        const res = await api.get(
          `/recommendations/${currentTrack.id}`
        );

        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        if (!cancelled) {
          setTracks(list);
        }
      } catch {
        if (!cancelled) {
          setTracks([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadRecommendations();

    return () => {
      cancelled = true;
    };
  }, [currentTrack?.id]);

  if (loading) {
    return (
      <p className="mt-8 text-sm opacity-60">
        Loading recommendations…
      </p>
    );
  }

  if (!tracks.length) return null;

  return (
    <section className="mt-10">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">
        Recommended for you
      </h3>

      {/* Spotify-style horizontal scroll */}
      <div className="
        flex gap-4 overflow-x-auto pb-4
        scrollbar-hide dark:text-white
      ">
        {tracks.map((track) => (
          <div
            key={track.id}
            role="button"
            tabIndex={0}
            onClick={() => playTrack(track)}
            onKeyDown={(e) => {
              if (e.key === "Enter") playTrack(track);
            }}
            className="
              min-w-[180px] max-w-[180px]
              flex-shrink-0
              p-4 rounded-xl
              cursor-pointer
              bg-white dark:bg-white/10
              dark:text-white
              hover:bg-accent/20
              focus:outline-none focus:ring-2 focus:ring-accent
              transition
            "
          >
            <p className="font-medium truncate dark:text-white">
              {track.title}
            </p>
            <p className="text-xs opacity-70 truncate dark:text-white">
              {track.artist}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
