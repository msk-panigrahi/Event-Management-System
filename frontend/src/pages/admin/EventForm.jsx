import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import DashboardSidebar from '../../components/DashboardSidebar';
import { eventAPI } from '../../services/api';

const categories = ['Music', 'Tech', 'Sports', 'Business', 'Arts', 'Food', 'Education', 'Health'];

export const EventForm = ({ initial = {}, isEdit = false }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: initial.title || '',
    description: initial.description || '',
    venue: initial.venue || '',
    city: initial.city || '',
    date: initial.date ? new Date(initial.date).toISOString().split('T')[0] : '',
    time: initial.time || '',
    category: initial.category || 'Music',
    ticketPrice: initial.ticketPrice || '',
    maxSeats: initial.maxSeats || '',
    organizer: initial.organizer || '',
    isPublished: initial.isPublished || false,
  });
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, val]) => data.append(key, val));
      if (banner) data.append('bannerImage', banner);

      if (isEdit) {
        await eventAPI.update(initial._id, data);
        toast.success('Event updated successfully');
      } else {
        await eventAPI.create(data);
        toast.success('Event created successfully');
      }
      navigate('/admin/events');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        <DashboardSidebar isAdmin />
        <main className="dashboard-main">
          <h1 className="section-title">{isEdit ? 'Edit Event' : 'Create Event'}</h1>
          <form className="glass-card event-form" onSubmit={handleSubmit} style={{ maxWidth: 700, padding: 32 }}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input className="form-input" name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" name="description" value={form.description} onChange={handleChange} required />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Venue</label>
                <input className="form-input" name="venue" value={form.venue} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input className="form-input" name="city" value={form.city} onChange={handleChange} required />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Date</label>
                <input className="form-input" type="date" name="date" value={form.date} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Time</label>
                <input className="form-input" type="time" name="time" value={form.time} onChange={handleChange} required />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" name="category" value={form.category} onChange={handleChange}>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Organizer</label>
                <input className="form-input" name="organizer" value={form.organizer} onChange={handleChange} required />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Ticket Price (₹)</label>
                <input className="form-input" type="number" name="ticketPrice" value={form.ticketPrice} onChange={handleChange} min="0" required />
              </div>
              <div className="form-group">
                <label className="form-label">Maximum Seats</label>
                <input className="form-input" type="number" name="maxSeats" value={form.maxSeats} onChange={handleChange} min="1" required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Banner Image</label>
              <input className="form-input" type="file" accept="image/*" onChange={(e) => setBanner(e.target.files[0])} />
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleChange} />
                Publish immediately
              </label>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : isEdit ? 'Update Event' : 'Create Event'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/events')}>Cancel</button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
};

export const CreateEvent = () => <EventForm />;
export default CreateEvent;
