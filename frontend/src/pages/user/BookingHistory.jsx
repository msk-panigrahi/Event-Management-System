import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import DashboardSidebar from '../../components/DashboardSidebar';
import ConfirmDialog from '../../components/ConfirmDialog';
import LoadingSpinner from '../../components/LoadingSpinner';
import { bookingAPI } from '../../services/api';
import { formatDate, getStatusBadge } from '../../utils/helpers';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState(null);

  const fetchBookings = () => {
    bookingAPI.getMy()
      .then((res) => setBookings(res.data.data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async () => {
    try {
      await bookingAPI.cancel(cancelId);
      toast.success('Booking cancelled');
      setCancelId(null);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancel failed');
    }
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        <DashboardSidebar />
        <main className="dashboard-main">
          <h1 className="section-title">Booking History</h1>
          <p className="section-subtitle">All your past and current bookings</p>

          {loading ? <LoadingSpinner /> : (
            <div className="table-wrapper glass-card">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Event</th><th>Date</th><th>Ticket ID</th><th>Qty</th>
                    <th>Amount</th><th>Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td>{b.event?.title}</td>
                      <td>{formatDate(b.event?.date)}</td>
                      <td>{b.ticketId}</td>
                      <td>{b.quantity}</td>
                      <td>₹{b.totalAmount}</td>
                      <td><span className={`badge ${getStatusBadge(b.status)}`}>{b.status}</span></td>
                      <td>
                        {b.status === 'confirmed' && (
                          <button className="btn btn-danger btn-sm" onClick={() => setCancelId(b._id)}>Cancel</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {bookings.length === 0 && <div className="empty-state"><p>No bookings yet</p></div>}
            </div>
          )}
        </main>
      </div>

      <ConfirmDialog
        isOpen={!!cancelId}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Yes, Cancel"
        onConfirm={handleCancel}
        onCancel={() => setCancelId(null)}
        danger
      />
    </>
  );
};

export default BookingHistory;
