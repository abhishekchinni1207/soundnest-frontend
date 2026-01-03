import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPlaylists } from "../services/playlistApi";
import { useAuth } from "../context/useAuth";

export default function Playlists() {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    let mounted = true;

    async function fetchPlaylists() {
      try {
        setLoading(true);
        const res = await getPlaylists(user.id);
        if (mounted) {
          setPlaylists(res?.data?.data || []);
        }
      } catch (err) {
        console.error("Failed to load playlists", err);
        if (mounted) setPlaylists([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchPlaylists();
    return () => {
      mounted = false;
    };
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Playlists</h1>

      {loading ? (
        <p className="opacity-60 mt-4">Loading playlists…</p>
      ) : playlists.length === 0 ? (
        <p className="opacity-60 mt-4">No playlists created yet</p>
      ) : (
        <ul className="mt-6 space-y-2">
          {playlists.map((p) => (
            <li
              key={p.id}
              className="
                p-3 rounded
                bg-gray-100 dark:bg-darkCard
                border border-black/10 dark:border-white/10
                hover:bg-accent/20 transition
              "
            >
              <Link to={`/playlists/${p.id}`} className="block font-medium">
                {p.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
