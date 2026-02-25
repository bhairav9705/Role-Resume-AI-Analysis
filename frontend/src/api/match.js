import api from "./axios";

/**
 * Creates a resume-JD match and returns the matchId
 * @param {{ resumeId: string, jdId: string }} payload
 * @returns {Promise<{ matchId: string }>}
 */
export const createMatch = async ({ resumeId, jdId }) => {
  const res = await api.post("/match", { resumeId, jdId });
  return res.data.data; // { matchId }
};

/**
 * Fetches a single match result by ID
 * @param {string} matchId
 */
export const getMatchById = async (matchId) => {
  const res = await api.get(`/match/${matchId}`);
  return res.data.data;
};

/**
 * Fetches the current user's match history
 */
export const getMatchHistory = async () => {
  const res = await api.get("/match/history");
  return res.data; // array of { id, finalScore, createdAt }
};
