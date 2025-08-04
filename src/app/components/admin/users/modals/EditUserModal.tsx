"use client";

import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string | null;
  email: string;
  username: string | null;
  role: "USER" | "ADMIN" | "MODERATOR";
  status: "INACTIVE" | "ACTIVE" | "BANNED";
  createdAt: string;
  updatedAt: string;
  reviewedBy: string | null; // ✅ Fixed: Changed from optional to string | null
}

interface EditUserModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (user: User) => void;
  loading?: boolean;
}

const EditUserModal = ({
  isOpen,
  user,
  onClose,
  onSave,
  loading = false,
}: EditUserModalProps) => {
  const [editForm, setEditForm] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      setEditForm({ ...user });
    }
  }, [user]);

  if (!isOpen || !user || !editForm) return null;

  const handleSave = () => {
    if (editForm && !loading) {
      const updatedUser = {
        ...editForm,
        updatedAt: new Date().toISOString(),
      };
      onSave(updatedUser);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setEditForm(null);
      onClose();
    }
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">Edit User</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={editForm.name || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value || null })
              }
              disabled={loading}
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={editForm.username || ""}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  username: e.target.value || null,
                })
              }
              disabled={loading}
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              className="input input-bordered w-full"
              value={editForm.email}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
              disabled={loading}
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Role</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={editForm.role}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  role: e.target.value as User["role"],
                })
              }
              disabled={loading}
            >
              <option value="USER">USER</option>
              <option value="MODERATOR">MODERATOR</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <div>
            <label className="label">
              <span className="label-text">Status</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={editForm.status}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  status: e.target.value as User["status"],
                })
              }
              disabled={loading}
            >
              <option value="INACTIVE">INACTIVE</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="BANNED">BANNED</option>
            </select>
          </div>
        </div>

        <div className="modal-action">
          <button
            className="btn btn-ghost"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>

      {/* Backdrop */}
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={handleClose} disabled={loading}>
          close
        </button>
      </form>
    </dialog>
  );
};

export default EditUserModal;
