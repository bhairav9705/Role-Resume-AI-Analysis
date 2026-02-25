/**
 * Calculates how ready a candidate is for a role
 * @returns {{ coreSkills: string, experience: string, overall: string }}
 */
export function calculateRoleReadiness({
  mustHaveGaps = [],
  resumeExperience = 0,
  minExperience = 0,
}) {
  let coreSkills;
  if (mustHaveGaps.length === 0) coreSkills = "READY";
  else if (mustHaveGaps.length <= 2) coreSkills = "PARTIAL";
  else coreSkills = "NOT_READY";

  let experience;
  if (resumeExperience >= minExperience) experience = "READY";
  else if (resumeExperience >= minExperience * 0.7) experience = "PARTIAL";
  else experience = "NOT_READY";

  let overall;
  if (coreSkills === "READY" && experience === "READY") overall = "READY";
  else if (coreSkills === "NOT_READY" || experience === "NOT_READY") overall = "NOT_READY";
  else overall = "ALMOST_READY";

  return { coreSkills, experience, overall };
}
