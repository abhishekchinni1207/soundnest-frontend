import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Analytics() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadAnalytics() {
      try {
        const [summaryRes, topRes] = await Promise.all([
          api.get("/analytics/summary"),
          api.get("/analytics/top-tracks"),
        ]);

        if (!mounted) return;

        setSummary(summaryRes.data || {});
        setTopTracks(Array.isArray(topRes.data) ? topRes.data : []);
      } catch {
        if (mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadAnalytics();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm opacity-60">Loading analytics…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-red-500">
          Failed to load analytics
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black text-black dark:text-white p-6">
      {/* 🔙 BACK */}
      <button
        onClick={() => navigate("/")}
        className="mb-6 text-sm font-medium hover:text-accent transition"
      >
        ← Back to Home
      </button>

      <h1 className="text-2xl font-semibold mb-6">
        Listening Analytics
      </h1>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard title="Total Plays" value={summary.total_plays || 0} />
        <StatCard title="Total Minutes" value={summary.total_minutes || 0} />
        <StatCard title="Unique Tracks" value={summary.unique_tracks || 0} />
      </div>

      {/* TOP TRACKS */}
      <div className="bg-white dark:bg-darkCard rounded-xl p-4 border border-black/10 dark:border-white/10">
        <h2 className="text-lg font-semibold mb-4">Top Tracks</h2>

        {topTracks.length === 0 && (
          <p className="text-sm opacity-60">No data yet</p>
        )}

        {topTracks.map((track) => (
          <div
            key={track.track_id}
            className="flex items-center justify-between py-2 border-b border-black/5 dark:border-white/5 last:border-none"
          >
            <div>
              <p className="font-medium">{track.title}</p>
              <p className="text-sm opacity-60">{track.artist}</p>
            </div>

            <span className="text-sm font-medium">
              {Math.floor((track.total_seconds || 0) / 60)} min
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white dark:bg-darkCard rounded-xl p-4 border border-black/10 dark:border-white/10">
      <p className="text-sm opacity-60">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
