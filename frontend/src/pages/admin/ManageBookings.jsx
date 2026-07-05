import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import DashboardSidebar from '../../components/DashboardSidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { bookingAPI } from '../../services/api';
import { formatDate, getStatusBadge } from '../../utils/helpers';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingAPI.getAll()
      .then((res) => setBookings(res.data.data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        <DashboardSidebar isAdmin />
        <main className="dashboard-main">
          <h1 className="section-title">Manage Bookings</h1>
          <p className="section-subtitle">View all event bookings and check-in status</p>

          {loading ? <LoadingSpinner /> : (
            <div className="table-wrapper glass-card">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ticket ID</th><th>User</th><th>Event</th><th>Qty</th>
                    <th>Amount</th><th>Status</th><th>Booked On</th><th>Checked In</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td>{b.ticketId}</td>
                      <td>{b.user?.name}<br /><small style={{ color: 'var(--text-muted)' }}>{b.user?.email}</small></td>
                      <td>{b.event?.title}</td>
                      <td>{b.quantity}</td>
                      <td>₹{b.totalAmount}</td>
                      <td><span className={`badge ${getStatusBadge(b.status)}`}>{b.status}</span></td>
                      <td>{formatDate(b.createdAt)}</td>
                      <td>{b.checkedInAt ? formatDate(b.checkedInAt) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {bookings.length === 0 && <div className="empty-state"><p>No bookings yet</p></div>}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default ManageBookings;
