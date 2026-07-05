import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiUser } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { eventAPI, getImageUrl } from '../services/api';
import { formatDate } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    eventAPI.getById(id)
      .then((res) => setEvent(res.data.data))
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = () => {
    if (!user) {
      navigate('/login', { state: { from: `/events/${id}/book` } });
      return;
    }
    navigate(`/events/${id}/book`);
  };

  if (loading) return <><Navbar /><LoadingSpinner /></>;
  if (!event) return (
    <>
      <Navbar />
      <div className="page-wrapper container empty-state">
        <p>Event not found</p>
        <Link to="/events" className="btn btn-primary mt-2">Back to Events</Link>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="container">
          <div className="event-detail">
            <div className="event-banner">
              <img src={getImageUrl(event.bannerImage)} alt={event.title} />
              <span className="event-category-badge">{event.category}</span>
            </div>
            <div className="event-detail-grid">
              <div className="event-detail-main glass-card">
                <h1>{event.title}</h1>
                <p className="event-desc">{event.description}</p>
                <div className="event-meta-grid">
                  <div><FiCalendar /><span>{formatDate(event.date)}</span></div>
                  <div><FiClock /><span>{event.time}</span></div>
                  <div><FiMapPin /><span>{event.venue}, {event.city}</span></div>
                  <div><FiUsers /><span>{event.availableSeats} of {event.maxSeats} seats available</span></div>
                  <div><FiUser /><span>Organized by {event.organizer}</span></div>
                </div>
              </div>
              <div className="event-booking-card glass-card">
                <div className="booking-price">₹{event.ticketPrice}</div>
                <p className="booking-per">per ticket</p>
                <div className="booking-seats">
                  <span className={`badge ${event.availableSeats > 0 ? 'badge-success' : 'badge-danger'}`}>
                    {event.availableSeats > 0 ? `${event.availableSeats} seats left` : 'Sold Out'}
                  </span>
                </div>
                <button
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                  onClick={handleBook}
                  disabled={event.availableSeats <= 0}
                >
                  {event.availableSeats > 0 ? 'Book Now' : 'Sold Out'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <style>{`
        .event-banner { position: relative; height: 400px; border-radius: var(--radius-xl); overflow: hidden; margin-bottom: 32px; }
        .event-banner img { width: 100%; height: 100%; object-fit: cover; }
        .event-category-badge {
          position: absolute; top: 20px; left: 20px;
          background: var(--gradient); color: white;
          padding: 8px 16px; border-radius: 20px; font-weight: 600;
        }
        .event-detail-grid { display: grid; grid-template-columns: 1fr 340px; gap: 24px; }
        .event-detail-main { padding: 32px; }
        .event-detail-main h1 { font-family: var(--font-display); font-size: 2rem; margin-bottom: 16px; }
        .event-desc { color: var(--text-secondary); line-height: 1.8; margin-bottom: 24px; }
        .event-meta-grid { display: flex; flex-direction: column; gap: 12px; }
        .event-meta-grid div { display: flex; align-items: center; gap: 12px; color: var(--text-secondary); }
        .event-meta-grid svg { color: var(--accent); font-size: 1.2rem; }
        .event-booking-card { padding: 32px; text-align: center; height: fit-content; position: sticky; top: 100px; }
        .booking-price { font-family: var(--font-display); font-size: 2.5rem; font-weight: 700; color: var(--accent); }
        .booking-per { color: var(--text-muted); margin-bottom: 16px; }
        .booking-seats { margin-bottom: 24px; }
        @media (max-width: 768px) {
          .event-detail-grid { grid-template-columns: 1fr; }
          .event-banner { height: 250px; }
        }
      `}</style>
    </>
  );
};

export default EventDetail;
