/**
 * ReadingProgress.jsx
 * A thin 2px line fixed at the very top of the viewport that fills
 * left-to-right as the user scrolls down the page.
 * Only rendered on project detail / long-form pages.
 */

import { useState, useEffect } from "react";
import "./ReadingProgress.css";

export default function ReadingProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight =
                document.documentElement.scrollHeight - window.innerHeight;
            setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll(); // set initial value
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div
            className="reading-progress"
            role="progressbar"
            aria-valuenow={Math.round(progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Reading progress"
        >
            <div
                className="reading-progress-bar"
                style={{ transform: `scaleX(${progress})` }}
            />
        </div>
    );
}
