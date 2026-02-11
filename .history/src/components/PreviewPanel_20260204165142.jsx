import { motion } from 'framer-motion'
import './PreviewPanel.css'

/**
 * PreviewPanel Component
 * 
 * Editorial hover preview panel that appears in whitespace
 * when a project card is hovered. Displays project images
 * with calm, intentional motion.
 * 
 * Design Philosophy:
 * - Lives outside the card, not inside
 * - Emerges into whitespace, doesn't overlay content
 * - Slower, more deliberate motion than card hover
 * - Staggered image reveals for visual interest
 */

const PreviewPanel = ({ project }) => {
  // Gather preview images from project data
  const previewImages = [
    ...(project.hoverImages || []),
    ...(project.solution?.images?.slice(0, 2) || []),
    ...(project.overview?.images?.slice(0, 1) || [])
  ].filter(Boolean).slice(0, 3) // Max 3 images

  return (
    <motion.div
      className="preview-panel"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      {/* Project Title Context */}
      <motion.div
        className="preview-header"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <h3 className="preview-title">{project.title}</h3>
        <p className="preview-meta">
          {project.category} • {project.year}
        </p>
      </motion.div>

      {/* Staggered Image Reveals */}
      <div className="preview-images">
        {previewImages.length > 0 ? (
          previewImages.map((img, index) => (
            <motion.div
              key={index}
              className="preview-image"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.2 + index * 0.15, // Stagger: 200ms, 350ms, 500ms
                ease: [0.4, 0, 0.2, 1]
              }}
            >
              <img 
                src={img.src || img} 
                alt={img.alt || `${project.title} preview ${index + 1}`}
                loading="lazy"
              />
            </motion.div>
          ))
        ) : (
          // Fallback: Show main thumbnail if no preview images
          <motion.div
            className="preview-image preview-image-large"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              ease: [0.4, 0, 0.2, 1]
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

      {/* Optional: Brief Project Description */}
      {project.tagline && (
        <motion.p
          className="preview-tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          {project.tagline}
        </motion.p>
      )}
    </motion.div>
  )
}

export default PreviewPanel
