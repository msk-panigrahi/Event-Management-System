import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import DashboardSidebar from '../../components/DashboardSidebar';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', email: user.email || '', phone: user.phone || '', password: '' });
    }
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { name: form.name, phone: form.phone };
      if (form.password) payload.password = form.password;
      const { data } = await authAPI.updateProfile(payload);
      updateUser({ ...user, ...data.data });
      toast.success('Profile updated successfully');
      setForm((f) => ({ ...f, password: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        <DashboardSidebar />
        <main className="dashboard-main">
          <h1 className="section-title">My Profile</h1>
          <p className="section-subtitle">Manage your account information</p>

          <form className="glass-card profile-form" onSubmit={handleSubmit} style={{ maxWidth: 500, padding: 32 }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" value={form.email} disabled />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" name="phone" value={form.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">New Password (optional)</label>
              <input className="form-input" type="password" name="password" value={form.password} onChange={handleChange} placeholder="Leave blank to keep current" />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <input className="form-input" value={user?.role} disabled />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </main>
      </div>
    </>
  );
};

export default Profile;
