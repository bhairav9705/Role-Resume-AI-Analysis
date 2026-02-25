import mongoose from "mongoose";
import Match from "../models/match.model.js";
import { JDAnalysis } from "../models/jdAnalysis.model.js";
import Resume from "../models/resume.model.js";
import { getMongoCollection } from "../config/db.js";
import { classifySkillGaps } from "./careerGap.service.js";
import { calculateRoleReadiness } from "./careerReadiness.service.js";
import { generateCareerRoadmap } from "./careerRoadmap.service.js";

export async function generateCareerInsights({ matchId, userId }) {
  const match = await Match.findOne({
    _id: new mongoose.Types.ObjectId(matchId),
    createdBy: userId,
  });

  if (!match) throw new Error("Match not found");

  const [resumeDoc, jdDoc] = await Promise.all([
    Resume.findById(match.resumeId),
    JDAnalysis.findById(match.jdId),
  ]);

  if (!resumeDoc) throw new Error("Resume not found");
  if (!jdDoc) throw new Error("Job description not found");

  const gaps = classifySkillGaps({
    resumeSkills: match.matchedSkills,
    requiredSkills: [
      ...(jdDoc.skills?.technicalSkills || []),
      ...(jdDoc.skills?.frameworks || []),
    ],
    optionalSkills: [
      ...(jdDoc.skills?.tools || []),
      ...(jdDoc.skills?.softSkills || []),
    ],
  });

  const readiness = calculateRoleReadiness({
    mustHaveGaps: gaps.mustHave,
    resumeExperience: 0, // extend with resume parsing if needed
    minExperience: jdDoc.experience?.minYears || 0,
  });

  const roadmap = await generateCareerRoadmap({
    role: jdDoc.metadata?.jobTitle || "Target Role",
    mustHave: gaps.mustHave,
    niceToHave: gaps.niceToHave,
    experienceGap: readiness.experience !== "READY",
  });

  const insightId = new mongoose.Types.ObjectId();

  await getMongoCollection("career_insights").insertOne({
    _id: insightId,
    matchId,
    userId,
    skillGaps: gaps,
    readiness,
    roadmap,
    createdAt: new Date(),
  });

  return {
    insightId: insightId.toString(),
    skillGaps: gaps,
    readiness,
    roadmap,
  };
}
