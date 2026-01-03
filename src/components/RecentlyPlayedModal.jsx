import { useEffect, useState } from "react";
import Modal from "./Modal";
import { usePlayer } from "../context/player/usePlayer";
import { useAuth } from "../context/useAuth";
import { supabase } from "../services/supabase";

export default function RecentlyPlayedModal({ open, onClose }) {
  const { playTrack } = usePlayer();
  const { user } = useAuth();

  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !user) return;

    let cancelled = false;

    async function loadRecentlyPlayed() {
      setLoading(true);
      setRecent([]);

      const { data, error } = await supabase
        .from("recently_played")
        .select(`
          id,
          tracks (
            id,
            title,
            artist,
            cover_url,
            audio_url
          )
        `)
        .eq("user_id", user.id)
        .order("played_at", { ascending: false })
        .limit(10);

      if (!cancelled) {
        if (!error) {
          setRecent(data || []);
        }
        setLoading(false);
      }
    }

    loadRecentlyPlayed();

    return () => {
      cancelled = true;
    };
  }, [open, user]);

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Recently Played</h2>

      {loading && (
        <p className="text-sm opacity-60">Loading recent tracks…</p>
      )}

      {!loading && recent.length === 0 && (
        <p className="text-sm opacity-60">
          You haven’t played any tracks yet.
        </p>
      )}

      <ul className="space-y-2">
        {recent.map((item) => {
          const track = item.tracks;
          if (!track) return null;

          return (
            <li
              key={item.id}
              onClick={() => {
                playTrack(track);
                onClose();
              }}
              className="
                w-full p-3 rounded-lg cursor-pointer
                bg-gray-100 text-black
                dark:bg-white/10 dark:text-white
                border border-black/10 dark:border-white/10
                hover:bg-accent/20 transition
              "
            >
              <p className="font-medium">{track.title}</p>
              <p className="text-sm opacity-70">{track.artist}</p>
            </li>
          );
        })}
      </ul>
    </Modal>
  );
}
