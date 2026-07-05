import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import { useAuth } from './context/AuthContext';

import Landing from './pages/Landing';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import BookTicket from './pages/BookTicket';

import UserDashboard from './pages/user/UserDashboard';
import BookedTickets from './pages/user/BookedTickets';
import TicketDetail from './pages/user/TicketDetail';
import BookingHistory from './pages/user/BookingHistory';
import Profile from './pages/user/Profile';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageEvents from './pages/admin/ManageEvents';
import CreateEvent from './pages/admin/EventForm';
import EditEvent from './pages/admin/EditEvent';
import ManageUsers from './pages/admin/ManageUsers';
import ManageBookings from './pages/admin/ManageBookings';
import ScanTicket from './pages/admin/ScanTicket';
import Analytics from './pages/admin/Analytics';

const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <>
        <Navbar />
        <LoadingSpinner />
      </>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<EventDetail />} />
      <Route path="/events/:id/book" element={
        <ProtectedRoute><BookTicket /></ProtectedRoute>
      } />

      <Route path="/dashboard" element={
        <ProtectedRoute><UserDashboard /></ProtectedRoute>
      } />
      <Route path="/dashboard/tickets" element={
        <ProtectedRoute><BookedTickets /></ProtectedRoute>
      } />
      <Route path="/dashboard/tickets/:id" element={
        <ProtectedRoute><TicketDetail /></ProtectedRoute>
      } />
      <Route path="/dashboard/history" element={
        <ProtectedRoute><BookingHistory /></ProtectedRoute>
      } />
      <Route path="/dashboard/profile" element={
        <ProtectedRoute><Profile /></ProtectedRoute>
      } />

      <Route path="/admin/dashboard" element={
        <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
      } />
      <Route path="/admin/events" element={
        <ProtectedRoute adminOnly><ManageEvents /></ProtectedRoute>
      } />
      <Route path="/admin/events/create" element={
        <ProtectedRoute adminOnly><CreateEvent /></ProtectedRoute>
      } />
      <Route path="/admin/events/edit/:id" element={
        <ProtectedRoute adminOnly><EditEvent /></ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute adminOnly><ManageUsers /></ProtectedRoute>
      } />
      <Route path="/admin/bookings" element={
        <ProtectedRoute adminOnly><ManageBookings /></ProtectedRoute>
      } />
      <Route path="/admin/analytics" element={
        <ProtectedRoute adminOnly><Analytics /></ProtectedRoute>
      } />
      <Route path="/admin/scan" element={
        <ProtectedRoute adminOnly><ScanTicket /></ProtectedRoute>
      } />
    </Routes>
  );
};

export default App;
