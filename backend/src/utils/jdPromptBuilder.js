/**
 * Builds the AI prompt used to extract structured data from a job description
 * @param {string} jobDescription
 * @returns {string}
 */
export const buildJDPrompt = (jobDescription) => `
You are an AI system that extracts structured job description intelligence.

Return ONLY valid JSON. Do NOT add explanations. Do NOT invent skills not present in the JD.

JSON SCHEMA:
{
  "metadata": {
    "jobTitle": string | null,
    "seniority": "Intern" | "Entry" | "Mid" | "Senior" | null,
    "employmentType": string | null,
    "location": string | null
  },
  "skills": {
    "technicalSkills": string[],
    "frameworks": string[],
    "tools": string[],
    "softSkills": string[]
  },
  "experience": {
    "minYears": number | null,
    "maxYears": number | null
  },
  "education": string[],
  "responsibilities": string[],
  "roleFocus": string[]
}

JOB DESCRIPTION:
"""
${jobDescription}
"""
`.trim();
