import { useState, useEffect, useRef } from "react";
import "./ContactSection.css";

const socialLinks = [
    {
        id: "email",
        label: "Email",
        value: "leanale003@gmail.com",
        href: "mailto:leanale003@gmail.com",
        icon: "📧",
    },
    {
        id: "linkedin",
        label: "LinkedIn",
        value: "linkedin.com/in/leanale",
        href: "https://linkedin.com/in/leanale",
        icon: "💼",
    },
    {
        id: "github",
        label: "GitHub",
        value: "github.com/chuot-the-rat",
        href: "https://github.com/chuot-the-rat",
        icon: "💻",
    },
];

export default function ContactSection({ variant = "full", showForm = false }) {
    const [isVisible, setIsVisible] = useState(false);
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [formStatus, setFormStatus] = useState(null);
    const sectionRef = useRef(null);
    const prefersReducedMotion = useRef(
        typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormStatus("sending");

        // Simulate form submission - replace with actual endpoint
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setFormStatus("success");
        setFormState({ name: "", email: "", message: "" });

        setTimeout(() => setFormStatus(null), 3000);
    };

    return (
        <section
            ref={sectionRef}
            className={`contact-section ${variant} ${isVisible ? "visible" : ""}`}
            aria-label="Contact"
        >
            <header className="contact-header">
                <span className="contact-eyebrow">Get in Touch</span>
                <h2 className="contact-title">Let's Connect</h2>
                <p className="contact-description">
                    I'm always open to discussing new projects, creative ideas,
                    or opportunities to be part of your vision.
                </p>
            </header>

            <div className="contact-content">
                <div className="contact-links-section">
                    <h3 className="contact-links-title">Reach Out</h3>
                    <ul className="contact-links-list">
                        {socialLinks.map((link, index) => (
                            <li
                                key={link.id}
                                className="contact-link-item"
                                style={{
                                    "--link-delay": prefersReducedMotion.current
                                        ? "0ms"
                                        : `${index * 100}ms`,
                                }}
                            >
                                <a
                                    href={link.href}
                                    className="contact-link"
                                    target={
                                        link.id !== "email"
                                            ? "_blank"
                                            : undefined
                                    }
                                    rel={
                                        link.id !== "email"
                                            ? "noopener noreferrer"
                                            : undefined
                                    }
                                >
                                    <span
                                        className="contact-link-icon"
                                        aria-hidden="true"
                                    >
                                        {link.icon}
                                    </span>
                                    <span className="contact-link-content">
                                        <span className="contact-link-label">
                                            {link.label}
                                        </span>
                                        <span className="contact-link-value">
                                            {link.value}
                                        </span>
                                    </span>
                                    <span
                                        className="contact-link-arrow"
                                        aria-hidden="true"
                                    >
                                        →
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div className="contact-cta-group">
                        <a
                            href="mailto:leanale003@gmail.com"
                            className="contact-cta primary"
                        >
                            <span className="cta-icon">✉️</span>
                            Send an Email
                        </a>
                        <a
                            href="/Le_Leana_Resume_NoNumber.pdf"
                            download="Leana_Le_Resume.pdf"
                            className="contact-cta secondary"
                        >
                            <span className="cta-icon">📄</span>
                            Download Resume
                        </a>
                    </div>
                </div>

                {showForm && (
                    <div className="contact-form-section">
                        <h3 className="contact-form-title">Send a Message</h3>
                        <form
                            className="contact-form"
                            onSubmit={handleSubmit}
                        >
                            <div className="form-group">
                                <label
                                    htmlFor="contact-name"
                                    className="form-label"
                                >
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="contact-name"
                                    name="name"
                                    className="form-input"
                                    value={formState.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Your name"
                                />
                            </div>

                            <div className="form-group">
                                <label
                                    htmlFor="contact-email"
                                    className="form-label"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="contact-email"
                                    name="email"
                                    className="form-input"
                                    value={formState.email}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div className="form-group">
                                <label
                                    htmlFor="contact-message"
                                    className="form-label"
                                >
                                    Message
                                </label>
                                <textarea
                                    id="contact-message"
                                    name="message"
                                    className="form-input form-textarea"
                                    value={formState.message}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Tell me about your project..."
                                    rows={5}
                                />
                            </div>

                            <button
                                type="submit"
                                className={`form-submit ${formStatus === "sending" ? "sending" : ""}`}
                                disabled={formStatus === "sending"}
                            >
                                {formStatus === "sending"
                                    ? "Sending..."
                                    : "Send Message"}
                            </button>

                            {formStatus === "success" && (
                                <p className="form-success">
                                    Thanks for reaching out! I'll get back to
                                    you soon.
                                </p>
                            )}
                        </form>
                    </div>
                )}
            </div>

            <footer className="contact-footer">
                <p className="contact-footer-text">
                    Based in Vancouver, BC • Open to remote opportunities
                    worldwide
                </p>
            </footer>
        </section>
    );
}
