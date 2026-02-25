import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

/**
 * @param {{ score: number }} props
 */
export default function ScoreChart({ score }) {
  return (
    <div style={{ textAlign: "center" }}>
      <RadialBarChart
        width={220}
        height={220}
        innerRadius="70%"
        outerRadius="100%"
        data={[{ name: "Score", value: score }]}
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
        <RadialBar dataKey="value" fill="#4f46e5" />
      </RadialBarChart>
      <p style={{ fontSize: "18px", fontWeight: "bold" }}>{score}% Match</p>
    </div>
  );
}
