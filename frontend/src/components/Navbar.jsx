import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/events', label: 'Events' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-icon">E</span>
          EventHub
        </Link>

        <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          <ul className="navbar-links">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="navbar-actions">
            {user ? (
              <>
                <Link
                  to={isAdmin ? '/admin/dashboard' : '/dashboard'}
                  className="btn btn-secondary btn-sm"
                  onClick={() => setMenuOpen(false)}
                >
                  <FiUser /> Dashboard
                </Link>
                <button className="btn btn-primary btn-sm" onClick={handleLogout}>
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary btn-sm" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          height: 80px; background: rgba(15, 15, 35, 0.85);
          backdrop-filter: blur(20px); border-bottom: 1px solid var(--border-glass);
        }
        .navbar-inner {
          display: flex; align-items: center; justify-content: space-between;
          height: 80px;
        }
        .navbar-brand {
          display: flex; align-items: center; gap: 10px;
          font-family: var(--font-display); font-size: 1.4rem; font-weight: 700;
        }
        .brand-icon {
          width: 36px; height: 36px; background: var(--gradient);
          border-radius: 10px; display: flex; align-items: center;
          justify-content: center; font-weight: 800; font-size: 1.1rem;
        }
        .navbar-toggle {
          display: none; background: none; color: white;
          font-size: 1.5rem; padding: 8px;
        }
        .navbar-menu {
          display: flex; align-items: center; gap: 32px;
        }
        .navbar-links {
          display: flex; gap: 8px;
        }
        .navbar-links a {
          padding: 8px 16px; border-radius: var(--radius-md);
          color: var(--text-secondary); font-weight: 500;
          transition: var(--transition);
        }
        .navbar-links a:hover,
        .navbar-links a.active {
          color: var(--text-primary); background: var(--bg-glass);
        }
        .navbar-actions { display: flex; gap: 10px; }
        @media (max-width: 768px) {
          .navbar-toggle { display: block; }
          .navbar-menu {
            position: fixed; top: 80px; left: 0; right: 0;
            background: rgba(15, 15, 35, 0.98);
            backdrop-filter: blur(20px); flex-direction: column;
            padding: 24px; gap: 24px; border-bottom: 1px solid var(--border-glass);
            transform: translateY(-100%); opacity: 0; pointer-events: none;
            transition: var(--transition);
          }
          .navbar-menu.open {
            transform: translateY(0); opacity: 1; pointer-events: all;
          }
          .navbar-links { flex-direction: column; width: 100%; }
          .navbar-links a { display: block; padding: 12px 16px; }
          .navbar-actions { flex-direction: column; width: 100%; }
          .navbar-actions .btn { width: 100%; justify-content: center; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
