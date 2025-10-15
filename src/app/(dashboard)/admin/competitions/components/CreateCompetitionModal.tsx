"use client";

import { useState, useEffect } from "react";
import {
  XMarkIcon,
  ExclamationTriangleIcon,
  LinkIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import {
  CompetitionType,
  RivalryType,
  CompetitionLevel,
  NewCompetitionData,
} from "@/types/competition";

interface CreateCompetitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NewCompetitionData) => Promise<void>;
  loading?: boolean;
  errorMessage?: string | null;
  onClearError?: () => void;
}

const CreateCompetitionModal = ({
  isOpen,
  onClose,
  onSave,
  loading = false,
  errorMessage,
  onClearError,
}: CreateCompetitionModalProps) => {
  const [formData, setFormData] = useState<NewCompetitionData>({
    name: "",
    description: null,
    eventDate: "",
    location: null,
    organizer: null,
    competitionType: "GENERAL",
    rivalryType: "SOLO",
    level: "LOCAL",
    logoUrl: null,
    eventUrl: null,
    facebookUrl: null,
    instagramUrl: null,
    referenceLinks: null,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof NewCompetitionData, string>>>({});

  const competitionTypeOptions: { value: CompetitionType; label: string }[] = [
    { value: "GENERAL", label: "General" },
    { value: "ARMOR", label: "Armor Cosplay" },
    { value: "CLOTH", label: "Cloth Cosplay" },
    { value: "SINGING", label: "Singing Competition" },
  ];

  const rivalryTypeOptions: { value: RivalryType; label: string }[] = [
    { value: "SOLO", label: "Solo" },
    { value: "DUO", label: "Duo" },
    { value: "GROUP", label: "Group" },
  ];

  const levelOptions: { value: CompetitionLevel; label: string }[] = [
    { value: "BARANGAY", label: "Barangay" },
    { value: "LOCAL", label: "Local" },
    { value: "REGIONAL", label: "Regional" },
    { value: "NATIONAL", label: "National" },
    { value: "WORLDWIDE", label: "Worldwide" },
  ];

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        description: null,
        eventDate: "",
        location: null,
        organizer: null,
        competitionType: "GENERAL",
        rivalryType: "SOLO",
        level: "LOCAL",
        logoUrl: null,
        eventUrl: null,
        facebookUrl: null,
        instagramUrl: null,
        referenceLinks: null,
      });
      setErrors({});
      onClearError?.();
    }
  }, [isOpen, onClearError]);

  // URL validation helper
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof NewCompetitionData, string>> = {};

    // Basic validation
    if (!formData.name.trim()) {
      newErrors.name = "Competition name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Competition name must be at least 3 characters";
    } else if (formData.name.length > 200) {
      newErrors.name = "Competition name must be less than 200 characters";
    }

    if (!formData.eventDate) {
      newErrors.eventDate = "Event date is required";
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = "Description must be less than 1000 characters";
    }

    if (formData.location && formData.location.length > 200) {
      newErrors.location = "Location must be less than 200 characters";
    }

    if (formData.organizer && formData.organizer.length > 200) {
      newErrors.organizer = "Organizer name must be less than 200 characters";
    }

    // URL validations
    if (
      formData.logoUrl &&
      formData.logoUrl.trim() &&
      !isValidUrl(formData.logoUrl.trim())
    ) {
      newErrors.logoUrl = "Logo URL must be a valid URL";
    }

    if (
      formData.eventUrl &&
      formData.eventUrl.trim() &&
      !isValidUrl(formData.eventUrl.trim())
    ) {
      newErrors.eventUrl = "Event URL must be a valid URL";
    }

    if (
      formData.facebookUrl &&
      formData.facebookUrl.trim() &&
      !isValidUrl(formData.facebookUrl.trim())
    ) {
      newErrors.facebookUrl = "Facebook URL must be a valid URL";
    }

    if (
      formData.instagramUrl &&
      formData.instagramUrl.trim() &&
      !isValidUrl(formData.instagramUrl.trim())
    ) {
      newErrors.instagramUrl = "Instagram URL must be a valid URL";
    }

    if (formData.referenceLinks && formData.referenceLinks.length > 1000) {
      newErrors.referenceLinks =
        "Reference links must be less than 1000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!loading && validateForm()) {
      const cleanedData: NewCompetitionData = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description?.trim() || null,
        location: formData.location?.trim() || null,
        organizer: formData.organizer?.trim() || null,
        logoUrl: formData.logoUrl?.trim() || null,
        eventUrl: formData.eventUrl?.trim() || null,
        facebookUrl: formData.facebookUrl?.trim() || null,
        instagramUrl: formData.instagramUrl?.trim() || null,
        referenceLinks: formData.referenceLinks?.trim() || null,
      };
      onSave(cleanedData);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClearError?.();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">Add New Competition</h3>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={handleClose}
            disabled={loading}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="alert alert-error mb-4">
            <ExclamationTriangleIcon className="w-6 h-6" />
            <div>
              <p className="font-medium">Failed to create competition</p>
              <p className="text-sm">{errorMessage}</p>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-ghost ml-auto"
              onClick={() => onClearError?.()}
              disabled={loading}
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="space-y-6">
          {/* Competition Name */}
          <div>
            <label className="label">
              <span className="label-text font-medium">
                Competition Name <span className="text-error">*</span>
              </span>
              <span className="label-text-alt text-base-content/60">
                {formData.name.length}/200
              </span>
            </label>
            <input
              type="text"
              className={`input input-bordered w-full ${
                errors.name ? "input-error" : ""
              }`}
              placeholder="Enter competition name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              maxLength={200}
              disabled={loading}
            />
            {errors.name && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.name}</span>
              </label>
            )}
          </div>

          {/* Competition Type, Rivalry Type, and Level */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">
                <span className="label-text font-medium">
                  Competition Type <span className="text-error">*</span>
                </span>
              </label>
              <select
                className="select select-bordered w-full"
                value={formData.competitionType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    competitionType: e.target.value as CompetitionType,
                  })
                }
                disabled={loading}
              >
                {competitionTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium">
                  Rivalry Type <span className="text-error">*</span>
                </span>
              </label>
              <select
                className="select select-bordered w-full"
                value={formData.rivalryType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rivalryType: e.target.value as RivalryType,
                  })
                }
                disabled={loading}
              >
                {rivalryTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium">
                  Competition Level <span className="text-error">*</span>
                </span>
              </label>
              <select
                className="select select-bordered w-full"
                value={formData.level}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    level: e.target.value as CompetitionLevel,
                  })
                }
                disabled={loading}
              >
                {levelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Logo URL */}
          <div>
            <label className="label">
              <span className="label-text font-medium flex items-center gap-1">
                <PhotoIcon className="w-4 h-4" />
                Competition Logo URL
              </span>
            </label>
            <input
              type="url"
              className={`input input-bordered w-full ${
                errors.logoUrl ? "input-error" : ""
              }`}
              placeholder="https://example.com/logo.jpg (optional)"
              value={formData.logoUrl || ""}
              onChange={(e) =>
                setFormData({ ...formData, logoUrl: e.target.value || null })
              }
              disabled={loading}
            />
            {errors.logoUrl && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.logoUrl}
                </span>
              </label>
            )}
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                URL to competition logo, poster, or promotional image
              </span>
            </label>
          </div>

          {/* Description */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Description</span>
              <span className="label-text-alt text-base-content/60">
                {(formData.description || "").length}/1000
              </span>
            </label>
            <textarea
              className={`textarea textarea-bordered w-full h-24 ${
                errors.description ? "textarea-error" : ""
              }`}
              placeholder="Describe the competition (optional)"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value || null,
                })
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Event Date */}
            <div>
              <label className="label">
                <span className="label-text font-medium">
                  Event Date <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="date"
                className={`input input-bordered w-full ${
                  errors.eventDate ? "input-error" : ""
                }`}
                value={formData.eventDate}
                onChange={(e) =>
                  setFormData({ ...formData, eventDate: e.target.value })
                }
                disabled={loading}
              />
              {errors.eventDate && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.eventDate}
                  </span>
                </label>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Location</span>
                <span className="label-text-alt text-base-content/60">
                  {(formData.location || "").length}/200
                </span>
              </label>
              <input
                type="text"
                className={`input input-bordered w-full ${
                  errors.location ? "input-error" : ""
                }`}
                placeholder="Competition venue (optional)"
                value={formData.location || ""}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value || null })
                }
                maxLength={200}
                disabled={loading}
              />
              {errors.location && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.location}
                  </span>
                </label>
              )}
            </div>
          </div>

          {/* Organizer */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Organizer</span>
              <span className="label-text-alt text-base-content/60">
                {(formData.organizer || "").length}/200
              </span>
            </label>
            <input
              type="text"
              className={`input input-bordered w-full ${
                errors.organizer ? "input-error" : ""
              }`}
              placeholder="Competition organizer (optional)"
              value={formData.organizer || ""}
              onChange={(e) =>
                setFormData({ ...formData, organizer: e.target.value || null })
              }
              maxLength={200}
              disabled={loading}
            />
            {errors.organizer && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.organizer}
                </span>
              </label>
            )}
          </div>

          {/* Reference Links Section */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <LinkIcon className="w-5 h-5" />
              Reference Links for Verification
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Event URL */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">
                    Official Event URL
                  </span>
                </label>
                <input
                  type="url"
                  className={`input input-bordered w-full ${
                    errors.eventUrl ? "input-error" : ""
                  }`}
                  placeholder="https://example.com/event (optional)"
                  value={formData.eventUrl || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      eventUrl: e.target.value || null,
                    })
                  }
                  disabled={loading}
                />
                {errors.eventUrl && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.eventUrl}
                    </span>
                  </label>
                )}
              </div>

              {/* Facebook URL */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">
                    Facebook Page/Event
                  </span>
                </label>
                <input
                  type="url"
                  className={`input input-bordered w-full ${
                    errors.facebookUrl ? "input-error" : ""
                  }`}
                  placeholder="https://facebook.com/... (optional)"
                  value={formData.facebookUrl || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      facebookUrl: e.target.value || null,
                    })
                  }
                  disabled={loading}
                />
                {errors.facebookUrl && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.facebookUrl}
                    </span>
                  </label>
                )}
              </div>

              {/* Instagram URL */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Instagram Page</span>
                </label>
                <input
                  type="url"
                  className={`input input-bordered w-full ${
                    errors.instagramUrl ? "input-error" : ""
                  }`}
                  placeholder="https://instagram.com/... (optional)"
                  value={formData.instagramUrl || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      instagramUrl: e.target.value || null,
                    })
                  }
                  disabled={loading}
                />
                {errors.instagramUrl && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.instagramUrl}
                    </span>
                  </label>
                )}
              </div>

              {/* Additional Reference Links */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">
                    Additional References
                  </span>
                  <span className="label-text-alt text-base-content/60">
                    {(formData.referenceLinks || "").length}/1000
                  </span>
                </label>
                <textarea
                  className={`textarea textarea-bordered w-full h-20 ${
                    errors.referenceLinks ? "textarea-error" : ""
                  }`}
                  placeholder="Additional URLs or references (one per line, optional)"
                  value={formData.referenceLinks || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      referenceLinks: e.target.value || null,
                    })
                  }
                  maxLength={1000}
                  disabled={loading}
                />
                {errors.referenceLinks && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.referenceLinks}
                    </span>
                  </label>
                )}
              </div>
            </div>
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
            type="button"
            disabled={loading || !formData.name.trim() || !formData.eventDate}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Creating Competition...
              </>
            ) : (
              "Create Competition"
            )}
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={handleClose} disabled={loading}>
          close
        </button>
      </form>
    </dialog>
  );
};

export default CreateCompetitionModal;