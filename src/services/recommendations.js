import api from "./api";

/**
 * Get recommended tracks for a given track
 */
export async function getRecommendations(trackId) {
  if (!trackId) {
    throw new Error("trackId is required for recommendations");
  }

  try {
    const res = await api.get(`/recommendations/${trackId}`);
    return res.data;
  } catch (err) {
    console.error("getRecommendations error:", err);
    throw err;
  }
}
