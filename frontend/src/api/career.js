import api from "./axios";

/**
 * Generates career insights for a match
 * @param {string} matchId
 */
export const getCareerInsights = async (matchId) => {
  const res = await api.post("/career/insights", { matchId });
  return res.data.data;
};
