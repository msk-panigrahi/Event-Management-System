import { NavLink } from 'react-router-dom';
import {
  FiGrid, FiCalendar, FiUsers, FiBookOpen, FiBarChart2, FiCamera, FiPlusCircle,
} from 'react-icons/fi';

const adminLinks = [
  { to: '/admin/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/admin/events', icon: FiCalendar, label: 'Manage Events' },
  { to: '/admin/events/create', icon: FiPlusCircle, label: 'Create Event' },
  { to: '/admin/users', icon: FiUsers, label: 'Manage Users' },
  { to: '/admin/bookings', icon: FiBookOpen, label: 'Manage Bookings' },
  { to: '/admin/analytics', icon: FiBarChart2, label: 'Analytics' },
  { to: '/admin/scan', icon: FiCamera, label: 'QR Scanner' },
];

const userLinks = [
  { to: '/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/dashboard/tickets', icon: FiBookOpen, label: 'My Tickets' },
  { to: '/dashboard/history', icon: FiCalendar, label: 'Booking History' },
  { to: '/dashboard/profile', icon: FiUsers, label: 'Profile' },
];

const DashboardSidebar = ({ isAdmin = false }) => {
  const links = isAdmin ? adminLinks : userLinks;

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-header">
        <h3>{isAdmin ? 'Admin Panel' : 'My Account'}</h3>
      </div>
      <nav>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            end={link.to === '/dashboard' || link.to === '/admin/dashboard'}
          >
            <link.icon />
            {link.label}
          </NavLink>
        ))}
      </nav>
      <style>{`
        .sidebar-header {
          padding: 0 16px 20px;
          border-bottom: 1px solid var(--border-glass);
          margin-bottom: 16px;
        }
        .sidebar-header h3 {
          font-family: var(--font-display);
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-muted);
        }
      `}</style>
    </aside>
  );
};

export default DashboardSidebar;
