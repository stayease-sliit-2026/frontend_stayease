import React, { useState } from 'react';
import { updateUserById } from '../services/adminUserApi';
import '../styles/UserModal.css';

export default function EditUserModal({ user, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: user.name || '',
    phone: user.phone || user.mobile || '',
    address: user.address || '',
    role: user.role === 'guest' ? 'user' : (user.role || 'user'),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await updateUserById(user._id || user.id, form);
      onSaved();
    } catch (err) {
      setError('Failed to update user.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay modal-sheet-overlay" onClick={onClose}>
      <div
        className="modal-sheet-left user-modal-pro-box"
        onClick={e => e.stopPropagation()}
      >
        <div className="user-modal-pro-header">
          <div className="user-modal-pro-avatar">
            {form.name ? form.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h2>Edit User</h2>
            <div className="user-modal-pro-email">{user.email}</div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="user-modal-pro-form">
          <div className="user-modal-pro-fields">
            <label>
              Name
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Phone
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </label>
            <label>
              Address
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
              />
            </label>
            <label>
              Role
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
              >
                <option value="user">Admin</option>
                <option value="admin">Employee</option>
                <option value="guest">User</option>
              </select>
            </label>
          </div>
          {error && <div className="user-modal-pro-error">{error}</div>}
          <div className="user-modal-pro-actions">
            <button
              type="button"
              className="user-modal-pro-btn cancel"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="user-modal-pro-btn save"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}