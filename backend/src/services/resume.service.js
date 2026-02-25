import Resume from "../models/resume.model.js";
import { extractText } from "../utils/textExtractor.js";

export const createResume = async ({ file, userId }) => {
  const text = await extractText(file);

  if (!text || text.trim().length < 50) {
    throw new Error("Resume text extraction failed or content is too short");
  }

  const resume = await Resume.create({
    userId,
    content: text,
    fileName: file.originalname,
  });

  return resume;
};
