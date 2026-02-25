import { normalizeSkillArray } from "../utils/skillNormalizer.js";

/**
 * Classifies skill gaps between resume and JD into must-have vs nice-to-have
 */
export function classifySkillGaps({ resumeSkills = [], requiredSkills = [], optionalSkills = [] }) {
  const resume = normalizeSkillArray(resumeSkills);
  const required = normalizeSkillArray(requiredSkills);
  const optional = normalizeSkillArray(optionalSkills);

  const mustHave = required.filter((skill) => !resume.includes(skill));
  const niceToHave = optional.filter((skill) => !resume.includes(skill));

  return { mustHave, niceToHave };
}
