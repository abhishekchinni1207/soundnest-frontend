import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPlaylistTracks,
  removeTrackFromPlaylist,
} from "../services/playlistApi";
import { usePlayer } from "../context/player/usePlayer";

export default function PlaylistDetail() {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const { playTrack, playQueue } = usePlayer();

  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 🔁 Load playlist tracks */
  useEffect(() => {
    let mounted = true;

    async function fetchTracks() {
      try {
        setLoading(true);
        const res = await getPlaylistTracks(playlistId);

        const list =
          res?.data?.data?.map((t) => t.tracks).filter(Boolean) || [];

        if (mounted) setTracks(list);
      } catch (err) {
        console.error("Failed to load playlist tracks", err);
        if (mounted) setTracks([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchTracks();
    return () => {
      mounted = false;
    };
  }, [playlistId]);

  /* ❌ Remove track */
  async function handleRemove(trackId) {
    await removeTrackFromPlaylist({
      playlist_id: playlistId,
      track_id: trackId,
    });

    setTracks((prev) => prev.filter((t) => t.id !== trackId));
  }

  return (
    <div className="p-6  dark:text-white dark:bg-black min-h-screen">
      {/* 🔙 Back */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm underline opacity-80 hover:opacity-100"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-6">Playlist</h1>

      {/* ▶ PLAY ALL */}
      <button
        onClick={() => playQueue(tracks)}
        disabled={!tracks.length}
        className={`
          mb-6 px-6 py-2 rounded font-medium
          ${
            tracks.length
              ? "bg-accent text-black"
              : "opacity-50 cursor-not-allowed"
          }
        `}
      >
        ▶ Play All
      </button>

      {/* TRACK LIST */}
      {loading ? (
        <p className="opacity-60">Loading tracks…</p>
      ) : tracks.length === 0 ? (
        <p className="opacity-60">No tracks in this playlist</p>
      ) : (
        <ul className="space-y-4">
          {tracks.map((track, index) => (
            <li
              key={track.id}
              className="
                flex items-center justify-between
                bg-gray-100 dark:bg-darkCard
                p-4 rounded
              "
            >
              <div
                onClick={() => playTrack(track)}
                className="cursor-pointer"
              >
                <p className="font-semibold">
                  {index + 1}. {track.title}
                </p>
                <p className="text-sm opacity-70">
                  {track.artist}
                </p>
              </div>

              <button
                onClick={() => handleRemove(track.id)}
                className="text-red-500 text-sm hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
