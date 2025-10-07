// Create: src/app/components/user/settings/DeleteAccountModal.tsx
"use client";

import { useState } from "react";
import {
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [confirmText, setConfirmText] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  const handleContinue = () => {
    if (confirmText.toLowerCase() === "delete my account") {
      setStep(2);
      setError(null);
    } else {
      setError('Please type "Delete my account" to continue');
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/user/delete-account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete account");
      }

      // Account deleted successfully
      alert("Your account has been permanently deleted.");

      // Sign out and redirect to home
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Deletion failed");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setConfirmText("");
    setPassword("");
    setError(null);
    setStep(1);
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={handleClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-base-100 rounded-2xl shadow-2xl max-w-md w-full">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-base-200">
            <div className="flex items-center gap-3">
              <ExclamationTriangleIcon className="w-6 h-6 text-error" />
              <h2 className="text-xl font-bold text-error">Delete Account</h2>
            </div>
            <button
              onClick={handleClose}
              className="btn btn-sm btn-circle btn-ghost"
              disabled={loading}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Step 1: Confirmation Text */}
          {step === 1 && (
            <div className="p-6 space-y-4">
              <div className="alert alert-error">
                <ExclamationTriangleIcon className="w-6 h-6" />
                <div>
                  <h3 className="font-bold">This action cannot be undone!</h3>
                  <div className="text-sm mt-1">
                    Deleting your account will permanently remove:
                  </div>
                </div>
              </div>

              <div className="bg-base-200 rounded-lg p-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-error rounded-full"></span>
                    Your profile and display name
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-error rounded-full"></span>
                    All cosplay photos and media
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-error rounded-full"></span>
                    Competition history and credentials
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-error rounded-full"></span>
                    Badges and achievements
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-error rounded-full"></span>
                    All account data and settings
                  </li>
                </ul>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Type <span className="font-bold">&quot;Delete my account&quot;</span>{" "}
                    to continue:
                  </span>
                </label>
                <input
                  type="text"
                  className={`input input-bordered ${
                    error ? "input-error" : ""
                  }`}
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Delete my account"
                  disabled={loading}
                />
                {error && (
                  <label className="label">
                    <span className="label-text-alt text-error">{error}</span>
                  </label>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={handleClose}
                  className="btn btn-ghost"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleContinue}
                  className="btn btn-error"
                  disabled={loading}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Password Confirmation */}
          {step === 2 && (
            <form onSubmit={handleDeleteAccount} className="p-6 space-y-4">
              <div className="alert alert-error">
                <ExclamationTriangleIcon className="w-6 h-6" />
                <div>
                  <h3 className="font-bold">Final Step</h3>
                  <p className="text-sm">
                    Enter your password to permanently delete your account.
                  </p>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Enter your password:
                  </span>
                </label>
                <input
                  type="password"
                  className={`input input-bordered ${
                    error ? "input-error" : ""
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your current password"
                  required
                  disabled={loading}
                />
                {error && (
                  <label className="label">
                    <span className="label-text-alt text-error">{error}</span>
                  </label>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn btn-ghost"
                  disabled={loading}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn btn-error"
                  disabled={loading || !password}
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Deleting Account...
                    </>
                  ) : (
                    "Delete My Account Forever"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default DeleteAccountModal;
