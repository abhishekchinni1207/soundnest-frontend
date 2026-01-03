import { getDB } from "./db";

export async function downloadTrack(track) {
  try {
    if (!track?.audio_url) {
      throw new Error("Invalid track");
    }

    // 🔐 Always download via backend proxy
    const proxyUrl =
      `${import.meta.env.VITE_BACKEND_URL}/proxy-audio?url=` +
      encodeURIComponent(track.audio_url);

    const res = await fetch(proxyUrl);

    if (!res.ok) {
      throw new Error("Audio download failed");
    }

    const blob = await res.blob();

    const db = await getDB();

    await db.put("tracks", {
      ...track,
      audio_blob: blob,
      isOffline: true,
      downloaded_at: Date.now(),
    });

    alert(
  navigator.onLine
    ? "Saved for offline playback ✅"
    : "Playing offline 🎧"
);

  } catch (err) {
    console.error("Offline download failed:", err);
    alert("Offline download not available for this track");
  }
}
