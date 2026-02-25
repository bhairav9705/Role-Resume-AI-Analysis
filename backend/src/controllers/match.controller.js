import mongoose from "mongoose";
import { matchResumeWithJD } from "../services/match.service.js";
import Match from "../models/match.model.js";

export const createMatch = async (req, res, next) => {
  try {
    const { resumeId, jdId } = req.body;
    const userId = req.user.userId;

    if (!resumeId || !jdId) {
      return res
        .status(400)
        .json({ message: "resumeId and jdId are required" });
    }

    const result = await matchResumeWithJD({ userId, resumeId, jdId });

    const match = await Match.create({
      resumeId,
      jdId,
      finalScore: result.finalScore,
      summary: result.summary,
      matchedSkills: result.matchedSkills,
      missingSkills: result.missingSkills,
      skillGap: result.skillGap,
      createdBy: userId,
    });

    res.status(201).json({
      message: "Match completed",
      data: { matchId: match._id.toString() },
    });
  } catch (err) {
    next(err);
  }
};

export const getMatchById = async (req, res, next) => {
  try {
    const { matchId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(matchId)) {
      return res.status(400).json({ message: "Invalid match ID" });
    }

    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    res.json({ data: match });
  } catch (err) {
    next(err);
  }
};

export const getMatchHistory = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const matches = await Match.find(
      { createdBy: userId },
      { finalScore: 1, createdAt: 1 }
    ).sort({ createdAt: -1 });

    res.json(
      matches.map((m) => ({
        id: m._id,
        finalScore: m.finalScore,
        createdAt: m.createdAt,
      }))
    );
  } catch (err) {
    next(err);
  }
};
