import { useEffect, useState } from "react";
import Modal from "./Modal";
import { getPlaylists } from "../services/playlistApi";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

export default function PlaylistListModal({ open, onClose }) {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open || !user?.id) return;

    let active = true;
    setLoading(true);

    async function fetchPlaylists() {
      try {
        const res = await getPlaylists(user.id);
        if (active) {
          setPlaylists(res?.data?.data || []);
        }
      } catch (err) {
        console.error("Failed to load playlists:", err);
        if (active) setPlaylists([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchPlaylists();

    return () => {
      active = false;
    };
  }, [open, user?.id]);

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">My Playlists</h2>

      {loading && (
        <p className="text-sm opacity-70">Loading playlists…</p>
      )}

      {!loading && playlists.length === 0 && (
        <p className="text-sm opacity-70">No playlists yet</p>
      )}

      {!loading && playlists.length > 0 && (
        <ul className="space-y-2 mt-3">
          {playlists.map((p) => (
            <li
              key={p.id}
              onClick={() => {
                onClose();
                navigate(`/playlists/${p.id}`);
              }}
              className="
                w-full p-3 rounded-lg text-sm cursor-pointer
                bg-gray-100 text-black
                dark:bg-white/10 dark:text-white
                border border-black/10 dark:border-white/10
                hover:bg-black/5 dark:hover:bg-white/20
                transition
              "
            >
              {p.name}
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
