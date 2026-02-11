import { motion } from "framer-motion";
import "./PreviewPanel.css";

/**
 * PreviewPanel Component - Jackie Hu Inspired
 *
 * Spatial, dimensional preview that pops into whitespace.
 * Content-driven layouts that vary per project type.
 *
 * Design Philosophy:
 * - Images emerge with depth and dimension
 * - Smooth ease-in-out motion, never abrupt
 * - Layout adapts to content (mobile mockups, desktop views, multi-image)
 * - Feels like a living preview, not a static overlay
 */

const PreviewPanel = ({ project }) => {
    // Determine layout type based on explicit metadata or infer from category
    const layoutType = project.previewLayout || 
        (project.category?.toLowerCase().includes('mobile') ? 'mobile' :
         project.category?.toLowerCase().includes('web') ? 'desktop' :
         'mixed');
    
    // Gather preview images from project data
    const previewImages = [
        ...(project.hoverImages || []),
        ...(project.solution?.images?.slice(0, 3) || []),
        ...(project.overview?.images?.slice(0, 1) || []),
    ]
        .filter(Boolean)
        .slice(0, 4); // Max 4 images for varied layouts

    // Spatial pop-out animation variants
    const containerVariants = {
        hidden: { opacity: 0, x: 40, scale: 0.96 },
        visible: { 
            opacity: 1, 
            x: 0, 
            scale: 1,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1], // Smooth ease-in-out
            }
        },
        exit: { 
            opacity: 0, 
            x: 20, 
            scale: 0.98,
            transition: {
                duration: 0.3,
                ease: [0.25, 0.1, 0.25, 1],
            }
        }
    };

    return (
        <motion.div
            className={`preview-panel preview-layout-${layoutType}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            {/* Subtle Project Context */}
            <motion.div
                className="preview-header"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            >
                <h3 className="preview-title">{project.title}</h3>
                <p className="preview-meta">
                    {project.category} • {project.year}
                </p>
            </motion.div>

            {/* Content-Driven Image Layout */}
            <div className="preview-images">
                {previewImages.length > 0 ? (
                    previewImages.map((img, index) => {
                        // Vary animation based on position for spatial depth
                        const variants = {
                            hidden: { 
                                opacity: 0, 
                                y: 30 + (index % 2) * 10,
                                x: (index % 2 === 0) ? -10 : 10,
                                scale: 0.92
                            },
                            visible: { 
                                opacity: 1, 
                                y: 0,
                                x: 0,
                                scale: 1,
                                transition: {
                                    duration: 0.6,
                                    delay: 0.15 + index * 0.12,
                                    ease: [0.25, 0.1, 0.25, 1], // Smooth ease-in-out
                                }
                            }
                        };

                        // Apply different classes based on layout type
                        const imageClass = layoutType === 'mobile'
                            ? 'preview-image preview-image-mobile'
                            : layoutType === 'desktop'
                            ? 'preview-image preview-image-desktop'
                            : index === 0
                            ? 'preview-image preview-image-featured'
                            : 'preview-image';

                        return (
                            <motion.div
                                key={index}
                                className={imageClass}
                                variants={variants}
                                initial="hidden"
                                animate="visible"
                                whileHover={{ 
                                    scale: 1.02,
                                    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
                                }}
                            >
                                <img
                                    src={img.src || img}
                                    alt={
                                        img.alt ||
                                        `${project.title} preview ${index + 1}`
                                    }
                                    loading="lazy"
                                />
                            </motion.div>
                        );
                    })
                ) : (
                    // Fallback: Show main thumbnail
                    <motion.div
                        className="preview-image preview-image-featured"
                        initial={{ opacity: 0, y: 30, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                            duration: 0.6,
                            delay: 0.15,
                            ease: [0.25, 0.1, 0.25, 1],
                        }}
                    >
                        <img
                            src={project.thumbnail}
                            alt={project.title}
                            loading="lazy"
                        />
                    </motion.div>
                )}
            </div>

            {/* Tagline with delayed fade */}
            {project.tagline && (
                <motion.p
                    className="preview-tagline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                >
                    {project.tagline}
                </motion.p>
            )}
        </motion.div>
    );
};

export default PreviewPanel;
