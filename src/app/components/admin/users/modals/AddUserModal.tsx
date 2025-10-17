// Update: src/app/components/admin/users/modals/AddUserModal.tsx
import { useState } from "react";
import { NewUserData, UserRole, UserStatus } from "@/types/admin";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: NewUserData) => void;
  loading: boolean;
}

export default function AddUserModal({ isOpen, onClose, onSave, loading }: Props) {
  const [formData, setFormData] = useState<NewUserData>({
    name: "",
    email: "",
    username: "",
    password: "",
    role: "USER",
    status: "ACTIVE",
    isPremiumUser: false, // ✅ Already correctly initialized
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      username: "",
      password: "",
      role: "USER",
      status: "ACTIVE",
      isPremiumUser: false,
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">Add New User</h3>

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
                placeholder="John Doe"
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
                placeholder="johndoe"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Email *</span>
              </label>
              <input
                type="email"
                className={`input input-bordered w-full ${errors.email ? "input-error" : ""}`}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                required
              />
              {errors.email && <p className="text-error text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="label">
                <span className="label-text">Password *</span>
              </label>
              <input
                type="password"
                className={`input input-bordered w-full ${errors.password ? "input-error" : ""}`}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Min. 6 characters"
                required
              />
              {errors.password && <p className="text-error text-sm mt-1">{errors.password}</p>}
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

            {/* ✅ Premium User Toggle - Fixed with Boolean() */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-4">
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={Boolean(formData.isPremiumUser)}
                  onChange={(e) => setFormData({ ...formData, isPremiumUser: e.target.checked })}
                />
                <div>
                  <span className="label-text font-medium">Premium User</span>
                  <p className="text-xs text-gray-500 mt-1">
                    Grant this user access to premium features and benefits
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="modal-action">
            <button type="button" className="btn" onClick={handleClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="loading loading-spinner"></span> : "Create User"}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={handleClose}></div>
    </div>
  );
}