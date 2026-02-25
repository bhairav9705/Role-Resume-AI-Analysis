import { db } from "../config/db.js";
import { JDAnalysis } from "../models/jdAnalysis.model.js";
import { buildJDPrompt } from "../utils/jdPromptBuilder.js";
import groq from "../config/groq.js";

export const analyzeJobDescription = async ({ userId, jobDescription }) => {
  // 1. Create a JD record in PostgreSQL to track ownership
  const jd = await db.jobDescription.create({
    data: { userId },
  });

  // 2. Build the AI prompt
  const prompt = buildJDPrompt(jobDescription);

  // 3. Call Groq AI
  let extracted;
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    const rawText = completion.choices[0].message.content;
    const jsonString = rawText.substring(
      rawText.indexOf("{"),
      rawText.lastIndexOf("}") + 1
    );

    extracted = JSON.parse(jsonString);
  } catch (err) {
    console.error("Groq AI error:", err.message);
    throw new Error("Failed to parse AI response for JD analysis");
  }

  // 4. Store enriched analysis in MongoDB
  const mongoJD = await JDAnalysis.create({
    postgresJdId: jd.id,
    rawText: jobDescription,
    ...extracted,
  });

  // 5. Update Postgres with extracted metadata
  await db.jobDescription.update({
    where: { id: jd.id },
    data: {
      jobTitle: extracted.metadata?.jobTitle ?? null,
      seniority: extracted.metadata?.seniority ?? null,
    },
  });

  return {
    mongoId: mongoJD._id.toString(),
    postgresId: jd.id,
  };
};
