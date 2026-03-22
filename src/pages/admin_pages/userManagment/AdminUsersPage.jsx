import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../../../services/adminUserApi';
import UserTable from '../../../components/UserTable';
import '../../../styles/AdminUsersPage.css';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = () => {
    setLoading(true);
    getAllUsers()
      .then((res) => setUsers(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="admin-users-container">
      <h1 className="admin-users-title">User Management</h1>
      {loading ? (
        <div className="admin-users-loading">Loading users...</div>
      ) : (
        <UserTable users={users} onRefresh={loadUsers} />
      )}
    </div>
  );
}