import React, { useState } from 'react';
import EditUserModal from './EditUserModal';
import DeleteUserModal from './DeleteUserModal';
import '../styles/UserTable.css';

export default function UserTable({ users, onRefresh }) {
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);

  return (
    <div className="user-table-pro-wrapper">
      <table className="user-table-pro">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th className="user-table-pro-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan={5} className="user-table-pro-empty">No users found.</td>
            </tr>
          )}
          {users.map((user) => (
            <tr key={user._id || user.id}>
              <td className="user-table-pro-usercell">
                <div className="user-table-pro-avatar">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="user-table-pro-username">{user.name}</div>
              </td>
              <td>{user.email}</td>
              <td>{user.phone || user.mobile || '-'}</td>
              <td>
                <span className={`user-table-pro-role user-table-pro-role-${user.role === 'guest' ? 'user' : user.role}`}>
                  {user.role === 'guest' ? 'user' : user.role}
                </span>
              </td>
              <td className="user-table-pro-actions">
                <button
                  className="user-table-pro-btn edit"
                  onClick={() => setEditUser(user)}
                  title="Edit user"
                >
                  <span className="user-table-pro-btn-icon">✏️</span> Edit
                </button>
                <button
                  className="user-table-pro-btn delete"
                  onClick={() => setDeleteUser(user)}
                  title="Delete user"
                >
                  <span className="user-table-pro-btn-icon">🗑️</span> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSaved={() => {
            setEditUser(null);
            onRefresh();
          }}
        />
      )}
      {deleteUser && (
        <DeleteUserModal
          user={deleteUser}
          onClose={() => setDeleteUser(null)}
          onDeleted={() => {
            setDeleteUser(null);
            onRefresh();
          }}
        />
      )}
    </div>
  );
}