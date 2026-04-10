import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { caseStudyMotion } from "../../utils/motion/caseStudyMotion";
import "./BrowserMockup.css";

const isVideoSource = (src = "", type = "") => {
    if (type === "video") return true;
    return /\.(mp4|webm|ogg)$/i.test(src);
};

export default function BrowserMockup({ mediaDemo }) {
    const shouldReduceMotion = useReducedMotion();
    const [hasImageError, setHasImageError] = useState(false);
    const source = mediaDemo?.videoSrc || mediaDemo?.src || "";

    useEffect(() => {
        setHasImageError(false);
    }, [source]);

    if (!mediaDemo) return null;
    if (!source) return null;

    const videoMode = isVideoSource(source, mediaDemo.type);
    const caption = mediaDemo.caption || mediaDemo.alt || "";

    return (
        <motion.figure
            className="cs-browser-mockup"
            initial={caseStudyMotion.mockupReveal.initial}
            whileInView={caseStudyMotion.mockupReveal.whileInView}
            viewport={caseStudyMotion.mockupReveal.viewport}
            transition={caseStudyMotion.mockupReveal.transition}
        >
            {mediaDemo.browserBarImage ? (
                <img
                    src={mediaDemo.browserBarImage}
                    className="cs-browser-chrome-image"
                    alt=""
                    aria-hidden="true"
                />
            ) : (
                <div className="cs-browser-chrome" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <div className="cs-browser-address" />
                </div>
            )}

            <div className="cs-browser-content">
                {videoMode ? (
                    <video
                        autoPlay={!shouldReduceMotion}
                        loop={mediaDemo.loop !== false}
                        muted={mediaDemo.muted !== false}
                        playsInline
                        poster={mediaDemo.poster}
                        controls={shouldReduceMotion}
                        preload={shouldReduceMotion ? "metadata" : "none"}
                        aria-label={mediaDemo.alt || "Project demo video"}
                    >
                        <source src={source} type={mediaDemo.videoType || "video/mp4"} />
                    </video>
                ) : hasImageError ? (
                    <div
                        className="cs-browser-fallback"
                        role="img"
                        aria-label={mediaDemo.alt || "Image unavailable"}
                    >
                        <span>Image unavailable</span>
                    </div>
                ) : (
                    <img
                        src={source}
                        alt={mediaDemo.alt || "Project demo"}
                        loading="lazy"
                        onError={() => setHasImageError(true)}
                    />
                )}
            </div>

            {caption && <figcaption className="image-caption">{caption}</figcaption>}
        </motion.figure>
    );
}
