import api from "./axios";

/**
 * Uploads a resume file and returns the created resumeId
 * @param {File} file
 * @returns {Promise<{ resumeId: string }>}
 */
export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  const res = await api.post("/resume/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.data; // { resumeId }
};
