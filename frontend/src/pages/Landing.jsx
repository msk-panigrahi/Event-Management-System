import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiSearch, FiStar } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard';
import { SkeletonGrid } from '../components/Skeleton';
import { eventAPI } from '../services/api';

const categories = ['Music', 'Tech', 'Sports', 'Business', 'Arts', 'Food', 'Education', 'Health'];

const Landing = () => {
  const [featured, setFeatured] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, upcomingRes] = await Promise.all([
          eventAPI.getFeatured(),
          eventAPI.getUpcoming(),
        ]);
        setFeatured(featuredRes.data.data);
        setUpcoming(upcomingRes.data.data);
      } catch {
        setFeatured([]);
        setUpcoming([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <section className="hero">
          <div className="container hero-content">
            <div className="hero-text">
              <span className="hero-badge">Premium Event Platform</span>
              <h1>
                Discover & Book
                <span className="text-gradient"> Amazing Events</span>
              </h1>
              <p>
                From concerts to conferences, find and book tickets to the best events in your city.
                Seamless booking, instant tickets, and unforgettable experiences.
              </p>
              <div className="hero-actions">
                <Link to="/events" className="btn btn-primary btn-lg">
                  Explore Events <FiArrowRight />
                </Link>
                <Link to="/register" className="btn btn-secondary btn-lg">
                  Get Started
                </Link>
              </div>
              <div className="hero-stats">
                <div><strong>500+</strong><span>Events</span></div>
                <div><strong>10K+</strong><span>Users</span></div>
                <div><strong>50+</strong><span>Cities</span></div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-card glass">
                <FiStar className="hero-star" />
                <h3>Next Big Event</h3>
                <p>Book your spot before tickets sell out!</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <h2 className="section-title text-center">Browse Categories</h2>
            <p className="section-subtitle text-center">Find events that match your interests</p>
            <div className="categories-grid">
              {categories.map((cat) => (
                <Link key={cat} to={`/events?category=${cat}`} className="category-card glass-card">
                  <span>{cat}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title">Featured Events</h2>
                <p className="section-subtitle">Handpicked events you'll love</p>
              </div>
              <Link to="/events" className="btn btn-secondary">View All</Link>
            </div>
            {loading ? <SkeletonGrid count={3} /> : (
              featured.length > 0 ? (
                <div className="grid-3">{featured.map((e) => <EventCard key={e._id} event={e} />)}</div>
              ) : (
                <div className="empty-state"><FiSearch /><p>No featured events yet</p></div>
              )
            )}
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title">Upcoming Events</h2>
                <p className="section-subtitle">Don't miss what's coming next</p>
              </div>
            </div>
            {loading ? <SkeletonGrid count={3} /> : (
              upcoming.length > 0 ? (
                <div className="grid-3">{upcoming.map((e) => <EventCard key={e._id} event={e} />)}</div>
              ) : (
                <div className="empty-state"><FiSearch /><p>No upcoming events</p></div>
              )
            )}
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <div className="cta-card glass">
              <h2>Ready to host your own event?</h2>
              <p>Join thousands of organizers using EventHub to manage their events.</p>
              <Link to="/register" className="btn btn-primary btn-lg">Start Today</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <style>{`
        .hero {
          min-height: 90vh; display: flex; align-items: center;
          padding: 120px 0 80px; position: relative;
        }
        .hero-content {
          display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;
        }
        .hero-badge {
          display: inline-block; padding: 6px 16px; border-radius: 20px;
          background: var(--gradient-soft); border: 1px solid var(--border-glass);
          font-size: 0.85rem; font-weight: 600; color: var(--accent); margin-bottom: 20px;
        }
        .hero-text h1 {
          font-family: var(--font-display); font-size: 3.5rem;
          font-weight: 800; line-height: 1.15; margin-bottom: 20px;
        }
        .hero-text p {
          color: var(--text-secondary); font-size: 1.15rem;
          line-height: 1.7; margin-bottom: 32px; max-width: 520px;
        }
        .hero-actions { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 48px; }
        .hero-stats { display: flex; gap: 40px; }
        .hero-stats div { display: flex; flex-direction: column; }
        .hero-stats strong {
          font-family: var(--font-display); font-size: 1.75rem;
          background: var(--gradient); -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-stats span { color: var(--text-muted); font-size: 0.9rem; }
        .hero-visual { display: flex; justify-content: center; }
        .hero-card {
          padding: 40px; text-align: center; max-width: 320px;
          animation: float 3s ease-in-out infinite;
        }
        .hero-star { font-size: 3rem; color: #facc15; margin-bottom: 16px; }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .section { padding: 80px 0; }
        .section-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          margin-bottom: 32px; flex-wrap: wrap; gap: 16px;
        }
        .categories-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
        }
        .category-card {
          padding: 24px; text-align: center; font-weight: 600;
          transition: var(--transition); cursor: pointer;
        }
        .category-card:hover {
          background: var(--gradient); color: white; transform: translateY(-4px);
        }
        .cta-section { padding: 40px 0 80px; }
        .cta-card {
          text-align: center; padding: 60px 40px; border-radius: var(--radius-xl);
        }
        .cta-card h2 {
          font-family: var(--font-display); font-size: 2rem; margin-bottom: 12px;
        }
        .cta-card p { color: var(--text-secondary); margin-bottom: 24px; }
        @media (max-width: 768px) {
          .hero-content { grid-template-columns: 1fr; }
          .hero-text h1 { font-size: 2.25rem; }
          .hero-visual { display: none; }
          .categories-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </>
  );
};

export default Landing;
