import groq from "../config/groq.js";

/**
 * Generates a short AI-written explanation of a resume-JD match
 */
export async function generateMatchSummary({
  score,
  matched = [],
  missing = [],
  optionalMatched = [],
}) {
  const prompt = `
You are an ATS and technical hiring assistant.

A resume was matched against a job description.

Match Score: ${score}%

Matched Skills: ${matched.length ? matched.join(", ") : "None"}
Missing Required Skills: ${missing.length ? missing.join(", ") : "None"}
Optional Skills Matched: ${optionalMatched.length ? optionalMatched.join(", ") : "None"}

Task:
1. Briefly explain why the candidate received this score.
2. Highlight strengths based on matched skills.
3. Mention missing skills clearly.
4. Give 1-2 concrete improvement suggestions.

Rules:
- Be concise (max 120 words)
- Be professional
- No emojis, no markdown, no bullet points
`.trim();

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You explain resume-job match scores." },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    });

    return completion.choices[0]?.message?.content?.trim();
  } catch (err) {
    console.error("AI summary generation failed:", err.message);
    return "Match analysis completed. Review matched and missing skills to improve alignment with this role.";
  }
}
