import React, { useState } from 'react';
import { deleteUserById } from '../services/adminUserApi';
import '../styles/UserModal.css';

export default function DeleteUserModal({ user, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setDeleting(true);
    setError('');
    try {
      await deleteUserById(user._id || user.id);
      onDeleted();
    } catch (err) {
      setError('Failed to delete user.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box user-modal-pro-box">
        <div className="user-modal-pro-header">
          <div className="user-modal-pro-avatar">
            {user.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h2 style={{ color: '#b91c1c' }}>Delete User</h2>
            <div className="user-modal-pro-email">{user.email}</div>
          </div>
        </div>
        <div style={{ marginBottom: 18, color: '#1e293b', fontWeight: 500 }}>
          Are you sure you want to delete <b>{user.name}</b>?
        </div>
        {error && <div className="user-modal-pro-error">{error}</div>}
        <div className="user-modal-pro-actions">
          <button
            type="button"
            className="user-modal-pro-btn cancel"
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="user-modal-pro-btn delete"
            style={{ background: '#b91c1c', color: '#fff' }}
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}