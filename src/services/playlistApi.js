import api from "./api";

/* ============================
   PLAYLIST API (PRODUCTION)
============================ */

/**
 * Create a new playlist
 */
export async function createPlaylist(payload) {
  try {
    return await api.post("/playlists", payload);
  } catch (err) {
    console.error("createPlaylist error:", err);
    throw err;
  }
}

/**
 * Get playlists for a user
 */
export async function getPlaylists(userId) {
  if (!userId) throw new Error("User ID is required");

  try {
    return await api.get(`/playlists/${userId}`);
  } catch (err) {
    console.error("getPlaylists error:", err);
    throw err;
  }
}

/**
 * Add track to playlist
 */
export async function addTrackToPlaylist(payload) {
  try {
    return await api.post("/playlists/add-track", payload);
  } catch (err) {
    console.error("addTrackToPlaylist error:", err);
    throw err;
  }
}

/**
 * Get tracks inside a playlist
 */
export async function getPlaylistTracks(playlistId) {
  if (!playlistId) throw new Error("Playlist ID is required");

  try {
    return await api.get(`/playlists/tracks/${playlistId}`);
  } catch (err) {
    console.error("getPlaylistTracks error:", err);
    throw err;
  }
}

/**
 * Remove track from playlist
 */
export async function removeTrackFromPlaylist(payload) {
  try {
    return await api.delete("/playlists/remove-track", {
      data: payload,
    });
  } catch (err) {
    console.error("removeTrackFromPlaylist error:", err);
    throw err;
  }
}
