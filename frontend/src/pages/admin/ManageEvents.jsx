import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiPlus } from 'react-icons/fi';
import Navbar from '../../components/Navbar';
import DashboardSidebar from '../../components/DashboardSidebar';
import EventCard from '../../components/EventCard';
import ConfirmDialog from '../../components/ConfirmDialog';
import { SkeletonGrid } from '../../components/Skeleton';
import { eventAPI } from '../../services/api';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteEvent, setDeleteEvent] = useState(null);

  const fetchEvents = () => {
    eventAPI.getAllAdmin()
      .then((res) => setEvents(res.data.data))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleDelete = async () => {
    try {
      await eventAPI.delete(deleteEvent._id);
      toast.success('Event deleted');
      setDeleteEvent(null);
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleTogglePublish = async (event) => {
    try {
      await eventAPI.togglePublish(event._id);
      toast.success(event.isPublished ? 'Event unpublished' : 'Event published');
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        <DashboardSidebar isAdmin />
        <main className="dashboard-main">
          <div className="section-header">
            <div>
              <h1 className="section-title">Manage Events</h1>
              <p className="section-subtitle">Create, edit, and publish events</p>
            </div>
            <Link to="/admin/events/create" className="btn btn-primary"><FiPlus /> Create Event</Link>
          </div>

          {loading ? <SkeletonGrid count={6} /> : events.length > 0 ? (
            <div className="grid-3">{events.map((e) => (
              <EventCard
                key={e._id}
                event={e}
                showActions
                onDelete={setDeleteEvent}
                onTogglePublish={handleTogglePublish}
              />
            ))}</div>
          ) : (
            <div className="empty-state glass-card"><p>No events yet. Create your first event!</p></div>
          )}
        </main>
      </div>

      <ConfirmDialog
        isOpen={!!deleteEvent}
        title="Delete Event"
        message={`Are you sure you want to delete "${deleteEvent?.title}"?`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteEvent(null)}
        danger
      />
    </>
  );
};

export default ManageEvents;
