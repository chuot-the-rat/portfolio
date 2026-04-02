import { motion } from "framer-motion";
import HeroContainer from "../components/header/HeroContainer";
import { aboutHeroConfig } from "../data/header/headerConfig";
import "./About.css";

export default function About() {
    return (
        <div className="about">
            <main className="about-main">
                <HeroContainer config={aboutHeroConfig} />

                <motion.section
                    className="about-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="about-grid">
                        <div className="about-col">
                            <h2 className="about-section-title">Background</h2>
                            <p className="about-text">
                                I'm Leana, a UI/UX designer and front-end
                                developer based in Vancouver. With a foundation
                                in digital design and tech, I specialize in
                                creating intuitive, accessible digital products
                                that solve real problems.
                            </p>
                            <p className="about-text">
                                Currently pursuing a Diploma in Digital Design &
                                Development at BCIT, I combine design thinking
                                with technical implementation to deliver
                                cohesive user experiences.
                            </p>
                        </div>

                        <div className="about-col">
                            <h2 className="about-section-title">
                                What Drives Me
                            </h2>
                            <p className="about-text">
                                I'm passionate about the intersection of design
                                and development — where visual aesthetics meet
                                functional code. I believe great products come
                                from understanding user needs and iterating on
                                designs with intention.
                            </p>
                            <p className="about-text">
                                When I'm not designing or coding, you'll find me
                                exploring motion graphics, experimenting with
                                new tools, or working on side projects that
                                combine creativity with technology.
                            </p>
                        </div>
                    </div>
                </motion.section>

                <motion.section
                    className="about-cta"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <h2 className="about-cta-title">Let's work together</h2>
                    <p className="about-cta-text">
                        Interested in collaborating? Feel free to reach out via
                        email or connect with me on LinkedIn.
                    </p>
                    <div className="about-cta-links">
                        <a
                            href="mailto:leanale003@gmail.com"
                            className="about-link"
                        >
                            Send me an email →
                        </a>
                        <a
                            href="https://linkedin.com/in/leanale"
                            className="about-link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Connect on LinkedIn →
                        </a>
                    </div>
                </motion.section>
            </main>
        </div>
    );
}
