import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiCreditCard, FiCheck } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { eventAPI, bookingAPI, paymentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const BookTicket = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState('booking');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    eventAPI.getById(id)
      .then((res) => setEvent(res.data.data))
      .catch(() => toast.error('Event not found'))
      .finally(() => setLoading(false));
  }, [id, user, navigate]);

  const totalAmount = event ? event.ticketPrice * quantity : 0;

  const handleBooking = async () => {
    if (quantity > event.availableSeats) {
      toast.error(`Only ${event.availableSeats} seats available`);
      return;
    }
    setProcessing(true);
    try {
      const { data } = await bookingAPI.create({ eventId: id, quantity });
      setBooking(data.data);
      setStep('payment');
      toast.success('Booking created! Complete payment to confirm.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setProcessing(false);
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    try {
      await paymentAPI.mockPay({ bookingId: booking._id, amount: booking.totalAmount });
      const { data } = await bookingAPI.getById(booking._id);
      setBooking(data.data);
      setStep('confirmation');
      toast.success('Payment successful!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <><Navbar /><LoadingSpinner /></>;
  if (!event) return <><Navbar /><div className="page-wrapper container"><p>Event not found</p></div></>;

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="container" style={{ maxWidth: 600 }}>
          <h1 className="section-title">Book Tickets</h1>
          <p className="section-subtitle">{event.title}</p>

          {step === 'booking' && (
            <div className="glass-card book-card">
              <div className="book-row">
                <span>Ticket Price</span>
                <strong>₹{event.ticketPrice}</strong>
              </div>
              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  className="form-input"
                  min={1}
                  max={event.availableSeats}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(event.availableSeats, parseInt(e.target.value) || 1)))}
                />
                <small style={{ color: 'var(--text-muted)' }}>{event.availableSeats} seats available</small>
              </div>
              <div className="book-row total">
                <span>Total Amount</span>
                <strong>₹{totalAmount}</strong>
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleBooking} disabled={processing}>
                {processing ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </div>
          )}

          {step === 'payment' && booking && (
            <div className="glass-card book-card">
              <div className="payment-icon"><FiCreditCard /></div>
              <h3>Mock Payment</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
                This is a simulated payment gateway. Razorpay integration can be added later.
              </p>
              <div className="book-row"><span>Ticket ID</span><strong>{booking.ticketId}</strong></div>
              <div className="book-row total"><span>Amount to Pay</span><strong>₹{booking.totalAmount}</strong></div>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={handlePayment} disabled={processing}>
                {processing ? 'Processing...' : 'Pay Now (Mock)'}
              </button>
            </div>
          )}

          {step === 'confirmation' && booking && (
            <div className="glass-card book-card text-center">
              <div className="success-icon"><FiCheck /></div>
              <h3>Booking Confirmed!</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>Your ticket has been generated successfully.</p>
              {booking.qrCode && (
                <img src={booking.qrCode} alt="QR Code" style={{ width: 180, margin: '0 auto 16px', borderRadius: 12 }} />
              )}
              <p><strong>Ticket ID:</strong> {booking.ticketId}</p>
              <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'center' }}>
                <Link to={`/dashboard/tickets/${booking._id}`} className="btn btn-primary">View Ticket</Link>
                <Link to="/dashboard" className="btn btn-secondary">Go to Dashboard</Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .book-card { padding: 32px; }
        .book-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--border-glass); }
        .book-row.total { border-bottom: none; font-size: 1.2rem; margin: 16px 0; }
        .payment-icon, .success-icon {
          width: 64px; height: 64px; border-radius: 50%;
          background: var(--gradient-soft); display: flex;
          align-items: center; justify-content: center;
          font-size: 1.8rem; color: var(--accent); margin: 0 auto 16px;
        }
        .success-icon { background: rgba(34, 197, 94, 0.2); color: #4ade80; }
      `}</style>
    </>
  );
};

export default BookTicket;
