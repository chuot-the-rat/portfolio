/**
 * MetadataRow.jsx
 * A data-driven metadata display for case study headers.
 * Renders a horizontal row of label/value pairs below the opening statement.
 *
 * Props:
 *   fields — array of { label, value } objects. Only truthy values render.
 *   className — forwarded to root.
 *
 * Example:
 *   <MetadataRow fields={[
 *     { label: "Role",     value: "Lead Designer" },
 *     { label: "Year",     value: "2024" },
 *     { label: "Platform", value: "iOS & Web" },
 *     { label: "Team",     value: "3 designers, 2 engineers" },
 *   ]} />
 */

import "./MetadataRow.css";

export default function MetadataRow({ fields = [], className = "" }) {
  const visible = fields.filter((f) => f && f.value);
  if (visible.length === 0) return null;

  return (
    <dl className={["mr", className].filter(Boolean).join(" ")}>
      {visible.map(({ label, value }) => (
        <div key={label} className="mr__cell">
          <dt className="mr__label">{label}</dt>
          <dd className="mr__value">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
