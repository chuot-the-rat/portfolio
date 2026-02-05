import { useMode, MODES } from "../context/ModeContext";
import { motion, AnimatePresence } from "framer-motion";
import "./ModeSwitcher.css";

const ModeSwitcher = () => {
    const { mode, setMode } = useMode();

    const modes = [
        {
            id: MODES.CLEAN,
            label: "Clean",
            description: "Minimal precision",
        },
        { id: MODES.CHAOS, label: "Chaos", description: "Playful asymmetry" },
        { id: MODES.WORK, label: "Work", description: "Bold editorial" },
    ];

    return (
        <motion.div
            className="mode-switcher"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
        >
            <div className="mode-switcher-label">View Mode</div>
            <div className="mode-buttons">
                {modes.map((m) => (
                    <button
                        key={m.id}
                        className={`mode-button ${mode === m.id ? "active" : ""}`}
                        onClick={() => setMode(m.id)}
                        title={m.description}
                    >
                        <span className="mode-button-text">{m.label}</span>
                        {mode === m.id && (
                            <motion.div
                                className="mode-button-indicator"
                                layoutId="mode-indicator"
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30,
                                }}
                            />
                        )}
                    </button>
                ))}
            </div>
        </motion.div>
    );
};

export default ModeSwitcher;
