import "./Marquee.css";

const DEFAULT_ITEMS = [
    "UX Design",
    "Product Design",
    "Interaction Design",
    "Figma",
    "Prototyping",
    "User Research",
    "Visual Design",
    "Design Systems",
];

export default function Marquee({ items = DEFAULT_ITEMS, speed = 40 }) {
    const doubled = [...items, ...items];

    return (
        <div className="marquee" aria-hidden="true">
            <div
                className="marquee-track"
                style={{ "--marquee-speed": `${speed}s` }}
            >
                {doubled.map((item, i) => (
                    <span key={i} className="marquee-item">
                        <span className="marquee-dot" />
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}
