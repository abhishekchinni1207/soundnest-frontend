import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import TrackCard from "../components/TrackCard";
import { supabase } from "../services/supabase";
import { usePlayer } from "../context/player/usePlayer";
import CreatePlaylistModal from "../components/CreatePlaylistModal";
import PlaylistListModal from "../components/PlaylistListModal";
import RecentlyPlayedModal from "../components/RecentlyPlayedModal";
import { useTheme } from "../context/theme/useTheme";
import { useAuth } from "../context/useAuth";
import RecommendedTracks from "../components/RecommendedTracks";
import { getDB } from "../offline/db";

export default function Home() {
  const [tracks, setTracks] = useState([]);
  const [offlineOnly, setOfflineOnly] = useState(false);
  const [loadingTracks, setLoadingTracks] = useState(true);

  const [openPlaylistModal, setOpenPlaylistModal] = useState(false);
  const [openPlaylists, setOpenPlaylists] = useState(false);
  const [openRecent, setOpenRecent] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const { resetPlayer, currentTrack } = usePlayer();
  const { role, loading } = useAuth();

  /* 🎨 Header Button Style (memoized) */
  const headerBtn = useMemo(
    () =>
      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium \
       bg-white text-black border border-blue-400 \
       hover:bg-blue-50 hover:border-blue-500 \
       dark:bg-darkCard dark:text-white dark:border-white/20 \
       dark:hover:bg-white/10 dark:hover:border-white/40 \
       transition-all",
    []
  );

  async function handleLogout() {
    try {
      resetPlayer();
      await supabase.auth.signOut();
    } catch {
      /* silent fail */
    }
  }

  /* 🔁 LOAD TRACKS (ONLINE → OFFLINE FALLBACK) */
  useEffect(() => {
    let mounted = true;

    async function loadTracks() {
      setLoadingTracks(true);

      try {
        const res = await api.get("/tracks");
        if (!mounted) return;

        setTracks(res.data || []);

        // cache once (batch)
        const db = await getDB();
        await Promise.all(
          (res.data || []).map((track) =>
            db.put("tracks", { ...track, isOffline: false })
          )
        );
      } catch {
        try {
          const db = await getDB();
          const cached = await db.getAll("tracks");
          if (mounted) setTracks(cached || []);
        } catch {
          if (mounted) setTracks([]);
        }
      } finally {
        if (mounted) setLoadingTracks(false);
      }
    }

    loadTracks();
    return () => {
      mounted = false;
    };
  }, []);

  /* 🎧 FILTER TRACKS */
  const visibleTracks = offlineOnly
    ? tracks.filter((t) => t.isOffline)
    : tracks;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-darkBg px-6 pt-24 pb-40">
      {/* HEADER */}
      <div className="fixed top-0 left-0 right-0 z-40 h-16 px-6
        flex items-center justify-between
        bg-white dark:bg-black
        border-b border-black/10 dark:border-white/10">
        <h1 className="text-3xl font-bold">🎧 SoundNest</h1>

        <div className="flex gap-3 flex-wrap">
          <button onClick={toggleTheme} className={headerBtn}>
            {theme === "dark" ? "☀ Light" : "🌙 Dark"}
          </button>

          <button
            onClick={() => setOfflineOnly((p) => !p)}
            className={headerBtn}
          >
            {offlineOnly ? "📡 Show All" : "⬇ Offline Only"}
          </button>

          {!loading && role === "admin" && (
            <Link to="/admin/upload" className={headerBtn}>
              Admin Upload
            </Link>
          )}

          <button onClick={() => setOpenPlaylists(true)} className={headerBtn}>
            🎵 My Playlists
          </button>

          <button onClick={() => setOpenPlaylistModal(true)} className={headerBtn}>
            + Playlist
          </button>

          <button onClick={() => setOpenRecent(true)} className={headerBtn}>
            ⏱ Recently Played
          </button>

          <Link to="/analytics" className={headerBtn}>
            📊 Analytics
          </Link>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
          >
            Logout
          </button>
        </div>
      </div>

      {/* TRACK GRID */}
      {loadingTracks ? (
        <p className="text-center opacity-60 mt-12 dark:text-white">Loading tracks…</p>
      ) : visibleTracks.length === 0 ? (
        <p className="text-center opacity-60 mt-12 dark:text-white">
          No tracks available {offlineOnly && "(offline only)"}
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 dark:text-white">
          {visibleTracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      )}

      {/* MODALS */}
      <CreatePlaylistModal
        open={openPlaylistModal}
        onClose={() => setOpenPlaylistModal(false)}
      />

      <PlaylistListModal
        open={openPlaylists}
        onClose={() => setOpenPlaylists(false)}
      />

      <RecentlyPlayedModal
        open={openRecent}
        onClose={() => setOpenRecent(false)}
      />

      {/* RECOMMENDATIONS */}
      {currentTrack && <RecommendedTracks currentTrack={currentTrack} />}
    </div>
  );
}
