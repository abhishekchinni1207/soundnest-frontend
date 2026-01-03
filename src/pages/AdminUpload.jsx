import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const GENRES = [
  "Pop",
  "Rock",
  "Hip Hop",
  "Electronic",
  "Acoustic",
  "Classical",
];

const MOODS = [
  "Chill",
  "Energetic",
  "Happy",
  "Sad",
  "Focus",
  "Romantic",
];

export default function AdminUpload() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [genre, setGenre] = useState("");
  const [mood, setMood] = useState("");
  const [audio, setAudio] = useState(null);
  const [cover, setCover] = useState(null);
  const [loading, setLoading] = useState(false);

  const audioRef = useRef(null);
  const coverRef = useRef(null);
  const navigate = useNavigate();

  async function handleUpload(e) {
    e.preventDefault();
    if (loading) return;

    if (!title || !artist || !genre || !mood || !audio || !cover) {
      alert("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("artist", artist.trim());
    formData.append("genre", genre);
    formData.append("mood", mood);
    formData.append("audio", audio);
    formData.append("cover", cover);

    setLoading(true);

    try {
      await api.post("/tracks/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Uploaded with waveform 🎉");

      // reset form
      setTitle("");
      setArtist("");
      setGenre("");
      setMood("");
      setAudio(null);
      setCover(null);
      audioRef.current.value = "";
      coverRef.current.value = "";
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-darkBg dark:text-white">
      <div className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-darkCard shadow-xl">
        <button onClick={() => navigate(-1)} className="mb-4 text-sm">
          ← Back
        </button>

        <h2 className="text-xl font-semibold mb-4">Upload Track</h2>

        <form onSubmit={handleUpload} className="space-y-4">
          <input
            placeholder="Track Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded border"
          />

          <input
            placeholder="Artist Name"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="w-full px-4 py-2 rounded border"
          />

          <select value={genre} onChange={(e) => setGenre(e.target.value)} className="w-full px-4 py-2 rounded border">
            <option value="">Select Genre</option>
            {GENRES.map((g) => <option key={g}>{g}</option>)}
          </select>

          <select value={mood} onChange={(e) => setMood(e.target.value)} className="w-full px-4 py-2 rounded border">
            <option value="">Select Mood</option>
            {MOODS.map((m) => <option key={m}>{m}</option>)}
          </select>

          <input ref={audioRef} type="file" accept="audio/*" onChange={(e) => setAudio(e.target.files[0])} />
          <input ref={coverRef} type="file" accept="image/*" onChange={(e) => setCover(e.target.files[0])} />

          <button
            disabled={loading}
            className="w-full py-2 rounded bg-accent text-black font-semibold"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
}
