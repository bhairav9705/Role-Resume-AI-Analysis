import api from "./axios";

/**
 * Analyzes a job description and returns the jdId
 * @param {string} jobDescription
 * @returns {Promise<{ jdId: string }>}
 */
export const analyzeJD = async (jobDescription) => {
  const res = await api.post("/jd/analyze", { jobDescription });
  return res.data.data; // { jdId }
};
