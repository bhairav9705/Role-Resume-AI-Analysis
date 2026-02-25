import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadResume } from "../api/resume";
import { analyzeJD } from "../api/jd";
import { createMatch } from "../api/match";

export default function Analyze() {
  const navigate = useNavigate();
  const [resumeFile, setResumeFile] = useState(null);
  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!resumeFile) return setError("Please upload a resume file.");
    if (jdText.trim().length < 50) return setError("Job description is too short.");

    setError("");
    setLoading(true);

    try {
      // Step 1: Upload resume
      const { resumeId } = await uploadResume(resumeFile);

      // Step 2: Analyze JD
      const { jdId } = await analyzeJD(jdText);

      // Step 3: Create match
      const { matchId } = await createMatch({ resumeId, jdId });

      // Step 4: Navigate to result
      navigate(`/dashboard?matchId=${matchId}`);
    } catch (err) {
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "640px", margin: "60px auto", padding: "0 16px" }}>
      <h2>New Resume Analysis</h2>

      {error && (
        <p style={{ color: "#dc2626", background: "#fee2e2", padding: "8px 12px", borderRadius: "6px", marginBottom: "12px" }}>
          {error}
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
            Resume (PDF or DOCX, max 2MB)
          </label>
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={(e) => setResumeFile(e.target.files[0] || null)}
          />
          {resumeFile && (
            <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>
              Selected: {resumeFile.name}
            </p>
          )}
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
            Job Description
          </label>
          <textarea
            rows={8}
            placeholder="Paste the full job description here..."
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            style={{ width: "100%", padding: "10px", border: "1px solid #d1d5db", borderRadius: "6px", resize: "vertical", boxSizing: "border-box" }}
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          style={{
            padding: "12px 20px",
            background: loading ? "#9ca3af" : "#4f46e5",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold",
            fontSize: "15px",
          }}
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </div>
    </div>
  );
}
