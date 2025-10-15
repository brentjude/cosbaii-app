import { useState, useEffect } from "react";
import { User, UserRole, UserStatus } from "@/types/admin";

interface Props {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (user: User) => void;
  loading: boolean;
}

export default function EditUserModal({ isOpen, user, onClose, onSave, loading }: Props) {
  const [formData, setFormData] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  if (!isOpen || !formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">Edit User</h3>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={formData.username || ""}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text">Role</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
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
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as UserStatus })}
                >
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="BANNED">BANNED</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="loading loading-spinner"></span> : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}