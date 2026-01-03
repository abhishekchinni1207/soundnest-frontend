import { useState, useEffect } from "react";
import Modal from "./Modal";
import { createPlaylist } from "../services/playlistApi";
import { useAuth } from "../context/useAuth";

export default function CreatePlaylistModal({ open, onClose, onCreated }) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset input when modal closes
  useEffect(() => {
    if (!open) {
      setName("");
      setLoading(false);
    }
  }, [open]);

  async function handleCreate() {
    if (!name.trim() || !user || loading) return;

    try {
      setLoading(true);

      await createPlaylist({
        name: name.trim(),
        user_id: user.id,
      });

      onCreated?.();
      onClose();
    } catch (err) {
      console.error("Create playlist failed:", err);
      alert("Failed to create playlist");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Create Playlist</h2>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Playlist name"
        disabled={loading}
        className="
          w-full px-3 py-2 rounded-lg mb-5
          bg-gray-100 text-black
          dark:bg-white/10 dark:text-white
          border border-black/20 dark:border-white/20
          focus:ring-2 focus:ring-accent outline-none
          disabled:opacity-60
        "
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          disabled={loading}
          className="
            flex-1 py-2 rounded-lg
            border border-black/30 dark:border-white/30
            hover:bg-black/5 dark:hover:bg-white/10
            disabled:opacity-60
          "
        >
          Cancel
        </button>

        <button
          onClick={handleCreate}
          disabled={loading || !name.trim()}
          className="
            flex-1 py-2 rounded-lg
            bg-accent text-black font-medium
            hover:opacity-90
            disabled:opacity-50
          "
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </Modal>
  );
}
