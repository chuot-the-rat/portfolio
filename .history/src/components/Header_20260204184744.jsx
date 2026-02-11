import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
    return (
        <motion.header
            className="header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
            <div className="container">
                <div className="header-content">
                    <Link
                        to="/"
                        className="header-logo"
                    >
                        <span className="header-logo-initial">L</span>
                        <span className="header-logo-name">Leana Le</span>
                    </Link>
                </div>
            </div>
        </motion.header>
    );
};

export default Header;
