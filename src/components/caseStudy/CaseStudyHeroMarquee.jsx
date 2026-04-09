import "./CaseStudyHeroMarquee.css";

const TIMES = 3;

export default function CaseStudyHeroMarquee({ projectTitle, marqueeText }) {
    const base = marqueeText || `${projectTitle} • CASE STUDY`;
    const repeated = Array.from({ length: TIMES }, () => base);

    return (
        <div className="cs-hero-marquee" aria-hidden="true">
            <div className="cs-hero-marquee-track">
                {repeated.map((item, index) => (
                    <span className="cs-hero-marquee-item" key={`${item}-${index}`}>
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}
