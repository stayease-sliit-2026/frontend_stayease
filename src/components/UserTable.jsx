import React, { useState } from 'react';
import EditUserModal from './EditUserModal';
import DeleteUserModal from './DeleteUserModal';
import '../styles/UserTable.css';

export default function UserTable({ users, onRefresh }) {
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);

  return (
    <div className="user-table-wrapper">
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th className="user-table-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan={5} className="user-table-empty">No users found.</td>
            </tr>
          )}
          {users.map((user) => (
            <tr key={user._id || user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.role}</td>
              <td className="user-table-actions">
                <button
                  className="user-table-btn edit"
                  onClick={() => setEditUser(user)}
                >
                  Edit
                </button>
                <button
                  className="user-table-btn delete"
                  onClick={() => setDeleteUser(user)}
                >
                  Delete
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