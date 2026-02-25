import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    jdId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JDAnalysis",
      required: true,
    },
    finalScore: { type: Number, required: true },
    summary: { type: String },
    matchedSkills: [String],
    missingSkills: [String],
    skillGap: {
      mustHave: [String],
      goodToHave: [String],
      optional: [String],
    },
    createdBy: {
      type: Number, // PostgreSQL user ID
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Match", matchSchema);
