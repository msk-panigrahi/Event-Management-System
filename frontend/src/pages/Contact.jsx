import { useState } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success('Message sent successfully! We will get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="container">
          <h1 className="section-title text-center">Contact Us</h1>
          <p className="section-subtitle text-center">We'd love to hear from you</p>

          <div className="contact-grid grid-2">
            <div className="glass-card contact-info">
              <h3>Get in Touch</h3>
              <div className="contact-item">
                <FiMail /><div><strong>Email</strong><p>mithunsaicse2024@gmail.com</p></div>
              </div>
              <div className="contact-item">
                <FiPhone /><div><strong>Phone</strong><p>+91 9392038629</p></div>
              </div>
              <div className="contact-item">
                <FiMapPin /><div><strong>Address</strong><p>Kurmannapalem,Visakhapatnam, India</p></div>
              </div>
            </div>

            <form className="glass-card contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input className="form-input" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input className="form-input" name="subject" value={form.subject} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea className="form-textarea" name="message" value={form.message} onChange={handleChange} required />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <FiSend /> {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
      <style>{`
        .contact-grid { gap: 32px; align-items: start; }
        .contact-info, .contact-form { padding: 32px; }
        .contact-info h3 { font-family: var(--font-display); margin-bottom: 24px; }
        .contact-item {
          display: flex; gap: 16px; margin-bottom: 24px;
          color: var(--text-secondary);
        }
        .contact-item svg { font-size: 1.5rem; color: var(--accent); flex-shrink: 0; margin-top: 4px; }
        .contact-item strong { display: block; color: var(--text-primary); margin-bottom: 4px; }
      `}</style>
    </>
  );
};

export default Contact;
