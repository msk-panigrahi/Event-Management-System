import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FiTarget, FiUsers, FiAward, FiHeart } from 'react-icons/fi';

const About = () => (
  <>
    <Navbar />
    <div className="page-wrapper">
      <div className="container">
        <section className="about-hero glass-card">
          <h1 className="section-title">About EventHub</h1>
          <p className="about-lead">
            EventHub is a modern, full-stack event management platform designed to connect event organizers
            with attendees through seamless discovery, booking, and ticket management.
          </p>
        </section>

        <section className="about-mission grid-2 mt-4">
          <div className="glass-card about-card">
            <FiTarget className="about-icon" />
            <h3>Our Mission</h3>
            <p>
              To revolutionize how people discover and attend events by providing a premium,
              user-friendly platform that makes event management effortless for organizers and
              booking seamless for attendees.
            </p>
          </div>
          <div className="glass-card about-card">
            <FiHeart className="about-icon" />
            <h3>Our Vision</h3>
            <p>
              To become the go-to platform for event discovery and management across India,
              empowering communities to come together through memorable experiences.
            </p>
          </div>
        </section>

        <section className="mt-4">
          <h2 className="section-title text-center">Why Choose EventHub?</h2>
          <div className="grid-3 mt-3">
            {[
              { icon: FiUsers, title: 'Community First', desc: 'Built for organizers and attendees alike with intuitive tools.' },
              { icon: FiAward, title: 'Premium Experience', desc: 'Beautiful UI, instant tickets, and secure QR-based check-in.' },
              { icon: FiTarget, title: 'Smart Analytics', desc: 'Powerful dashboards to track revenue, bookings, and trends.' },
            ].map((item) => (
              <div key={item.title} className="glass-card about-card">
                <item.icon className="about-icon" />
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
    <Footer />
    <style>{`
      .about-hero { padding: 48px; text-align: center; margin-bottom: 24px; }
      .about-lead { color: var(--text-secondary); font-size: 1.15rem; max-width: 720px; margin: 0 auto; line-height: 1.8; }
      .about-card { padding: 32px; }
      .about-icon { font-size: 2.5rem; color: var(--accent); margin-bottom: 16px; }
      .about-card h3 { font-family: var(--font-display); font-size: 1.25rem; margin-bottom: 12px; }
      .about-card p { color: var(--text-secondary); line-height: 1.7; }
    `}</style>
  </>
);

export default About;
