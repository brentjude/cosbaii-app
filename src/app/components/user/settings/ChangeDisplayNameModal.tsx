// Create: src/app/components/user/settings/ChangeDisplayNameModal.tsx
"use client";

import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ChangeDisplayNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDisplayName: string;
  onSuccess: () => void;
}

const ChangeDisplayNameModal: React.FC<ChangeDisplayNameModalProps> = ({
  isOpen,
  onClose,
  currentDisplayName,
  onSuccess,
}) => {
  const [newDisplayName, setNewDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (newDisplayName.trim().length < 2) {
      setError("Display name must be at least 2 characters long");
      setLoading(false);
      return;
    }

    if (newDisplayName.trim().length > 50) {
      setError("Display name must be less than 50 characters");
      setLoading(false);
      return;
    }

    if (newDisplayName.trim() === currentDisplayName) {
      setError("New display name must be different from current name");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/user/display-name", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: newDisplayName.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update display name");
      }

      // Success
      alert("Display name updated successfully!");
      setNewDisplayName("");
      onSuccess();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewDisplayName("");
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={handleClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-base-100 rounded-2xl shadow-2xl max-w-md w-full">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-base-200">
            <h2 className="text-xl font-bold">Change Display Name</h2>
            <button
              onClick={handleClose}
              className="btn btn-sm btn-circle btn-ghost"
              disabled={loading}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Current Display Name
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={currentDisplayName || "Not set"}
                disabled
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">New Display Name</span>
              </label>
              <input
                type="text"
                className={`input input-bordered ${error ? "input-error" : ""}`}
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
                placeholder="Enter new display name"
                required
                minLength={2}
                maxLength={50}
                disabled={loading}
              />
              <label className="label">
                <span className="label-text-alt">2-50 characters</span>
                <span className="label-text-alt">
                  {newDisplayName.length}/50
                </span>
              </label>
              {error && (
                <label className="label">
                  <span className="label-text-alt text-error">{error}</span>
                </label>
              )}
            </div>

            {/* Important Notice */}
            <div className="alert alert-warning">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <div className="text-sm">
                <p className="font-medium">Important:</p>
                <p>You can only change your display name once every 7 days.</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-ghost"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={
                  loading ||
                  !newDisplayName.trim() ||
                  newDisplayName.trim() === currentDisplayName
                }
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Updating...
                  </>
                ) : (
                  "Update Display Name"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangeDisplayNameModal;
