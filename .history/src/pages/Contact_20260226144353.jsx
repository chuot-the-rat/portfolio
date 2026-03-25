import { motion } from "framer-motion";
import { socialLinks } from "../data/socialLinks";
import "./Contact.css";

export default function Contact() {
    return (
        <div className="contact">
            <main className="contact-main">
                <motion.section
                    className="contact-hero"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="contact-title">Get in Touch</h1>
                    <p className="contact-subtitle">
                        Let's talk about your project or just say hello
                    </p>
                </motion.section>

                <motion.section
                    className="contact-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="contact-grid">
                        <div className="contact-info">
                            <h2 className="contact-section-title">
                                Contact Information
                            </h2>

                            <div className="contact-item">
                                <h3 className="contact-label">Email</h3>
                                <a
                                    href="mailto:leanale003@gmail.com"
                                    className="contact-link"
                                >
                                    leanale003@gmail.com
                                </a>
                            </div>

                            <div className="contact-item">
                                <h3 className="contact-label">Location</h3>
                                <p className="contact-value">Vancouver, BC</p>
                            </div>

                            <div className="contact-item">
                                <h3 className="contact-label">Connect</h3>
                                <div className="social-links">
                                    {socialLinks.map(
                                        (link) =>
                                            link.external && (
                                                <a
                                                    key={link.label}
                                                    href={link.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="social-link"
                                                    title={link.label}
                                                >
                                                    {link.label}
                                                </a>
                                            ),
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="contact-form-section">
                            <h2 className="contact-section-title">
                                Send a Message
                            </h2>
                            <form className="contact-form">
                                <div className="form-group">
                                    <label
                                        htmlFor="name"
                                        className="form-label"
                                    >
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label
                                        htmlFor="email"
                                        className="form-label"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label
                                        htmlFor="message"
                                        className="form-label"
                                    >
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows="6"
                                        className="form-input form-textarea"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="form-submit"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </motion.section>
            </main>
        </div>
    );
}
