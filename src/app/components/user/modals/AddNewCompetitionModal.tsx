// Update: src/app/components/user/modals/AddNewCompetitionModal.tsx
import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const AddNewCompetitionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    eventDate: "",
    location: "",
    organizer: "",
    competitionType: "GENERAL",
    rivalryType: "SOLO",
    level: "LOCAL",
    logoUrl: "",
    eventUrl: "",
    facebookUrl: "",
    instagramUrl: "",
    referenceLinks: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const competitionTypes = [
    { value: "GENERAL", label: "General" },
    { value: "ARMOR", label: "Armor" },
    { value: "CLOTH", label: "Cloth" },
    { value: "SINGING", label: "Singing" },
  ];

  const rivalryTypes = [
    { value: "SOLO", label: "Solo" },
    { value: "DUO", label: "Duo" },
    { value: "GROUP", label: "Group" },
  ];

  const levels = [
    { value: "BARANGAY", label: "Barangay" },
    { value: "LOCAL", label: "Local" },
    { value: "REGIONAL", label: "Regional" },
    { value: "NATIONAL", label: "National" },
    { value: "WORLDWIDE", label: "Worldwide" },
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // ✅ Only validate essential required fields
    if (!formData.name.trim()) {
      newErrors.name = "Competition name is required";
    } else if (formData.name.length > 200) {
      newErrors.name = "Competition name must be less than 200 characters";
    }

    if (!formData.eventDate) {
      newErrors.eventDate = "Event date is required";
    }

    // ✅ Validate dropdown selections (these have defaults, but just to be safe)
    if (!formData.competitionType) {
      newErrors.competitionType = "Competition type is required";
    }

    if (!formData.rivalryType) {
      newErrors.rivalryType = "Rivalry type is required";
    }

    if (!formData.level) {
      newErrors.level = "Level is required";
    }

    // ✅ Optional field validations (only if provided)
    const validateUrl = (url: string, fieldName: string) => {
      if (url.trim()) {
        try {
          new URL(url.trim());
        } catch {
          newErrors[fieldName] = "Please enter a valid URL";
        }
      }
    };

    validateUrl(formData.logoUrl, 'logoUrl');
    validateUrl(formData.eventUrl, 'eventUrl');
    validateUrl(formData.facebookUrl, 'facebookUrl');
    validateUrl(formData.instagramUrl, 'instagramUrl');

    // Optional field length validations
    if (formData.description && formData.description.length > 1000) {
      newErrors.description = "Description must be less than 1000 characters";
    }

    if (formData.location && formData.location.length > 200) {
      newErrors.location = "Location must be less than 200 characters";
    }

    if (formData.organizer && formData.organizer.length > 200) {
      newErrors.organizer = "Organizer name must be less than 200 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update: src/app/components/user/modals/AddNewCompetitionModal.tsx
const handleSubmit = async () => {
  if (!validateForm()) return;

  setLoading(true);
  try {
      // ✅ Clean the form data before sending (handle empty strings properly)
      const cleanedData = {
        name: formData.name.trim(),
        eventDate: formData.eventDate,
        competitionType: formData.competitionType,
        rivalryType: formData.rivalryType,
        level: formData.level,
        // Optional fields - send as null if empty
        description: formData.description.trim() || null,
        location: formData.location.trim() || null,
        organizer: formData.organizer.trim() || null,
        logoUrl: formData.logoUrl.trim() || null,
        eventUrl: formData.eventUrl.trim() || null,
        facebookUrl: formData.facebookUrl.trim() || null,
        instagramUrl: formData.instagramUrl.trim() || null,
        referenceLinks: formData.referenceLinks.trim() || null,
      };

      console.log('Sending competition data:', cleanedData);

      const response = await fetch('/api/user/competitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData),
      });

      const responseData = await response.json();
      console.log('API Response:', responseData);

      if (response.ok) {
        console.log('Competition submitted successfully!');
        console.log('Notification created:', responseData.notificationCreated);
        
        onSuccess();
        onClose();
        
        // ✅ Add a success message to help with debugging
        if (responseData.notificationCreated) {
          console.log('✅ Notification was created successfully');
        } else {
          console.warn('⚠️ Notification was not created');
        }
      } else {
        console.error('API Error:', responseData);
        setErrors({ 
          submit: responseData.error || "Failed to submit competition" 
        });
      }
    } catch (error) {
      console.error('Network Error:', error);
      setErrors({ submit: "Failed to submit competition" });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      eventDate: "",
      location: "",
      organizer: "",
      competitionType: "GENERAL",
      rivalryType: "SOLO",
      level: "LOCAL",
      logoUrl: "",
      eventUrl: "",
      facebookUrl: "",
      instagramUrl: "",
      referenceLinks: "",
    });
    setErrors({});
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-60" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed inset-4 z-60 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4">
          <div className="bg-base-100 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-base-200 bg-base-100">
              <div>
                <h2 className="text-2xl font-bold">Submit New Competition</h2>
                <p className="text-base-content/70">Competition will be reviewed by admins before being approved</p>
              </div>
              <button
                onClick={onClose}
                className="btn btn-sm btn-circle btn-ghost"
                disabled={loading}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(80vh-140px)]">
              <div className="p-6 space-y-6">

                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b border-base-200 pb-2">Basic Information</h3>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Competition Name *</span>
                    </label>
                    <input
                      type="text"
                      className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
                      placeholder="Enter competition name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={loading}
                    />
                    {errors.name && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.name}</span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Event Date *</span>
                    </label>
                    <input
                      type="date"
                      className={`input input-bordered ${errors.eventDate ? 'input-error' : ''}`}
                      value={formData.eventDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                      disabled={loading}
                    />
                    {errors.eventDate && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.eventDate}</span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Description</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered h-20"
                      placeholder="Describe the competition (optional)"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      disabled={loading}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Location</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        placeholder="Competition venue (optional)"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        disabled={loading}
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Organizer</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        placeholder="Event organizer (optional)"
                        value={formData.organizer}
                        onChange={(e) => setFormData(prev => ({ ...prev, organizer: e.target.value }))}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Competition Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b border-base-200 pb-2">Competition Details *</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Competition Type *</span>
                      </label>
                      <select
                        className={`select select-bordered ${errors.competitionType ? 'select-error' : ''}`}
                        value={formData.competitionType}
                        onChange={(e) => setFormData(prev => ({ ...prev, competitionType: e.target.value }))}
                        disabled={loading}
                      >
                        {competitionTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      {errors.competitionType && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.competitionType}</span>
                        </label>
                      )}
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Rivalry Type *</span>
                      </label>
                      <select
                        className={`select select-bordered ${errors.rivalryType ? 'select-error' : ''}`}
                        value={formData.rivalryType}
                        onChange={(e) => setFormData(prev => ({ ...prev, rivalryType: e.target.value }))}
                        disabled={loading}
                      >
                        {rivalryTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      {errors.rivalryType && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.rivalryType}</span>
                        </label>
                      )}
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Level *</span>
                      </label>
                      <select
                        className={`select select-bordered ${errors.level ? 'select-error' : ''}`}
                        value={formData.level}
                        onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                        disabled={loading}
                      >
                        {levels.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                      {errors.level && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.level}</span>
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* Reference Links */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b border-base-200 pb-2">Reference Links (Optional)</h3>
                  <p className="text-sm text-base-content/70">
                    These links help admins verify the competition&apos;s authenticity.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Logo URL</span>
                      </label>
                      <input
                        type="url"
                        className={`input input-bordered ${errors.logoUrl ? 'input-error' : ''}`}
                        placeholder="https://example.com/logo.png"
                        value={formData.logoUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
                        disabled={loading}
                      />
                      {errors.logoUrl && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.logoUrl}</span>
                        </label>
                      )}
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Event Website</span>
                      </label>
                      <input
                        type="url"
                        className={`input input-bordered ${errors.eventUrl ? 'input-error' : ''}`}
                        placeholder="https://example.com/event"
                        value={formData.eventUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, eventUrl: e.target.value }))}
                        disabled={loading}
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
                        className={`input input-bordered ${errors.facebookUrl ? 'input-error' : ''}`}
                        placeholder="https://facebook.com/event"
                        value={formData.facebookUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, facebookUrl: e.target.value }))}
                        disabled={loading}
                      />
                      {errors.facebookUrl && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.facebookUrl}</span>
                        </label>
                      )}
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Instagram URL</span>
                      </label>
                      <input
                        type="url"
                        className={`input input-bordered ${errors.instagramUrl ? 'input-error' : ''}`}
                        placeholder="https://instagram.com/event"
                        value={formData.instagramUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, instagramUrl: e.target.value }))}
                        disabled={loading}
                      />
                      {errors.instagramUrl && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.instagramUrl}</span>
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Additional Reference Links</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered h-20"
                      placeholder="Additional links separated by new lines (optional)"
                      value={formData.referenceLinks}
                      onChange={(e) => setFormData(prev => ({ ...prev, referenceLinks: e.target.value }))}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="alert alert-error">
                    <span>{errors.submit}</span>
                  </div>
                )}

                {/* Info Alert */}
                <div className="alert alert-info">
                  <div className="text-sm">
                    <p className="font-medium">Please note:</p>
                    <ul className="mt-1 space-y-1">
                      <li>• Your competition will be reviewed by our admin team</li>
                      <li>• You&apos;ll receive a notification once it&apos;s approved</li>
                      <li>• Only name, date, and competition details are required</li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-base-200 bg-base-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Submitting...
                  </>
                ) : (
                  "Submit for Review"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddNewCompetitionModal;