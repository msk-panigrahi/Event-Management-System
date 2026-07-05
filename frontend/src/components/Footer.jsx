import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="brand-icon">E</span>
              EventHub
            </Link>
            <p className="footer-desc">
              Your premier platform for discovering, booking, and managing unforgettable events.
            </p>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Account</h4>
            <ul>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Contact</h4>
            <ul>
              <li><FiMail /> mithunsaicse2024@gmail.com</li>
              <li><FiPhone /> +91 93920 38629</li>
              <li><FiMapPin /> Visakhapatnam, India</li>
            </ul>
            <div className="footer-social">
              <a href="https://github.com/mithunsaikumarpanigrahi24cse-commits" aria-label="GitHub"><FiGithub /></a>
              <a href="https://www.linkedin.com/in/mithunsaicse2024" aria-label="LinkedIn"><FiLinkedin /></a>
              <a href="#" aria-label="Twitter"><FiTwitter /></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} EventHub. All rights reserved.</p>
        </div>
      </div>

      <style>{`
        .footer {
          background: rgba(0, 0, 0, 0.3);
          border-top: 1px solid var(--border-glass);
          padding: 60px 0 24px;
          margin-top: 80px;
        }
        .footer-grid {
          display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 40px; margin-bottom: 40px;
        }
        .footer-logo {
          display: flex; align-items: center; gap: 10px;
          font-family: var(--font-display); font-size: 1.3rem;
          font-weight: 700; margin-bottom: 16px;
        }
        .footer-desc { color: var(--text-secondary); line-height: 1.7; }
        .footer-links h4,
        .footer-contact h4 {
          font-weight: 600; margin-bottom: 16px;
          color: var(--text-primary);
        }
        .footer-links ul li { margin-bottom: 10px; }
        .footer-links a {
          color: var(--text-secondary); transition: var(--transition);
        }
        .footer-links a:hover { color: var(--accent); }
        .footer-contact ul li {
          display: flex; align-items: center; gap: 10px;
          color: var(--text-secondary); margin-bottom: 10px;
        }
        .footer-social {
          display: flex; gap: 12px; margin-top: 16px;
        }
        .footer-social a {
          width: 40px; height: 40px; border-radius: 50%;
          background: var(--bg-glass); border: 1px solid var(--border-glass);
          display: flex; align-items: center; justify-content: center;
          color: var(--text-secondary); transition: var(--transition);
        }
        .footer-social a:hover {
          background: var(--gradient); color: white; border-color: transparent;
        }
        .footer-bottom {
          text-align: center; padding-top: 24px;
          border-top: 1px solid var(--border-glass);
          color: var(--text-muted); font-size: 0.9rem;
        }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr; gap: 32px; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
