import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Html5QrcodeScanner } from 'html5-qrcode';
import Navbar from '../../components/Navbar';
import DashboardSidebar from '../../components/DashboardSidebar';
import { bookingAPI } from '../../services/api';
import { formatDate, getStatusBadge } from '../../utils/helpers';

const ScanTicket = () => {
  const [ticketId, setTicketId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const scannerInstance = useRef(null);

  const handleVerify = useCallback(async (id) => {
    const ticket = id || ticketId;
    if (!ticket) {
      toast.error('Enter or scan a ticket ID');
      return;
    }
    setLoading(true);
    try {
      const { data } = await bookingAPI.verify(ticket);
      setResult(data.data);
      toast.success('Ticket verified!');
    } catch (err) {
      setResult(err.response?.data?.data || null);
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      (decodedText) => {
        try {
          const data = JSON.parse(decodedText);
          const tid = data.ticketId || decodedText;
          setTicketId(tid);
          handleVerify(tid);
        } catch {
          setTicketId(decodedText);
          handleVerify(decodedText);
        }
      },
      () => {}
    );

    scannerInstance.current = scanner;

    return () => {
      if (scannerInstance.current) {
        scannerInstance.current.clear().catch(() => {});
      }
    };
  }, [handleVerify]);

  const handleCheckIn = async () => {
    if (!ticketId) return;
    setLoading(true);
    try {
      const { data } = await bookingAPI.checkIn(ticketId);
      setResult(data.data);
      toast.success('Check-in successful!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Check-in failed');
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
          <h1 className="section-title">QR Ticket Scanner</h1>
          <p className="section-subtitle">Scan or enter ticket ID to verify and check-in attendees</p>

          <div className="scan-grid grid-2">
            <div className="glass-card scan-section">
              <h3>Scan QR Code</h3>
              <div id="qr-reader" style={{ width: '100%' }} />
            </div>

            <div className="glass-card scan-section">
              <h3>Manual Entry</h3>
              <div className="form-group">
                <label className="form-label">Ticket ID</label>
                <input
                  className="form-input"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  placeholder="TKT-XXXXXXXX"
                />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-secondary" onClick={() => handleVerify()} disabled={loading}>
                  Verify
                </button>
                <button className="btn btn-primary" onClick={handleCheckIn} disabled={loading || !ticketId}>
                  Check In
                </button>
              </div>

              {result && (
                <div className="scan-result mt-3">
                  <span className={`badge ${getStatusBadge(result.status)}`}>{result.status}</span>
                  <h4>{result.event?.title}</h4>
                  <p><strong>Attendee:</strong> {result.user?.name}</p>
                  <p><strong>Email:</strong> {result.user?.email}</p>
                  <p><strong>Ticket:</strong> {result.ticketId}</p>
                  <p><strong>Quantity:</strong> {result.quantity}</p>
                  <p><strong>Event Date:</strong> {formatDate(result.event?.date)}</p>
                  {result.checkedInAt && (
                    <p><strong>Checked In:</strong> {formatDate(result.checkedInAt)}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <style>{`
        .scan-section { padding: 24px; }
        .scan-section h3 { margin-bottom: 16px; font-size: 1.1rem; }
        .scan-result {
          padding: 16px; border-radius: var(--radius-md);
          background: rgba(255,255,255,0.04); border: 1px solid var(--border-glass);
        }
        .scan-result h4 { margin: 12px 0 8px; }
        .scan-result p { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 4px; }
        #qr-reader { border-radius: var(--radius-md); overflow: hidden; }
      `}</style>
    </>
  );
};

export default ScanTicket;
