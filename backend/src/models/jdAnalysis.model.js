import mongoose from "mongoose";

const jdAnalysisSchema = new mongoose.Schema(
  {
    postgresJdId: { type: String },
    rawText: { type: String },

    metadata: {
      jobTitle: String,
      seniority: String,
      employmentType: String,
      location: String,
    },

    skills: {
      technicalSkills: [String],
      frameworks: [String],
      tools: [String],
      softSkills: [String],
    },

    experience: {
      minYears: Number,
      maxYears: Number,
    },

    education: [String],
    responsibilities: [String],
    roleFocus: [String],
  },
  { timestamps: true }
);

export const JDAnalysis = mongoose.model("JDAnalysis", jdAnalysisSchema);
