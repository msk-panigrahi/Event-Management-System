import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiDownload, FiArrowLeft } from 'react-icons/fi';
import Navbar from '../../components/Navbar';
import DashboardSidebar from '../../components/DashboardSidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { bookingAPI } from '../../services/api';
import { downloadTicketPDF, formatDate, getStatusBadge } from '../../utils/helpers';

const TicketDetail = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingAPI.getById(id)
      .then((res) => setBooking(res.data.data))
      .catch(() => setBooking(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <><Navbar /><LoadingSpinner /></>;

  return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        <DashboardSidebar />
        <main className="dashboard-main">
          <Link to="/dashboard/tickets" className="btn btn-secondary btn-sm mb-3">
            <FiArrowLeft /> Back to Tickets
          </Link>

          {booking ? (
            <div className="glass-card ticket-detail" style={{ maxWidth: 500, margin: '0 auto', padding: 32, textAlign: 'center' }}>
              <span className={`badge ${getStatusBadge(booking.status)}`}>{booking.status}</span>
              <h1 style={{ fontSize: '1.5rem', margin: '16px 0' }}>{booking.event?.title}</h1>
              <p style={{ color: 'var(--text-secondary)' }}>{booking.ticketId}</p>
              {booking.qrCode && <img src={booking.qrCode} alt="QR" style={{ width: 200, margin: '24px auto', borderRadius: 12 }} />}
              <div style={{ textAlign: 'left', marginTop: 24 }}>
                <p><strong>Date:</strong> {formatDate(booking.event?.date)}</p>
                <p><strong>Time:</strong> {booking.event?.time}</p>
                <p><strong>Venue:</strong> {booking.event?.venue}, {booking.event?.city}</p>
                <p><strong>Quantity:</strong> {booking.quantity}</p>
                <p><strong>Amount:</strong> ₹{booking.totalAmount}</p>
              </div>
              <button className="btn btn-primary mt-3" onClick={() => downloadTicketPDF(booking)}>
                <FiDownload /> Download PDF
              </button>
            </div>
          ) : (
            <div className="empty-state"><p>Ticket not found</p></div>
          )}
        </main>
      </div>
    </>
  );
};

export default TicketDetail;
