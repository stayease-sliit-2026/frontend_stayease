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
      <div className="modal-box">
        <h2>Delete User</h2>
        <p>Are you sure you want to delete <b>{user.name}</b>?</p>
        {error && <div className="modal-error">{error}</div>}
        <div className="modal-actions">
          <button
            type="button"
            className="modal-btn cancel"
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="modal-btn delete"
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