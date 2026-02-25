import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getMatchById } from "../api/match";
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

  useEffect(() => {
    if (!matchId) {
      setMatchData(null);
      return;
    }

    setLoading(true);
    setError("");
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

      {/* No match selected */}
      {!matchId && !loading && (
        <div style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}>
          <p>No analysis selected. Click <strong>+ New Analysis</strong> to get started, or view your history.</p>
        </div>
      )}

      {/* Loading / Error */}
      {loading && <p>Loading analysis...</p>}
      {error && <p style={{ color: "#dc2626" }}>{error}</p>}

      {/* Match Result */}
      {matchData && (
        <div>
          <h3>Analysis Result</h3>

          {/* Score + Summary Row */}
          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "24px", marginBottom: "30px" }}>
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
};

const btnSecondary = {
  padding: "8px 16px",
  background: "#fff",
  color: "#374151",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  cursor: "pointer",
};

const btnDanger = {
  padding: "8px 16px",
  background: "#fff",
  color: "#dc2626",
  border: "1px solid #fca5a5",
  borderRadius: "6px",
  cursor: "pointer",
};

const card = {
  padding: "20px",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};
