import { motion } from "framer-motion";
import "./About.css";

const fadeUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
};

export default function About() {
    return (
        <div className="about">
            <main className="about-main">

                {/* Opening statement */}
                <motion.div
                    className="about-statement-wrap"
                    {...fadeUp}
                >
                    <p className="about-statement">
                        I design things that are easy to use and hard to forget.
                    </p>
                </motion.div>

                {/* Body sections */}
                <motion.div
                    className="about-body"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                >
                    <section className="about-section">
                        <span className="about-index">01 —</span>
                        <div className="about-section-content">
                            <p className="about-text">
                                I'm Leana, a UI/UX designer and front-end developer based in
                                Vancouver. I'm currently completing my Diploma in Digital Design
                                &amp; Development at BCIT, where I spend equal time thinking about
                                how things should work and how they should look.
                            </p>
                            <p className="about-text">
                                My background spans UX research, interface design, and front-end
                                implementation — which means I can take a problem from whiteboard
                                sketch to shipped product without losing the design intent along
                                the way.
                            </p>
                        </div>
                    </section>

                    <section className="about-section">
                        <span className="about-index">02 —</span>
                        <div className="about-section-content">
                            <p className="about-text">
                                I'm drawn to the moment where visual design and code meet — where
                                a well-chosen transition makes an interface feel alive, or a
                                single typographic decision changes how a page reads. I believe
                                the best products are the ones where nobody notices the design,
                                because it just works.
                            </p>
                            <p className="about-text">
                                Outside of work I'm into motion graphics, building side projects,
                                and finding excuses to learn new tools. I'm always open to
                                interesting problems.
                            </p>
                        </div>
                    </section>

                    {/* Contact */}
                    <section className="about-contact">
                        <p className="about-contact-text">
                            Want to work together?{" "}
                            <a
                                href="mailto:leanale003@gmail.com"
                                className="about-contact-link"
                            >
                                Send me an email
                            </a>{" "}
                            or{" "}
                            <a
                                href="https://linkedin.com/in/leanale"
                                className="about-contact-link"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                connect on LinkedIn
                            </a>
                            .
                        </p>
                    </section>
                </motion.div>

            </main>
        </div>
    );
}
