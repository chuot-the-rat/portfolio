/**
 * HeroModeToggle.jsx
 * Three-icon pill that switches the hero between work / study / chaos modes.
 *
 * - Active mode: icon uses "fill" weight + highlighted chip
 * - Uses @phosphor-icons/react for crisp, consistent icons
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
            className={`hs-mode-btn${isActive ? " hs-mode-btn--active" : ""}`}
            onClick={() => onChange(id)}
            aria-label={`${label} mode`}
            aria-pressed={isActive}
            title={label}
          >
            <Icon size={17} weight={isActive ? "fill" : "regular"} />
          </button>
        );
      })}
    </div>
  );
}
