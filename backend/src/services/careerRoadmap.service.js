import groq from "../config/groq.js";

/**
 * Generates a 4-6 week career roadmap using AI
 */
export async function generateCareerRoadmap({
  role,
  mustHave = [],
  niceToHave = [],
  experienceGap = false,
}) {
  const prompt = `
You are a career mentor for software engineers.

Target Role: ${role}
Missing Must-Have Skills: ${mustHave.length ? mustHave.join(", ") : "None"}
Nice-to-Have Skills: ${niceToHave.length ? niceToHave.join(", ") : "None"}
Experience Gap: ${experienceGap ? "Yes" : "No"}

Task:
1. Create a realistic 4-6 week learning roadmap.
2. Prioritize must-have skills first.
3. Be practical and beginner-friendly.
4. No fluff, no emojis, no markdown. Max 150 words.
`.trim();

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: "You generate career roadmaps." },
      { role: "user", content: prompt },
    ],
    temperature: 0.3,
  });

  return completion.choices[0].message.content.trim();
}
