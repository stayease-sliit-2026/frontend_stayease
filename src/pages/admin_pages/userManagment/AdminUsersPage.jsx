import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../../../services/adminUserApi';
import UserTable from '../../../components/UserTable';
import '../../../styles/AdminUsersPage.css';

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