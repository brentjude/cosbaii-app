"use client";

import { useState, useEffect } from "react";

// ✅ Removed unused User interface - it's not needed in this component
interface NewUserData {
  name: string | null;
  email: string;
  username: string | null;
  password: string;
  role: "USER" | "ADMIN" | "MODERATOR";
  status: "INACTIVE" | "ACTIVE" | "BANNED";
}

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: NewUserData) => void;
  loading?: boolean;
}

const AddUserModal = ({
  isOpen,
  onClose,
  onSave,
  loading = false,
}: AddUserModalProps) => {
  const [userForm, setUserForm] = useState<NewUserData>({
    name: "",
    email: "",
    username: "",
    password: "",
    role: "USER",
    status: "ACTIVE",
  });

  const [errors, setErrors] = useState<Partial<NewUserData>>({});
  const [showPassword, setShowPassword] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setUserForm({
        name: "",
        email: "",
        username: "",
        password: "",
        role: "USER",
        status: "ACTIVE",
      });
      setErrors({});
    }
  }, [isOpen]);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Partial<NewUserData> = {};

    // Email validation
    if (!userForm.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!userForm.password) {
      newErrors.password = "Password is required";
    } else if (userForm.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Username validation (optional, but if provided must be valid)
    if (userForm.username && userForm.username.trim()) {
      if (userForm.username.length < 3) {
        newErrors.username = "Username must be at least 3 characters";
      } else if (!/^[a-zA-Z0-9_]+$/.test(userForm.username)) {
        newErrors.username =
          "Username can only contain letters, numbers, and underscores";
      }
    }

    // Name validation (optional)
    if (userForm.name && userForm.name.trim() && userForm.name.length > 100) {
      newErrors.name = "Name must be less than 100 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!loading && validateForm()) {
      // Clean up form data
      const cleanedData = {
        ...userForm,
        name: userForm.name?.trim() || null,
        username: userForm.username?.trim() || null,
        email: userForm.email.trim(),
      };
      onSave(cleanedData);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setUserForm({
        name: "",
        email: "",
        username: "",
        password: "",
        role: "USER",
        status: "ACTIVE",
      });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">Add New User</h3>

        <div className="grid grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="label">
              <span className="label-text">Full Name</span>
              <span className="label-text-alt text-base-content/60">
                (Optional)
              </span>
            </label>
            <input
              type="text"
              className={`input input-bordered w-full ${
                errors.name ? "input-error" : ""
              }`}
              value={userForm.name || ""}
              onChange={(e) =>
                setUserForm({ ...userForm, name: e.target.value || null })
              }
              disabled={loading}
              placeholder="Enter full name"
            />
            {errors.name && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.name}</span>
              </label>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="label">
              <span className="label-text">Username</span>
              <span className="label-text-alt text-base-content/60">
                (Optional)
              </span>
            </label>
            <input
              type="text"
              className={`input input-bordered w-full ${
                errors.username ? "input-error" : ""
              }`}
              value={userForm.username || ""}
              onChange={(e) =>
                setUserForm({ ...userForm, username: e.target.value || null })
              }
              disabled={loading}
              placeholder="Enter username"
            />
            {errors.username && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.username}
                </span>
              </label>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="label">
              <span className="label-text">
                Email <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="email"
              className={`input input-bordered w-full ${
                errors.email ? "input-error" : ""
              }`}
              value={userForm.email}
              onChange={(e) =>
                setUserForm({ ...userForm, email: e.target.value })
              }
              disabled={loading}
              placeholder="Enter email address"
              required
            />
            {errors.email && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.email}
                </span>
              </label>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="label">
              <span className="label-text">
                Password <span className="text-error">*</span>
              </span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`input input-bordered w-full pr-10 ${
                  errors.password ? "input-error" : ""
                }`}
                value={userForm.password}
                onChange={(e) =>
                  setUserForm({ ...userForm, password: e.target.value })
                }
                disabled={loading}
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.password}
                </span>
              </label>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="label">
              <span className="label-text">Role</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={userForm.role}
              onChange={(e) =>
                setUserForm({
                  ...userForm,
                  role: e.target.value as NewUserData["role"],
                })
              }
              disabled={loading}
            >
              <option value="USER">USER</option>
              <option value="MODERATOR">MODERATOR</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="label">
              <span className="label-text">Status</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={userForm.status}
              onChange={(e) =>
                setUserForm({
                  ...userForm,
                  status: e.target.value as NewUserData["status"],
                })
              }
              disabled={loading}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="BANNED">BANNED</option>
            </select>
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                {userForm.status === "ACTIVE" &&
                  "User can immediately access the platform"}
                {userForm.status === "INACTIVE" &&
                  "User will need admin approval"}
                {userForm.status === "BANNED" &&
                  "User will be blocked from access"}
              </span>
            </label>
          </div>
        </div>

        {/* Form Footer Info */}
        <div className="bg-base-200 p-3 rounded-md mt-4">
          <div className="text-sm text-base-content/70">
            <p className="font-medium mb-1">📝 Note:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Email and password are required fields</li>
              <li>Username must be unique if provided</li>
              <li>Password must be at least 6 characters long</li>
              <li>The user will receive login credentials via email</li>
            </ul>
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
            disabled={loading || !userForm.email || !userForm.password}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Creating User...
              </>
            ) : (
              "Create User"
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

export default AddUserModal;