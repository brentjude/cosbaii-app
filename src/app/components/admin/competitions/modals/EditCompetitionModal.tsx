"use client";

import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

type CompetitionType = "GENERAL" | "ARMOR" | "CLOTH" | "SINGING";
type RivalryType = "SOLO" | "DUO" | "GROUP";
type CompetitionLevel =
  | "BARANGAY"
  | "LOCAL"
  | "REGIONAL"
  | "NATIONAL"
  | "WORLDWIDE";
type CompetitionStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "ACCEPTED"
  | "ONGOING"
  | "COMPLETED"
  | "REJECTED"
  | "CANCELLED";

interface Competition {
  id: number;
  name: string;
  description: string | null;
  eventDate: string;
  location: string | null;
  organizer: string | null;
  competitionType: CompetitionType;
  rivalryType: RivalryType;
  level: CompetitionLevel;
  logoUrl: string | null;
  eventUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  referenceLinks: string | null;
  status: CompetitionStatus;
  submittedById: number;
  submittedBy: {
    id: number;
    name: string | null;
    email: string;
    username: string | null;
    role: string;
  };
  reviewedById: number | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    participants: number;
    awards: number;
  };
}

interface EditCompetitionData {
  name: string;
  description: string | null;
  eventDate: string;
  location: string | null;
  organizer: string | null;
  competitionType: CompetitionType;
  rivalryType: RivalryType;
  level: CompetitionLevel;
  logoUrl: string | null;
  eventUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  referenceLinks: string | null;
}

interface EditCompetitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EditCompetitionData) => void;
  competition: Competition | null;
  loading?: boolean;
  errorMessage?: string | null;
  onClearError?: () => void;
}

const EditCompetitionModal: React.FC<EditCompetitionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  competition,
  loading = false,
  errorMessage = null,
  onClearError,
}) => {
  const [formData, setFormData] = useState<EditCompetitionData>({
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

  const [errors, setErrors] = useState<Partial<EditCompetitionData>>({});

  // Initialize form data when competition changes
  useEffect(() => {
    if (competition) {
      setFormData({
        name: competition.name,
        description: competition.description,
        eventDate: competition.eventDate.split('T')[0], // Convert to date string
        location: competition.location,
        organizer: competition.organizer,
        competitionType: competition.competitionType,
        rivalryType: competition.rivalryType,
        level: competition.level,
        logoUrl: competition.logoUrl,
        eventUrl: competition.eventUrl,
        facebookUrl: competition.facebookUrl,
        instagramUrl: competition.instagramUrl,
        referenceLinks: competition.referenceLinks,
      });
      setErrors({});
    }
  }, [competition]);

  // Clear errors when error message changes
  useEffect(() => {
    if (!errorMessage) {
      setErrors({});
    }
  }, [errorMessage]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
    
    // Clear error for this field
    if (errors[name as keyof EditCompetitionData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {};

  // Required fields
  if (!formData.name.trim()) {
    newErrors.name = "Competition name is required";
  }

  if (!formData.eventDate) {
    newErrors.eventDate = "Event date is required";
  }

  // URL validation (basic)
  const urlFields: (keyof EditCompetitionData)[] = ['logoUrl', 'eventUrl', 'facebookUrl', 'instagramUrl'];
  urlFields.forEach(field => {
        const value = formData[field];
        if (value && !isValidUrl(value)) {
        newErrors[field] = "Please enter a valid URL";
        }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
    };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleClose = () => {
    if (onClearError) {
      onClearError();
    }
    onClose();
  };

  if (!isOpen || !competition) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-base-200">
          <div>
            <h2 className="text-2xl font-bold">Edit Competition</h2>
            <p className="text-base-content/70">
              Update competition information
            </p>
          </div>
          <button
            onClick={handleClose}
            className="btn btn-sm btn-circle btn-ghost"
            disabled={loading}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mx-6 mt-4">
            <div className="alert alert-error">
              <span>{errorMessage}</span>
              {onClearError && (
                <button
                  onClick={onClearError}
                  className="btn btn-sm btn-ghost"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            {/* Competition Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Competition Name <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
                placeholder="Enter competition name"
                required
              />
              {errors.name && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.name}</span>
                </label>
              )}
            </div>

            {/* Description */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Description</span>
              </label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                className="textarea textarea-bordered h-24"
                placeholder="Enter competition description (optional)"
              />
            </div>

            {/* Event Date */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Event Date <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleInputChange}
                className={`input input-bordered ${errors.eventDate ? 'input-error' : ''}`}
                required
              />
              {errors.eventDate && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.eventDate}</span>
                </label>
              )}
            </div>

            {/* Location and Organizer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Location</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location || ""}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  placeholder="Competition venue (optional)"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Organizer</span>
                </label>
                <input
                  type="text"
                  name="organizer"
                  value={formData.organizer || ""}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  placeholder="Event organizer (optional)"
                />
              </div>
            </div>
          </div>

          {/* Competition Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Competition Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Competition Type */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Competition Type</span>
                </label>
                <select
                  name="competitionType"
                  value={formData.competitionType}
                  onChange={handleInputChange}
                  className="select select-bordered"
                >
                  <option value="GENERAL">General</option>
                  <option value="ARMOR">Armor</option>
                  <option value="CLOTH">Cloth</option>
                  <option value="SINGING">Singing</option>
                </select>
              </div>

              {/* Rivalry Type */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Rivalry Type</span>
                </label>
                <select
                  name="rivalryType"
                  value={formData.rivalryType}
                  onChange={handleInputChange}
                  className="select select-bordered"
                >
                  <option value="SOLO">Solo</option>
                  <option value="DUO">Duo</option>
                  <option value="GROUP">Group</option>
                </select>
              </div>

              {/* Level */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Level</span>
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="select select-bordered"
                >
                  <option value="BARANGAY">Barangay</option>
                  <option value="LOCAL">Local</option>
                  <option value="REGIONAL">Regional</option>
                  <option value="NATIONAL">National</option>
                  <option value="WORLDWIDE">Worldwide</option>
                </select>
              </div>
            </div>
          </div>

          {/* Media & References */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Media & References</h3>
            
            {/* Logo URL */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Logo URL</span>
              </label>
              <input
                type="url"
                name="logoUrl"
                value={formData.logoUrl || ""}
                onChange={handleInputChange}
                className={`input input-bordered ${errors.logoUrl ? 'input-error' : ''}`}
                placeholder="https://example.com/logo.png"
              />
              {errors.logoUrl && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.logoUrl}</span>
                </label>
              )}
            </div>

            {/* Social Media Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Event Website URL</span>
                </label>
                <input
                  type="url"
                  name="eventUrl"
                  value={formData.eventUrl || ""}
                  onChange={handleInputChange}
                  className={`input input-bordered ${errors.eventUrl ? 'input-error' : ''}`}
                  placeholder="https://example.com/event"
                />
                {errors.eventUrl && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.eventUrl}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Facebook URL</span>
                </label>
                <input
                  type="url"
                  name="facebookUrl"
                  value={formData.facebookUrl || ""}
                  onChange={handleInputChange}
                  className={`input input-bordered ${errors.facebookUrl ? 'input-error' : ''}`}
                  placeholder="https://facebook.com/event"
                />
                {errors.facebookUrl && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.facebookUrl}</span>
                  </label>
                )}
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Instagram URL</span>
              </label>
              <input
                type="url"
                name="instagramUrl"
                value={formData.instagramUrl || ""}
                onChange={handleInputChange}
                className={`input input-bordered ${errors.instagramUrl ? 'input-error' : ''}`}
                placeholder="https://instagram.com/event"
              />
              {errors.instagramUrl && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.instagramUrl}</span>
                </label>
              )}
            </div>

            {/* Reference Links */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Additional Reference Links</span>
              </label>
              <textarea
                name="referenceLinks"
                value={formData.referenceLinks || ""}
                onChange={handleInputChange}
                className="textarea textarea-bordered h-20"
                placeholder="Additional links separated by new lines (optional)"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-base-200">
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
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Updating...
                </>
              ) : (
                "Update Competition"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCompetitionModal;