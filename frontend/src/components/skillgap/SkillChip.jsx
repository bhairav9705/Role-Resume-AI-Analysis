const COLOR_MAP = {
  matched: "bg-green-100 text-green-800 border-green-300",
  missing: "bg-red-100 text-red-800 border-red-300",
  must: "bg-red-100 text-red-800 border-red-300",
  good: "bg-blue-100 text-blue-800 border-blue-300",
  optional: "bg-yellow-100 text-yellow-800 border-yellow-300",
  default: "bg-gray-100 text-gray-800 border-gray-300",
};

/**
 * @param {{ label: string, type?: keyof typeof COLOR_MAP }} props
 */
export default function SkillChip({ label, type = "default" }) {
  const colorClass = COLOR_MAP[type] ?? COLOR_MAP.default;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-sm border rounded-full ${colorClass}`}
    >
      {label}
    </span>
  );
}
