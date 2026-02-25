const SKILL_ALIASES = {
  "react.js": "react",
  reactjs: "react",
  "node.js": "nodejs",
  node: "nodejs",
  "express.js": "express",
  expressjs: "express",
  postgres: "postgresql",
  "postgre sql": "postgresql",
  mongo: "mongodb",
  "next.js": "nextjs",
  nextjs: "nextjs",
  ts: "typescript",
  js: "javascript",
};

/**
 * Normalizes a single skill string or object to a canonical lowercase form
 */
export function normalizeSkill(raw) {
  if (!raw) return null;

  let skill = typeof raw === "string" ? raw : raw.name || raw.skill || raw.value || null;

  if (!skill || typeof skill !== "string") return null;

  const cleaned = skill.toLowerCase().trim().replace(/\s+/g, "").replace(/\./g, "");

  return SKILL_ALIASES[cleaned] ?? cleaned;
}

/**
 * Normalizes an array of skills and removes duplicates
 */
export function normalizeSkillArray(skills = []) {
  if (!Array.isArray(skills)) return [];
  return [...new Set(skills.map(normalizeSkill).filter(Boolean))];
}
