// Update: src/app/components/admin/users/modals/EditUserModal.tsx
import { useState, useEffect } from "react";
import { User, UserRole, UserStatus } from "@/types/admin";
import { useSession } from "next-auth/react";

interface Props {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (user: User) => void;
  loading: boolean;
}

export default function EditUserModal({ isOpen, user, onClose, onSave, loading }: Props) {
  const { data: session } = useSession();
  const [formData, setFormData] = useState<User>({
    id: 0,
    name: "",
    email: "",
    username: "",
    role: "USER",
    status: "ACTIVE",
    createdAt: "",
    updatedAt: "",
    reviewedBy: null,
    isPremiumUser: false,
    reviewed: false,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        isPremiumUser: Boolean(user.isPremiumUser),
        reviewed: Boolean(user.reviewed),
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  // ✅ Handle reviewed toggle change
  const handleReviewedChange = (checked: boolean) => {
    setFormData({
      ...formData,
      reviewed: checked,
      // Update reviewedBy when marking as reviewed
      reviewedBy: checked ? (session?.user?.username || session?.user?.email || null) : null,
    });
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

            {/* ✅ Premium User Toggle */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-4">
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={formData.isPremiumUser}
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

            {/* ✅ Reviewed Toggle */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-4">
                <input
                  type="checkbox"
                  className="toggle toggle-success"
                  checked={formData.reviewed}
                  onChange={(e) => handleReviewedChange(e.target.checked)}
                />
                <div className="flex-1">
                  <span className="label-text font-medium">Mark as Reviewed</span>
                  <p className="text-xs text-gray-500 mt-1">
                    Indicate that this user profile has been reviewed by an admin
                  </p>
                  {/* ✅ Show who reviewed */}
                  {formData.reviewed && formData.reviewedBy && (
                    <p className="text-xs text-success mt-1">
                      Reviewed by: {formData.reviewedBy}
                    </p>
                  )}
                </div>
              </label>
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