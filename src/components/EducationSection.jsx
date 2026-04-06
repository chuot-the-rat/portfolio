import { motion } from "framer-motion";
import "./EducationSection.css";

const fadeUp = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.45 },
};

const educationData = [
    {
        id: "bcit-ddd",
        institution: "BCIT",
        program: "Digital Design & Development",
        degree: "Diploma",
        period: "2024 – 2026",
        status: "Graduating 2026",
    },
];

export default function EducationSection() {
    return (
        <motion.div className="education-row" {...fadeUp}>
            <span className="education-row-label">Education</span>
            <div className="education-row-content">
                {educationData.map((item) => (
                    <div key={item.id} className="education-entry">
                        <div className="education-entry-main">
                            <span className="education-program">{item.program}</span>
                            <span className="education-degree">{item.degree}</span>
                        </div>
                        <div className="education-entry-meta">
                            <span className="education-institution">{item.institution}</span>
                            <span className="education-period">{item.period}</span>
                            <span className="education-status">{item.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
