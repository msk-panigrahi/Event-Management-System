import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiBookOpen } from 'react-icons/fi';
import Navbar from '../../components/Navbar';
import DashboardSidebar from '../../components/DashboardSidebar';
import EventCard from '../../components/EventCard';
import { SkeletonGrid, SkeletonStats } from '../../components/Skeleton';
import LoadingSpinner from '../../components/LoadingSpinner';
import { dashboardAPI, bookingAPI, eventAPI } from '../../services/api';
import { formatCurrency } from '../../utils/helpers';

const UserDashboard = () => {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, bookingsRes, upcomingRes] = await Promise.all([
          dashboardAPI.getUserStats(),
          bookingAPI.getMy(),
          eventAPI.getUpcoming(),
        ]);
        setStats(statsRes.data.data);
        setBookings(bookingsRes.data.data.slice(0, 5));
        setUpcoming(upcomingRes.data.data.slice(0, 3));
      } catch {
        setStats({ totalBookings: 0, upcomingBookings: 0, totalSpent: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        <DashboardSidebar />
        <main className="dashboard-main">
          <h1 className="section-title">My Dashboard</h1>
          <p className="section-subtitle">Welcome back! Here's your event overview.</p>

          {loading ? <SkeletonStats count={3} /> : (
            <div className="grid-3 mb-4">
              <div className="stat-card">
                <div className="stat-card-icon"><FiBookOpen /></div>
                <div className="stat-card-value">{stats?.totalBookings || 0}</div>
                <div className="stat-card-label">Total Bookings</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-icon"><FiCalendar /></div>
                <div className="stat-card-value">{stats?.upcomingBookings || 0}</div>
                <div className="stat-card-label">Active Tickets</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-icon">₹</div>
                <div className="stat-card-value">{formatCurrency(stats?.totalSpent || 0)}</div>
                <div className="stat-card-label">Total Spent</div>
              </div>
            </div>
          )}

          <h2 className="section-title" style={{ fontSize: '1.25rem' }}>Recent Bookings</h2>
          {loading ? <LoadingSpinner size="sm" /> : bookings.length > 0 ? (
            <div className="table-wrapper glass-card mb-4">
              <table className="data-table">
                <thead>
                  <tr><th>Event</th><th>Ticket ID</th><th>Qty</th><th>Amount</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td>{b.event?.title}</td>
                      <td>{b.ticketId}</td>
                      <td>{b.quantity}</td>
                      <td>₹{b.totalAmount}</td>
                      <td><span className={`badge badge-${b.status === 'confirmed' ? 'success' : b.status === 'checked-in' ? 'info' : 'danger'}`}>{b.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state glass-card mb-4"><p>No bookings yet</p></div>
          )}

          <div className="section-header">
            <h2 className="section-title" style={{ fontSize: '1.25rem' }}>Upcoming Events</h2>
            <Link to="/events" className="btn btn-secondary btn-sm">Browse All</Link>
          </div>
          {loading ? <SkeletonGrid count={3} /> : (
            <div className="grid-3">{upcoming.map((e) => <EventCard key={e._id} event={e} />)}</div>
          )}
        </main>
      </div>
    </>
  );
};

export default UserDashboard;
