import { analyzeJobDescription } from "../services/jdAnalysis.service.js";

export const analyzeJD = async (req, res, next) => {
  try {
    const { jobDescription } = req.body;

    if (!jobDescription || jobDescription.trim().length < 50) {
      return res
        .status(400)
        .json({ message: "Job description is too short (min 50 characters)" });
    }

    const result = await analyzeJobDescription({
      userId: req.user.userId,
      jobDescription,
    });

    res.status(201).json({
      data: {
        jdId: result.mongoId,
      },
    });
  } catch (err) {
    next(err);
  }
};
