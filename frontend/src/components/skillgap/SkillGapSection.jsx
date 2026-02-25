import SkillChip from "./SkillChip";

/**
 * @param {{ title: string, skills: string[], type?: string }} props
 */
export default function SkillGapSection({ title, skills, type = "default" }) {
  if (!skills?.length) return null;

  return (
    <div style={{ marginBottom: "16px" }}>
      <h4 style={{ marginBottom: "8px" }}>{title}</h4>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {skills.map((skill) => (
          <SkillChip key={skill} label={skill} type={type} />
        ))}
      </div>
    </div>
  );
}
