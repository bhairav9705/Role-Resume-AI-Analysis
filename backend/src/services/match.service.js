import Resume from "../models/resume.model.js";
import { JDAnalysis } from "../models/jdAnalysis.model.js";
import { normalizeSkillArray } from "../utils/skillNormalizer.js";

// Extend this list as needed
const KNOWN_SKILLS = [
  "java", "javascript", "typescript", "python", "go", "rust",
  "react", "vue", "angular", "svelte", "nextjs",
  "node", "nodejs", "express", "fastapi", "django",
  "mongodb", "postgresql", "mysql", "redis", "sqlite",
  "docker", "kubernetes", "git", "github", "gitlab",
  "html", "css", "tailwind", "graphql", "rest",
  "aws", "gcp", "azure", "linux", "bash",
];

/**
 * Extract skills from raw resume text by checking against a known skill list
 */
function extractSkillsFromText(text = "") {
  const lower = text.toLowerCase();
  return KNOWN_SKILLS.filter((skill) => lower.includes(skill));
}

/**
 * Match a resume against a job description and return a structured score
 */
export async function matchResumeWithJD({ resumeId, jdId }) {
  const [resumeDoc, jdDoc] = await Promise.all([
    Resume.findById(resumeId),
    JDAnalysis.findById(jdId),
  ]);

  if (!resumeDoc) throw new Error("Resume not found");
  if (!jdDoc) throw new Error("Job description not found");

  const resumeSkills = normalizeSkillArray(
    extractSkillsFromText(resumeDoc.content)
  );

  const requiredSkills = normalizeSkillArray([
    ...(jdDoc.skills?.technicalSkills || []),
    ...(jdDoc.skills?.frameworks || []),
  ]);

  const optionalSkills = normalizeSkillArray([
    ...(jdDoc.skills?.tools || []),
    ...(jdDoc.skills?.softSkills || []),
  ]);

  const matchedRequired = requiredSkills.filter((s) => resumeSkills.includes(s));
  const matchedOptional = optionalSkills.filter((s) => resumeSkills.includes(s));
  const missingRequired = requiredSkills.filter((s) => !resumeSkills.includes(s));
  const missingOptional = optionalSkills.filter((s) => !resumeSkills.includes(s));

  const requiredScore =
    requiredSkills.length > 0
      ? (matchedRequired.length / requiredSkills.length) * 70
      : 0;

  const optionalScore =
    optionalSkills.length > 0
      ? (matchedOptional.length / optionalSkills.length) * 30
      : 0;

  const finalScore = Math.round(requiredScore + optionalScore);

  return {
    finalScore,
    summary: `Matched ${matchedRequired.length}/${requiredSkills.length} required skills and ${matchedOptional.length}/${optionalSkills.length} optional skills.`,
    matchedSkills: [...new Set([...matchedRequired, ...matchedOptional])],
    missingSkills: missingRequired,
    skillGap: {
      mustHave: missingRequired,
      goodToHave: matchedOptional,
      optional: missingOptional,
    },
  };
}
