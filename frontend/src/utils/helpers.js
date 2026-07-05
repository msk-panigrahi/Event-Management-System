import { jsPDF } from 'jspdf';

export const downloadTicketPDF = (booking) => {
  const doc = new jsPDF();
  const event = booking.event;
  const user = booking.user;

  doc.setFillColor(99, 102, 241);
  doc.rect(0, 0, 210, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('EventHub Ticket', 105, 20, { align: 'center' });
  doc.setFontSize(10);
  doc.text('Official Event Ticket', 105, 30, { align: 'center' });

  doc.setTextColor(30, 30, 30);
  doc.setFontSize(16);
  doc.text(event?.title || 'Event', 20, 55);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Ticket ID: ${booking.ticketId}`, 20, 68);
  doc.text(`Attendee: ${user?.name || 'Guest'}`, 20, 78);
  doc.text(`Email: ${user?.email || ''}`, 20, 88);
  doc.text(`Venue: ${event?.venue || ''}, ${event?.city || ''}`, 20, 98);
  doc.text(`Date: ${new Date(event?.date).toLocaleDateString()}`, 20, 108);
  doc.text(`Time: ${event?.time || ''}`, 20, 118);
  doc.text(`Quantity: ${booking.quantity}`, 20, 128);
  doc.text(`Amount Paid: ₹${booking.totalAmount}`, 20, 138);
  doc.text(`Status: ${booking.status}`, 20, 148);

  if (booking.qrCode) {
    doc.addImage(booking.qrCode, 'PNG', 130, 60, 60, 60);
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Scan at entry', 160, 125, { align: 'center' });
  }

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('This ticket is non-transferable. Please present this at the venue.', 105, 280, { align: 'center' });

  doc.save(`ticket-${booking.ticketId}.pdf`);
};

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

export const getStatusBadge = (status) => {
  const map = {
    confirmed: 'badge-success',
    cancelled: 'badge-danger',
    'checked-in': 'badge-info',
    pending: 'badge-warning',
    completed: 'badge-success',
    failed: 'badge-danger',
  };
  return map[status] || 'badge-info';
};
