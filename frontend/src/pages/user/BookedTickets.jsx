import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiDownload } from 'react-icons/fi';
import Navbar from '../../components/Navbar';
import DashboardSidebar from '../../components/DashboardSidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { bookingAPI } from '../../services/api';
import { downloadTicketPDF, getStatusBadge } from '../../utils/helpers';

const BookedTickets = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingAPI.getMy()
      .then((res) => setBookings(res.data.data.filter((b) => b.status !== 'cancelled')))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        <DashboardSidebar />
        <main className="dashboard-main">
          <h1 className="section-title">My Tickets</h1>
          <p className="section-subtitle">View and download your event tickets</p>

          {loading ? <LoadingSpinner /> : bookings.length > 0 ? (
            <div className="grid-2">
              {bookings.map((b) => (
                <div key={b._id} className="glass-card ticket-card">
                  <div className="ticket-header">
                    <h3>{b.event?.title}</h3>
                    <span className={`badge ${getStatusBadge(b.status)}`}>{b.status}</span>
                  </div>
                  <p className="ticket-id">Ticket: {b.ticketId}</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {b.event?.venue}, {b.event?.city} • Qty: {b.quantity}
                  </p>
                  {b.qrCode && (
                    <img src={b.qrCode} alt="QR" className="ticket-qr" />
                  )}
                  <div className="ticket-actions">
                    <Link to={`/dashboard/tickets/${b._id}`} className="btn btn-secondary btn-sm">View Details</Link>
                    <button className="btn btn-primary btn-sm" onClick={() => downloadTicketPDF(b)}>
                      <FiDownload /> Download PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state glass-card"><p>No tickets found</p></div>
          )}
        </main>
      </div>
      <style>{`
        .ticket-card { padding: 24px; }
        .ticket-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
        .ticket-header h3 { font-size: 1.1rem; }
        .ticket-id { color: var(--accent); font-weight: 600; margin-bottom: 8px; }
        .ticket-qr { width: 120px; margin: 16px auto; border-radius: 8px; }
        .ticket-actions { display: flex; gap: 8px; margin-top: 16px; }
      `}</style>
    </>
  );
};

export default BookedTickets;
