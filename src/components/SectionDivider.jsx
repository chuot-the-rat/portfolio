/**
 * SectionDivider.jsx
 * Editorial divider with a section label. Place between every major section
 * of every case study (Problem / Approach / Solution / Outcome, etc.)
 *
 * Props:
 *   index   — section number, shown as zero-padded "01". Required.
 *   label   — section name, e.g. "Approach". Required.
 *   className — forwarded to the root element.
 */

import "./SectionDivider.css";

export default function SectionDivider({ index, label, className = "" }) {
  const num = String(index).padStart(2, "0");

  return (
    <div className={["sd", className].filter(Boolean).join(" ")} aria-hidden="true">
      <hr className="sd__rule" />
      <span className="sd__label">
        <span className="sd__num">{num}</span>
        <span className="sd__sep">/</span>
        <span className="sd__name">{label}</span>
      </span>
    </div>
  );
}
