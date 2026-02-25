import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getMatchById } from "../api/match";
import { getCareerInsights } from "../api/career";
import { useAuth } from "../context/AuthContext";

import ScoreRing from "../components/charts/ScoreRing";
import SkillList from "../components/skillgap/SkillList";
import SkillGapSection from "../components/skillgap/SkillGapSection";
import MatchHistory from "../components/history/MatchHistory";

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const matchId = new URLSearchParams(location.search).get("matchId");

  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const [insights, setInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState("");

  useEffect(() => {
    if (!matchId) {
      setMatchData(null);
      setInsights(null);
      return;
    }

    setLoading(true);
    setError("");
    setInsights(null);
    setShowHistory(false);

    getMatchById(matchId)
      .then(setMatchData)
      .catch(() => setError("Failed to load match result."))
      .finally(() => setLoading(false));
  }, [matchId]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleGetInsights = async () => {
    setInsightsLoading(true);
    setInsightsError("");
    setInsights(null);

    try {
      const data = await getCareerInsights(matchId);
      setInsights(data);
    } catch (err) {
      setInsightsError(err.message || "Failed to generate career insights.");
    } finally {
      setInsightsLoading(false);
    }
  };

  const readinessColor = {
    READY: "#16a34a",
    ALMOST_READY: "#d97706",
    PARTIAL: "#d97706",
    NOT_READY: "#dc2626",
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 16px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 style={{ margin: 0 }}>Resume Match Dashboard</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => setShowHistory((v) => !v)} style={btnSecondary}>
            {showHistory ? "Hide History" : "History"}
          </button>
          <button onClick={() => navigate("/analyze")} style={btnPrimary}>
            + New Analysis
          </button>
          <button onClick={handleLogout} style={btnDanger}>
            Logout
          </button>
        </div>
      </div>

      {/* History Panel */}
      {showHistory && (
        <div style={{ marginBottom: "40px" }}>
          <h3>Previous Analyses</h3>
          <MatchHistory onSelect={() => setShowHistory(false)} />
        </div>
      )}

      {/* Empty state */}
      {!matchId && !loading && (
        <div style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}>
          <p>No analysis selected. Click <strong>+ New Analysis</strong> to get started.</p>
        </div>
      )}

      {loading && <p>Loading analysis...</p>}
      {error && <p style={{ color: "#dc2626" }}>{error}</p>}

      {/* Match Result */}
      {matchData && (
        <div>
          <h3 style={{ marginBottom: "16px" }}>Analysis Result</h3>

          {/* Score + Summary */}
          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "24px", marginBottom: "24px" }}>
            <div style={card}>
              <ScoreRing score={matchData.finalScore} />
            </div>
            <div style={card}>
              <h4 style={{ marginTop: 0 }}>Summary</h4>
              <p style={{ color: "#4b5563", margin: 0 }}>{matchData.summary}</p>
            </div>
          </div>

          {/* Skills */}
          <SkillList title="Matched Skills" skills={matchData.matchedSkills} type="matched" />
          <SkillList title="Missing Skills" skills={matchData.missingSkills} type="missing" />

          {/* Skill Gap */}
          {matchData.skillGap && (
            <>
              <h4>Skill Gap Breakdown</h4>
              <SkillGapSection title="Must-Have (Missing)" skills={matchData.skillGap.mustHave} type="must" />
              <SkillGapSection title="Good to Have (You Have)" skills={matchData.skillGap.goodToHave} type="good" />
              <SkillGapSection title="Optional (Missing)" skills={matchData.skillGap.optional} type="optional" />
            </>
          )}

          {/* ── Career Insights Section ── */}
          <div style={{ marginTop: "36px", borderTop: "1px solid #e5e7eb", paddingTop: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <h3 style={{ margin: 0 }}>Career Insights & Roadmap</h3>
                <p style={{ color: "#6b7280", fontSize: "14px", margin: "4px 0 0" }}>
                  AI-generated skill gap analysis and a personalised learning roadmap for this role.
                </p>
              </div>
              {!insights && (
                <button
                  onClick={handleGetInsights}
                  disabled={insightsLoading}
                  style={{
                    ...btnPrimary,
                    whiteSpace: "nowrap",
                    opacity: insightsLoading ? 0.6 : 1,
                    cursor: insightsLoading ? "not-allowed" : "pointer",
                  }}
                >
                  {insightsLoading ? "Generating..." : "✨ Generate Insights"}
                </button>
              )}
            </div>

            {insightsError && (
              <p style={{ color: "#dc2626", background: "#fee2e2", padding: "10px 14px", borderRadius: "6px" }}>
                {insightsError}
              </p>
            )}

            {insightsLoading && (
              <div style={{ color: "#6b7280", padding: "20px 0" }}>
                Analysing your profile and generating roadmap...
              </div>
            )}

            {insights && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                {/* Readiness Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                  {[
                    { label: "Core Skills", value: insights.readiness?.coreSkills },
                    { label: "Experience", value: insights.readiness?.experience },
                    { label: "Overall Readiness", value: insights.readiness?.overall },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ ...card, textAlign: "center" }}>
                      <p style={{ margin: "0 0 6px", fontSize: "13px", color: "#6b7280" }}>{label}</p>
                      <span style={{
                        fontWeight: "bold",
                        fontSize: "15px",
                        color: readinessColor[value] || "#374151",
                      }}>
                        {value?.replace("_", " ") || "—"}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Skill Gaps */}
                {insights.skillGaps && (
                  <div style={card}>
                    <h4 style={{ marginTop: 0 }}>Skill Gaps</h4>
                    <SkillGapSection title="Must-Have (Missing)" skills={insights.skillGaps.mustHave} type="must" />
                    <SkillGapSection title="Nice to Have (Missing)" skills={insights.skillGaps.niceToHave} type="optional" />
                    {!insights.skillGaps.mustHave?.length && !insights.skillGaps.niceToHave?.length && (
                      <p style={{ color: "#16a34a", margin: 0 }}>🎉 No significant skill gaps found!</p>
                    )}
                  </div>
                )}

                {/* Roadmap */}
                {insights.roadmap && (
                  <div style={card}>
                    <h4 style={{ marginTop: 0 }}>📍 Learning Roadmap</h4>
                    <p style={{
                      whiteSpace: "pre-line",
                      color: "#374151",
                      lineHeight: "1.7",
                      margin: 0,
                      fontSize: "14px",
                    }}>
                      {insights.roadmap}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setInsights(null)}
                  style={{ ...btnSecondary, alignSelf: "flex-start" }}
                >
                  Regenerate
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const btnPrimary = {
  padding: "8px 16px",
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "14px",
};

const btnSecondary = {
  padding: "8px 16px",
  background: "#fff",
  color: "#374151",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
};

const btnDanger = {
  padding: "8px 16px",
  background: "#fff",
  color: "#dc2626",
  border: "1px solid #fca5a5",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
};

const card = {
  padding: "20px",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
};
