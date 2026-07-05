import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiUsers, FiBookOpen, FiDollarSign } from 'react-icons/fi';
import Navbar from '../../components/Navbar';
import DashboardSidebar from '../../components/DashboardSidebar';
import { SkeletonStats } from '../../components/Skeleton';
import LoadingSpinner from '../../components/LoadingSpinner';
import { dashboardAPI, bookingAPI } from '../../services/api';
import { formatCurrency, formatDate, getStatusBadge } from '../../utils/helpers';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          dashboardAPI.getAdminStats(),
          bookingAPI.getRecent(),
        ]);
        setStats(statsRes.data.data);
        setRecentBookings(bookingsRes.data.data);
      } catch {
        setStats({});
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { icon: FiCalendar, label: 'Total Events', value: stats?.totalEvents || 0 },
    { icon: FiUsers, label: 'Total Users', value: stats?.totalUsers || 0 },
    { icon: FiBookOpen, label: 'Total Bookings', value: stats?.totalBookings || 0 },
    { icon: FiDollarSign, label: 'Total Revenue', value: formatCurrency(stats?.totalRevenue || 0) },
  ];

  return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        <DashboardSidebar isAdmin />
        <main className="dashboard-main">
          <div className="section-header">
            <div>
              <h1 className="section-title">Admin Dashboard</h1>
              <p className="section-subtitle">Overview of your event management platform</p>
            </div>
            <Link to="/admin/analytics" className="btn btn-primary">View Analytics</Link>
          </div>

          {loading ? <SkeletonStats count={4} /> : (
            <div className="grid-4 mb-4">
              {statCards.map((card) => (
                <div key={card.label} className="stat-card">
                  <div className="stat-card-icon"><card.icon /></div>
                  <div className="stat-card-value">{card.value}</div>
                  <div className="stat-card-label">{card.label}</div>
                </div>
              ))}
            </div>
          )}

          <h2 className="section-title" style={{ fontSize: '1.25rem' }}>Recent Bookings</h2>
          {loading ? <LoadingSpinner size="sm" /> : (
            <div className="table-wrapper glass-card">
              <table className="data-table">
                <thead>
                  <tr><th>User</th><th>Event</th><th>Ticket ID</th><th>Amount</th><th>Status</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {recentBookings.map((b) => (
                    <tr key={b._id}>
                      <td>{b.user?.name}</td>
                      <td>{b.event?.title}</td>
                      <td>{b.ticketId}</td>
                      <td>₹{b.totalAmount}</td>
                      <td><span className={`badge ${getStatusBadge(b.status)}`}>{b.status}</span></td>
                      <td>{formatDate(b.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {recentBookings.length === 0 && <div className="empty-state"><p>No bookings yet</p></div>}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
