import { Link, useLocation } from 'react-router-dom';
import navItems from '../data/navItems';
import './Navigation.css';

export default function Navigation() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Leana Le
        </Link>

        <ul className="nav-menu">
          {navItems.map(item => (
            <li key={item.path} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${
                  location.pathname === item.path ? 'active' : ''
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
