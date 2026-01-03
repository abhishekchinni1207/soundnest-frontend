import { useEffect, useState } from "react";
import Modal from "./Modal";
import {
  getPlaylists,
  addTrackToPlaylist,
} from "../services/playlistApi";
import { useAuth } from "../context/useAuth";

export default function AddToPlaylistModal({
  open,
  onClose,
  trackId,
}) {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !user?.id) return;

    let active = true;
    setLoading(true);

    async function loadPlaylists() {
      try {
        const res = await getPlaylists(user.id);

        const list = Array.isArray(res?.data?.data)
          ? res.data.data
          : [];

        if (active) {
          setPlaylists(list);
        }
      } catch {
        if (active) {
          setPlaylists([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPlaylists();

    return () => {
      active = false;
    };
  }, [open, user?.id]);

  async function handleAdd(playlistId) {
    try {
      await addTrackToPlaylist({
        playlist_id: playlistId,
        track_id: trackId,
      });
      onClose();
    } catch {
      // fail silently (optional toast later)
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-lg font-bold mb-4">
        Add to Playlist
      </h2>

      {loading && (
        <p className="text-sm opacity-60">Loading…</p>
      )}

      {!loading && playlists.length === 0 && (
        <p className="text-sm opacity-70">
          No playlists yet. Create one first.
        </p>
      )}

      <ul className="space-y-2">
        {playlists.map((p) => (
          <li
            key={p.id}
            onClick={() => handleAdd(p.id)}
            className="
              p-3 rounded cursor-pointer
              bg-gray-100 hover:bg-gray-200
              dark:bg-white/10 dark:hover:bg-white/20
              transition
            "
          >
            {p.name}
          </li>
        ))}
      </ul>
    </Modal>
  );
}
