import { Link } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiClock, FiUsers } from 'react-icons/fi';
import { getImageUrl } from '../services/api';

const EventCard = ({ event, showActions = false, onEdit, onDelete, onTogglePublish }) => {
  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  return (
    <div className="glass-card event-card">
      <div className="event-card-image">
        <img src={getImageUrl(event.bannerImage)} alt={event.title} loading="lazy" />
        <span className="event-category-badge">{event.category}</span>
        {!event.isPublished && showActions && (
          <span className="event-draft-badge">Draft</span>
        )}
      </div>
      <div className="event-card-body">
        <h3 className="event-card-title">{event.title}</h3>
        <div className="event-card-meta">
          <span><FiCalendar /> {formatDate(event.date)}</span>
          <span><FiClock /> {event.time}</span>
          <span><FiMapPin /> {event.city}</span>
          <span><FiUsers /> {event.availableSeats} seats left</span>
        </div>
        <div className="event-card-footer">
          <span className="event-price">₹{event.ticketPrice}</span>
          {showActions ? (
            <div className="event-actions">
              <button className="btn btn-sm btn-secondary" onClick={() => onTogglePublish?.(event)}>
                {event.isPublished ? 'Unpublish' : 'Publish'}
              </button>
              <Link to={`/admin/events/edit/${event._id}`} className="btn btn-sm btn-primary">
                Edit
              </Link>
              <button className="btn btn-sm btn-danger" onClick={() => onDelete?.(event)}>
                Delete
              </button>
            </div>
          ) : (
            <Link to={`/events/${event._id}`} className="btn btn-sm btn-primary">
              View Details
            </Link>
          )}
        </div>
      </div>
      <style>{`
        .event-card { overflow: hidden; }
        .event-card-image { position: relative; height: 180px; overflow: hidden; }
        .event-card-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .event-card:hover .event-card-image img { transform: scale(1.05); }
        .event-category-badge {
          position: absolute; top: 12px; left: 12px;
          background: var(--gradient); color: white;
          padding: 4px 12px; border-radius: 20px;
          font-size: 0.75rem; font-weight: 600;
        }
        .event-draft-badge {
          position: absolute; top: 12px; right: 12px;
          background: rgba(234, 179, 8, 0.9); color: #1a1a2e;
          padding: 4px 12px; border-radius: 20px;
          font-size: 0.75rem; font-weight: 600;
        }
        .event-card-body { padding: 20px; }
        .event-card-title {
          font-family: var(--font-display); font-size: 1.1rem;
          font-weight: 600; margin-bottom: 12px;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
        }
        .event-card-meta {
          display: flex; flex-direction: column; gap: 6px;
          color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 16px;
        }
        .event-card-meta span { display: flex; align-items: center; gap: 8px; }
        .event-card-footer {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 8px;
        }
        .event-price {
          font-family: var(--font-display); font-size: 1.25rem;
          font-weight: 700; color: var(--accent);
        }
        .event-actions { display: flex; gap: 6px; flex-wrap: wrap; }
      `}</style>
    </div>
  );
};

export default EventCard;
