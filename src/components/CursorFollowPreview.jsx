import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import "./CursorFollowPreview.css";

/**
 * CursorFollowPreview - Cursor-attached floating preview (desktop only)
 *
 * Shows a layered, editorial preview stack that follows the cursor smoothly
 * with spring-based animation. Handles viewport edges, maintains depth with
 * subtle rotations and offsets. Desktop-only (1024px+).
 */

const CursorFollowPreview = ({ project, cursorX, cursorY, isDesktop }) => {
    const [previewPos, setPreviewPos] = useState({ x: 0, y: 0 });
    const [shouldFlipX, setShouldFlipX] = useState(false);
    const [shouldFlipY, setShouldFlipY] = useState(false);

    // Extract preview images (up to 3 for layering)
    const previewImages = useMemo(() => {
        if (!project) return [];

        let images = [];

        // Try media.images (case studies)
        if (project.media?.images) {
            images = project.media.images.slice(0, 3);
        }
        // Try overview.images (standalone projects)
        else if (project.overview?.images) {
            images = project.overview.images.slice(0, 3);
        }
        // Try sections (fallback)
        else if (project.sections) {
            Object.values(project.sections).forEach((section) => {
                if (section.images && Array.isArray(section.images)) {
                    images.push(...section.images);
                    if (images.length >= 3) return;
                }
            });
            images = images.slice(0, 3);
        }

        return images.filter(Boolean);
    }, [project]);

    // Calculate preview position with viewport edge detection
    useEffect(() => {
        if (!isDesktop || !cursorX || !cursorY) return;

        // Preview dimensions
        const mainWidth = 260;
        const mainHeight = 300; // approximate
        const offsetX = 40;
        const offsetY = -20;
        const margin = 16; // safety margin from viewport edge

        // Calculate base position (offset from cursor)
        let x = cursorX + offsetX;
        let y = cursorY + offsetY;

        // Detect if preview would overflow viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let flipX = false;
        let flipY = false;

        // Check right edge overflow
        if (x + mainWidth + margin > viewportWidth) {
            x = cursorX - mainWidth - offsetX;
            flipX = true;
        }

        // Check bottom edge overflow
        if (y + mainHeight + margin > viewportHeight) {
            y = cursorY + 20; // flip up, sits above cursor
            flipY = true;
        }

        // Ensure stays in viewport (hard boundaries)
        x = Math.max(margin, Math.min(x, viewportWidth - mainWidth - margin));
        y = Math.max(margin, Math.min(y, viewportHeight - mainHeight - margin));

        setPreviewPos({ x, y });
        setShouldFlipX(flipX);
        setShouldFlipY(flipY);
    }, [cursorX, cursorY, isDesktop]);

    // Spring animation for smooth following
    const springConfig = {
        tension: 170,
        friction: 26,
        mass: 1,
    };

    if (!isDesktop || !project || previewImages.length === 0) {
        return null;
    }

    return (
        <motion.div
            className="cursor-follow-preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
        >
            {/* Main preview container with spring animation */}
            <motion.div
                className="cursor-follow-preview-container"
                animate={{
                    x: previewPos.x,
                    y: previewPos.y,
                }}
                transition={springConfig}
            >
                {/* Layer stack - main + supporting images */}
                <div className="cursor-follow-layers">
                    {/* Main image layer (front) */}
                    {previewImages[0] && (
                        <motion.div
                            className="cursor-follow-layer cursor-follow-layer--main"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{
                                duration: 0.3,
                                delay: 0,
                                ease: [0.2, 0.8, 0.2, 1],
                            }}
                        >
                            <div className="cursor-follow-image-wrap">
                                <img
                                    src={
                                        previewImages[0].src || previewImages[0]
                                    }
                                    alt={
                                        previewImages[0].alt ||
                                        `${project.title} preview 1`
                                    }
                                    loading="lazy"
                                    className="cursor-follow-image"
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* Supporting layer 1 (back, subtle offset + rotation) */}
                    {previewImages[1] && (
                        <motion.div
                            className="cursor-follow-layer cursor-follow-layer--support1"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 0.75 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{
                                duration: 0.3,
                                delay: 0.05,
                                ease: [0.2, 0.8, 0.2, 1],
                            }}
                        >
                            <div className="cursor-follow-image-wrap">
                                <img
                                    src={
                                        previewImages[1].src || previewImages[1]
                                    }
                                    alt={
                                        previewImages[1].alt ||
                                        `${project.title} preview 2`
                                    }
                                    loading="lazy"
                                    className="cursor-follow-image"
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* Supporting layer 2 (back, more offset + rotation) */}
                    {previewImages[2] && (
                        <motion.div
                            className="cursor-follow-layer cursor-follow-layer--support2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 0.6 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{
                                duration: 0.3,
                                delay: 0.1,
                                ease: [0.2, 0.8, 0.2, 1],
                            }}
                        >
                            <div className="cursor-follow-image-wrap">
                                <img
                                    src={
                                        previewImages[2].src || previewImages[2]
                                    }
                                    alt={
                                        previewImages[2].alt ||
                                        `${project.title} preview 3`
                                    }
                                    loading="lazy"
                                    className="cursor-follow-image"
                                />
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default CursorFollowPreview;
