/**
 * MarqueeTicker.jsx
 * Continuously scrolling horizontal ticker — editorial "energy belt."
 * Pure CSS animation, no JS needed after mount.
 * Doubles the item array so the loop is seamless.
 */

import "./MarqueeTicker.css";

const ITEMS = [
  "UI/UX Design",
  "Front-End Development",
  "Figma",
  "React",
  "User Research",
  "Interaction Design",
  "CSS",
  "Framer Motion",
  "Prototyping",
  "Design Systems",
  "Available for Work",
  "Vancouver, BC",
];

const DOT = <span className="mq-dot" aria-hidden="true">✦</span>;

export default function MarqueeTicker({ direction = "left", speed = 40 }) {
  const items = [...ITEMS, ...ITEMS]; // double for seamless loop

  return (
    <div
      className="mq"
      aria-hidden="true"
      style={{ "--mq-speed": `${speed}s` }}
    >
      <div className={`mq-track mq-track--${direction}`}>
        {items.map((item, i) => (
          <span key={i} className="mq-item">
            {DOT}
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
