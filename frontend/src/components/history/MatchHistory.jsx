import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMatchHistory } from "../../api/match";

/**
 * @param {{ onSelect?: () => void }} props
 */
export default function MatchHistory({ onSelect }) {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMatchHistory()
      .then(setHistory)
      .catch(() => setError("Failed to load history"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading history...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!history.length) return <p>No previous analyses found.</p>;

  const handleView = (id) => {
    navigate(`/dashboard?matchId=${id}`);
    onSelect?.(); // safe call — only invoked if prop is provided
  };

  return (
    <table width="100%" style={{ borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ background: "#f3f4f6" }}>
          <th style={thStyle}>Date</th>
          <th style={thStyle}>Score</th>
          <th style={thStyle}></th>
        </tr>
      </thead>
      <tbody>
        {history.map((item) => (
          <tr key={item.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
            <td style={tdStyle}>{new Date(item.createdAt).toLocaleDateString()}</td>
            <td style={tdStyle}>{item.finalScore}%</td>
            <td style={tdStyle}>
              <button onClick={() => handleView(item.id)}>View</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const thStyle = { padding: "10px 12px", textAlign: "left", fontWeight: "600" };
const tdStyle = { padding: "10px 12px" };
