import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard';
import { SkeletonGrid } from '../components/Skeleton';
import { eventAPI } from '../services/api';

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    city: searchParams.get('city') || '',
  });

  useEffect(() => {
    eventAPI.getCategories().then((res) => setCategories(res.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const params = { published: 'true' };
        if (filters.search) params.search = filters.search;
        if (filters.category) params.category = filters.category;
        if (filters.city) params.city = filters.city;
        const { data } = await eventAPI.getAll(params);
        setEvents(data.data);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    const params = {};
    Object.entries(updated).forEach(([k, v]) => { if (v) params[k] = v; });
    setSearchParams(params);
  };

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="container">
          <h1 className="section-title">All Events</h1>
          <p className="section-subtitle">Discover amazing events near you</p>

          <div className="filters glass-card">
            <input
              className="form-input"
              placeholder="Search events..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
            <select
              className="form-select"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              className="form-input"
              placeholder="City..."
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
            />
          </div>

          {loading ? (
            <SkeletonGrid count={6} />
          ) : events.length > 0 ? (
            <div className="grid-3 mt-3">{events.map((e) => <EventCard key={e._id} event={e} />)}</div>
          ) : (
            <div className="empty-state mt-4"><FiSearch /><p>No events found</p></div>
          )}
        </div>
      </div>
      <Footer />
      <style>{`
        .filters {
          display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px;
          padding: 20px; margin-bottom: 24px;
        }
        @media (max-width: 768px) {
          .filters { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
};

export default Events;
