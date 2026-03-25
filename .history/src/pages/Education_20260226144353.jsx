import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import "./Education.css";

const educationData = [
    {
        id: "bcit-ddd",
        institution: "British Columbia Institute of Technology",
        program: "Digital Design & Development",
        degree: "Diploma",
        period: "2024 – 2026",
        status: "In Progress",
        description:
            "Comprehensive program covering UI/UX design, front-end development, and digital product creation. Focus on user-centered design methodology and modern web technologies.",
        highlights: [
            "User Experience Design",
            "Front-End Development",
            "Design Systems",
            "Responsive Web Design",
        ],
    },
];

export default function Education() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 },
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div className="education-page">
            <main className="education-main">
                <motion.section
                    className="education-hero"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="education-title">Education</h1>
                    <p className="education-subtitle">
                        Building a foundation in design thinking and technical
                        implementation
                    </p>
                </motion.section>

                <section
                    ref={sectionRef}
                    className={`education-content ${isVisible ? "visible" : ""}`}
                >
                    <div className="education-timeline">
                        {educationData.map((item, index) => (
                            <motion.article
                                key={item.id}
                                className="education-entry"
                                initial={{ opacity: 0, y: 20 }}
                                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.2,
                                    ease: [0.4, 0, 0.2, 1],
                                }}
                            >
                                <div className="education-timeline-marker">
                                    <span
                                        className="timeline-dot"
                                        aria-hidden="true"
                                    />
                                    {index < educationData.length - 1 && (
                                        <span
                                            className="timeline-line"
                                            aria-hidden="true"
                                        />
                                    )}
                                </div>

                                <div className="education-content-block">
                                    <header className="education-entry-header">
                                        <div className="education-meta">
                                            <span className="education-period">
                                                {item.period}
                                            </span>
                                            <span
                                                className={`education-status ${item.status
                                                    .toLowerCase()
                                                    .replace(" ", "-")}`}
                                            >
                                                {item.status}
                                            </span>
                                        </div>

                                        <h3 className="education-entry-title">
                                            {item.program}
                                        </h3>
                                        <p className="education-institution">
                                            {item.institution}
                                        </p>
                                    </header>

                                    {item.description && (
                                        <p className="education-description">
                                            {item.description}
                                        </p>
                                    )}

                                    {item.highlights &&
                                        item.highlights.length > 0 && (
                                            <div className="education-highlights">
                                                <h4 className="education-highlights-title">
                                                    Key Focus Areas
                                                </h4>
                                                <ul className="highlights-list">
                                                    {item.highlights.map(
                                                        (highlight) => (
                                                            <li key={highlight}>
                                                                {highlight}
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            </div>
                                        )}
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
