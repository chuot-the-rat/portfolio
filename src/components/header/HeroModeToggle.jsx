/**
 * HeroModeToggle.jsx
 * Three-mode pill: Work / Study / Chaos.
 * Each button shows an icon + a text label.
 * Active state gets a mode-specific accent color (via CSS class).
 */

import { Laptop, BookOpen, Confetti } from "@phosphor-icons/react";

const MODES = [
  { id: "work",  Icon: Laptop,   label: "Work" },
  { id: "study", Icon: BookOpen, label: "Study" },
  { id: "chaos", Icon: Confetti, label: "Chaos" },
];

export default function HeroModeToggle({ mode, onChange }) {
  return (
    <div className="hs-mode-toggle" role="group" aria-label="Hero mode">
      {MODES.map(({ id, Icon, label }) => {
        const isActive = mode === id;
        return (
          <button
            key={id}
            className={[
              "hs-mode-btn",
              isActive ? "hs-mode-btn--active" : "",
              isActive ? `hs-mode-btn--${id}` : "",
            ].filter(Boolean).join(" ")}
            onClick={() => onChange(id)}
            aria-pressed={isActive}
          >
            <Icon size={14} weight={isActive ? "fill" : "regular"} />
            <span className="hs-mode-btn__label">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
