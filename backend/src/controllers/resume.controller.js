import { createResume } from "../services/resume.service.js";

export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const resume = await createResume({
      file: req.file,
      userId: req.user.userId,
    });

    res.status(201).json({
      message: "Resume uploaded successfully",
      data: { resumeId: resume._id },
    });
  } catch (err) {
    next(err);
  }
};
