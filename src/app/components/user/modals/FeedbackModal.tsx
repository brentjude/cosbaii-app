// src/app/components/user/modals/FeedbackModal.tsx
"use client";

import { useState } from "react";
import {
  XMarkIcon,
  BugAntIcon,
  LightBulbIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import type { FeedbackFormData, FeedbackType } from "@/types";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FeedbackFormData) => Promise<boolean>;
  loading?: boolean;
}

const FeedbackModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}: FeedbackModalProps) => {
  const [formData, setFormData] = useState<FeedbackFormData>({
    type: "BUG",
    title: "",
    description: "",
  });

  const [errors, setErrors] = useState<Partial<FeedbackFormData>>({});
  const [showSuccess, setShowSuccess] = useState(false); // ✅ Add success state

  const feedbackTypes = [
    {
      value: "BUG" as FeedbackType,
      label: "Bug Report",
      icon: BugAntIcon,
      description: "Something isn't working as expected",
      color: "text-red-600 bg-red-100",
    },
    {
      value: "FEATURE_REQUEST" as FeedbackType,
      label: "Feature Request",
      icon: LightBulbIcon,
      description: "Suggest a new feature or enhancement",
      color: "text-blue-600 bg-blue-100",
    },
    {
      value: "IMPROVEMENT" as FeedbackType,
      label: "Improvement",
      icon: WrenchScrewdriverIcon,
      description: "Suggest how to make something better",
      color: "text-green-600 bg-green-100",
    },
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<FeedbackFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    } else if (formData.description.length > 1000) {
      newErrors.description = "Description must be less than 1000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || loading) return;

    const success = await onSubmit(formData);

    if (success) {
      // ✅ Show success state instead of alert
      setShowSuccess(true);

      // Reset form data
      setFormData({
        type: "BUG",
        title: "",
        description: "",
      });
      setErrors({});
    }
  };

  const handleClose = () => {
    if (!loading) {
      // ✅ Reset all states
      setFormData({
        type: "BUG",
        title: "",
        description: "",
      });
      setErrors({});
      setShowSuccess(false);
      onClose();
    }
  };

  const handleBackToForm = () => {
    setShowSuccess(false);
  };

  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-2xl">
        {/* ✅ Conditional rendering: Success state or Form */}
        {showSuccess ? (
          // Success State
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-12 h-12 text-success" />
            </div>

            <h3 className="font-bold text-2xl text-success mb-4">
              Feedback Submitted!
            </h3>

            <p className="text-base-content/70 mb-8 max-w-md mx-auto">
              Thank you for your feedback! We appreciate you taking the time to
              help us improve Cosbaii. Our team will review your submission and
              get back to you if needed.
            </p>

            <div className="flex gap-3 justify-center">
              <button className="btn btn-ghost" onClick={handleBackToForm}>
                Submit Another
              </button>
              <button className="btn btn-primary" onClick={handleClose}>
                Close
              </button>
            </div>
          </div>
        ) : (
          // Form State
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Submit Feedback</h3>
              <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={handleClose}
                disabled={loading}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Feedback Type Selection */}
            <div className="mb-6">
              <label className="label">
                <span className="label-text font-medium mb-4">
                  Feedback Type
                </span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {feedbackTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <div
                      key={type.value}
                      className={`card rounded-md cursor-pointer transition-all border-2 ${
                        formData.type === type.value
                          ? "border-primary bg-primary/10"
                          : "border-base-300 hover:border-primary/50"
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, type: type.value })
                      }
                    >
                      <div className="card-body p-4 text-center">
                        <div
                          className={`w-12 h-12 rounded-full ${type.color} flex items-center justify-center mx-auto mb-2`}
                        >
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <h4 className="font-semibold text-sm">{type.label}</h4>
                        <p className="text-xs text-base-content/70">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div className="mb-4">
              <label className="label">
                <span className="label-text font-medium">
                  Title <span className="text-error">*</span>
                </span>
                <span className="label-text-alt text-base-content/60">
                  {formData.title.length}/100
                </span>
              </label>
              <input
                type="text"
                className={`input input-bordered rounded-md w-full ${
                  errors.title ? "input-error" : ""
                }`}
                placeholder="Brief summary of your feedback"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                maxLength={100}
                disabled={loading}
              />
              {errors.title && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.title}
                  </span>
                </label>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="label">
                <span className="label-text font-medium">
                  Description <span className="text-error">*</span>
                </span>
                <span className="label-text-alt text-base-content/60">
                  {formData.description.length}/1000
                </span>
              </label>
              <textarea
                className={`textarea textarea-bordered rounded-md w-full h-32 ${
                  errors.description ? "textarea-error" : ""
                }`}
                placeholder="Provide detailed information about your feedback..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                maxLength={1000}
                disabled={loading}
              />
              {errors.description && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.description}
                  </span>
                </label>
              )}
            </div>

            {/* Guidelines */}
            <div className="alert alert-info rounded-lg mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="font-bold">Feedback Guidelines:</h3>
                <div className="text-sm mt-1">
                  • Be specific and provide clear details
                  <br />
                  • Include steps to reproduce if reporting a bug
                  <br />• Your feedback helps us improve Cosbaii for everyone!
                </div>
              </div>
            </div>

            {/* Actions */}
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
                onClick={handleSubmit}
                disabled={
                  loading ||
                  !formData.title.trim() ||
                  !formData.description.trim()
                }
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Submitting...
                  </>
                ) : (
                  "Submit Feedback"
                )}
              </button>
            </div>
          </>
        )}
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

export default FeedbackModal;
