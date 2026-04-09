import "./DecorativeDivider.css";

export default function DecorativeDivider({ svgSrc, alt = "" }) {
    return (
        <div className="cs-divider" aria-hidden={alt ? undefined : "true"}>
            {svgSrc ? (
                <img src={svgSrc} alt={alt} className="cs-divider-art" />
            ) : (
                <>
                    <span className="cs-divider-line" />
                    <span className="cs-divider-dot" />
                    <span className="cs-divider-line" />
                </>
            )}
        </div>
    );
}
