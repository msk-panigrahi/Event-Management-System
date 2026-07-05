import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import DashboardSidebar from '../../components/DashboardSidebar';
import ConfirmDialog from '../../components/ConfirmDialog';
import LoadingSpinner from '../../components/LoadingSpinner';
import { authAPI } from '../../services/api';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteUser, setDeleteUser] = useState(null);

  const fetchUsers = () => {
    authAPI.getAllUsers()
      .then((res) => setUsers(res.data.data))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (id, role) => {
    try {
      await authAPI.updateUserRole(id, role);
      toast.success('Role updated');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async () => {
    try {
      await authAPI.deleteUser(deleteUser._id);
      toast.success('User deleted');
      setDeleteUser(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        <DashboardSidebar isAdmin />
        <main className="dashboard-main">
          <h1 className="section-title">Manage Users</h1>
          <p className="section-subtitle">View and manage registered users</p>

          {loading ? <LoadingSpinner /> : (
            <div className="table-wrapper glass-card">
              <table className="data-table">
                <thead>
                  <tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.phone || '-'}</td>
                      <td>
                        <select
                          className="form-select"
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          style={{ width: 'auto', padding: '6px 12px' }}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => setDeleteUser(u)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      <ConfirmDialog
        isOpen={!!deleteUser}
        title="Delete User"
        message={`Delete user "${deleteUser?.name}"?`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteUser(null)}
        danger
      />
    </>
  );
};

export default ManageUsers;
