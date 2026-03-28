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
                                I'm Leana — a UI/UX designer and front-end developer based in
                                Vancouver, completing my Diploma in Digital Design &amp; Development
                                at BCIT. I spend equal time thinking about how things should work
                                and how they should look, which usually means the answer is both.
                            </p>
                            <p className="about-text">
                                My background spans UX research, interface design, and front-end
                                implementation. I can take a problem from a whiteboard sketch to a
                                shipped product without losing the design intent along the way —
                                because I've been in the room for every step.
                            </p>
                        </div>
                    </section>

                    <section className="about-section">
                        <span className="about-index">02 —</span>
                        <div className="about-section-content">
                            <p className="about-text">
                                I'm drawn to the seam where visual design and code meet. A
                                well-timed transition that makes an interface feel alive. A
                                typographic decision that changes how a whole page reads. The
                                best products are the ones where the design disappears — where
                                users just move through it without friction.
                            </p>
                            <p className="about-text">
                                I think the most interesting design problems are the ones that
                                look simple on the surface. Getting a user to act, feel less
                                anxious, or find something they didn't know they needed — those
                                are harder than they appear and more satisfying to solve.
                            </p>
                        </div>
                    </section>

                    <section className="about-section">
                        <span className="about-index">03 —</span>
                        <div className="about-section-content">
                            <p className="about-text">
                                Outside of school projects, I make motion graphics, build things
                                to see if they're possible, and look for design patterns in
                                places that aren't software. I'm currently looking for
                                opportunities where design and development overlap — roles where
                                I can contribute to both sides of the conversation.
                            </p>
                        </div>
                    </section>

                    {/* Contact */}
                    <section className="about-contact">
                        <p className="about-contact-text">
                            If that sounds useful to you,{" "}
                            <a
                                href="mailto:leanale003@gmail.com"
                                className="about-contact-link"
                            >
                                send me an email
                            </a>{" "}
                            or{" "}
                            <a
                                href="https://linkedin.com/in/leanale"
                                className="about-contact-link"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                find me on LinkedIn
                            </a>
                            .
                        </p>
                    </section>
                </motion.div>

            </main>
        </div>
    );
}
