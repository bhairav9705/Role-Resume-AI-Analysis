import { generateCareerInsights } from "../services/careerInsight.service.js";

export const getCareerInsights = async (req, res, next) => {
  try {
    const { matchId } = req.body;
    const userId = req.user.userId;

    if (!matchId) {
      return res.status(400).json({ message: "matchId is required" });
    }

    const result = await generateCareerInsights({ matchId, userId });

    res.status(201).json({
      message: "Career insights generated",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
