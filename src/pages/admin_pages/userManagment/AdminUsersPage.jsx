import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../../../services/adminUserApi';
import UserTable from '../../../components/UserTable';
import '../../../styles/AdminUsersPage.css';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadUsers = () => {
    setLoading(true);
    getAllUsers()
      .then((res) => setUsers(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filter users by search
  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-users-pro-container">
      <div className="admin-users-pro-header">
        <div>
          <h2>User Management</h2>
        </div>
        <div className="admin-users-pro-actions">
          <input
            className="admin-users-pro-search"
            type="text"
            placeholder="Search by name, email"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Link to="/admin/register">
          <button
            className="admin-add-user-btn"
            style={{ padding: '10px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px 0 rgba(30,41,59,0.08)' }}
            onClick={() => navigate('/admin/register')}
          >
            Add User
          </button>
            </Link>
          {/* Future: Add button for Add User */}
        </div>
      </div>
      <div className="admin-users-pro-table-wrapper">
        {loading ? (
          <div className="admin-users-pro-loading">Loading users...</div>
        ) : (
          <UserTable users={filteredUsers} onRefresh={loadUsers} />
        )}
      </div>
    </div>
  );
}