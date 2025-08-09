// Update: src/app/components/user/modals/EditProfileModal.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { XMarkIcon, CameraIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import FeaturedCosplaysEditor from "./FeaturedCosplaysEditor";
import { useCloudinaryUpload } from "@/hooks/common/useCloudinaryUpload";

// In both EditProfileModal.tsx and page.tsx
import { EditProfileData, SkillLevel, CosplayerType, FeaturedItem } from "@/types/profile";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EditProfileData) => void;
  profileData: EditProfileData | null;
  loading?: boolean;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  profileData,
  loading = false,
}) => {
  const [formData, setFormData] = useState<EditProfileData>({
    displayName: "",
    bio: "",
    profilePicture: "/images/default-avatar.png",
    coverImage: "/images/default-cover.jpg",
    cosplayerType: "HOBBY",
    yearsOfExperience: null,
    specialization: "",
    skillLevel: "beginner",
    featured: [],
  });

  const [errors, setErrors] = useState<Partial<EditProfileData>>({});
  const [showFeaturedEditor, setShowFeaturedEditor] = useState(false);
  const [imageUploading, setImageUploading] = useState<{
    profile: boolean;
    cover: boolean;
  }>({ profile: false, cover: false });

  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const { uploadImage, uploading, error: uploadError } = useCloudinaryUpload();

  const specializationOptions = [
    "Sewing & Tailoring",
    "Armor Crafting", 
    "Makeup & SFX",
    "Prop Making",
    "Wig Styling",
    "Photography",
    "Performance",
    "General Crafting",
    "Other",
  ];

  // Initialize form data when profileData changes
  useEffect(() => {
    if (profileData) {
      setFormData(profileData);
      setErrors({});
    }
  }, [profileData]);

  // Handle image upload with Cloudinary
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "cover"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageUploading(prev => ({ ...prev, [type]: true }));

    try {
      const uploadResult = await uploadImage(file, {
        uploadPreset: 'cosbaii-profiles', // Create this preset in Cloudinary
        folder: `cosbaii/profiles/${type}`,
        onSuccess: (result) => {
          console.log('Upload successful:', result);
        },
        onError: (error) => {
          console.error('Upload error:', error);
        }
      });

      if (uploadResult) {
        // Update form data with new image URL
        setFormData(prev => ({
          ...prev,
          [type === "profile" ? "profilePicture" : "coverImage"]: uploadResult.url,
        }));

        // Save to database
        const response = await fetch('/api/upload/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageUrl: uploadResult.url,
            imageType: type,
            publicId: uploadResult.publicId,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save image to database');
        }

        const data = await response.json();
        console.log('Image saved to database:', data);
      }

    } catch (error) {
      console.error(`Error uploading ${type} image:`, error);
      alert(`Failed to upload ${type} image. Please try again.`);
    } finally {
      setImageUploading(prev => ({ ...prev, [type]: false }));
      // Clear the input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  // Form validation (removed displayName validation)
  const validateForm = (): boolean => {
    const newErrors: Partial<EditProfileData> = {};

    if (formData.bio.length > 160) {
      newErrors.bio = "Bio must be 160 characters or less";
    }

    if (!formData.specialization) {
      newErrors.specialization = "Please select a specialization";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const handleFeaturedSave = (featured: FeaturedItem[]) => {
    setFormData(prev => ({ ...prev, featured }));
    setShowFeaturedEditor(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={handleClose} />
      
      {/* Modal */}
      <div className="fixed inset-4 z-50 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4">
          <div className="bg-base-100 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden">
            
            {/* Fixed Header */}
            <div className="flex justify-between items-center p-6 border-b border-base-200 bg-base-100">
              <div>
                <h2 className="text-2xl font-bold">Edit Profile</h2>
                <p className="text-base-content/70">Update your basic profile information</p>
              </div>
              <button
                onClick={handleClose}
                className="btn btn-sm btn-circle btn-ghost"
                disabled={loading || uploading}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Upload Error Display */}
            {uploadError && (
              <div className="mx-6 mt-4 alert alert-error">
                <span>{uploadError}</span>
              </div>
            )}

            {/* Scrollable Content */}
            <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(95vh-140px)]">
              <div className="p-6 space-y-8">
                
                {/* Profile Images Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold border-b border-base-200 pb-2">Profile Images</h3>
                  
                  {/* Cover Image */}
                  <div className="space-y-2">
                    <label className="label">
                      <span className="label-text font-medium">Cover Image</span>
                    </label>
                    <div 
                      className="h-40 bg-base-200 rounded-lg overflow-hidden relative group cursor-pointer border-2 border-dashed border-base-300 hover:border-primary"
                      onClick={() => !imageUploading.cover && coverInputRef.current?.click()}
                    >
                      <Image
                        src={formData.coverImage}
                        alt="Cover"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="text-center text-white">
                          {imageUploading.cover ? (
                            <>
                              <span className="loading loading-spinner loading-lg mb-2"></span>
                              <p className="text-sm">Uploading cover image...</p>
                            </>
                          ) : (
                            <>
                              <CameraIcon className="w-8 h-8 mx-auto mb-2" />
                              <p className="text-sm">Click to change cover</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "cover")}
                      className="hidden"
                      disabled={imageUploading.cover}
                    />
                  </div>

                  {/* Profile Picture */}
                  <div className="space-y-2">
                    <label className="label">
                      <span className="label-text font-medium">Profile Picture</span>
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-base-300">
                          <Image
                            src={formData.profilePicture}
                            alt="Profile"
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          className="absolute bottom-0 right-0 btn btn-circle btn-sm btn-primary"
                          onClick={() => !imageUploading.profile && profileInputRef.current?.click()}
                          disabled={imageUploading.profile}
                        >
                          {imageUploading.profile ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            <CameraIcon className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <div>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => !imageUploading.profile && profileInputRef.current?.click()}
                          disabled={imageUploading.profile}
                        >
                          {imageUploading.profile ? (
                            <>
                              <span className="loading loading-spinner loading-sm"></span>
                              Uploading...
                            </>
                          ) : (
                            "Change Photo"
                          )}
                        </button>
                        <p className="text-xs text-base-content/60 mt-1">
                          JPG, PNG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                    <input
                      ref={profileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "profile")}
                      className="hidden"
                      disabled={imageUploading.profile}
                    />
                  </div>
                </div>

                {/* Rest of your form sections remain the same... */}
                {/* Basic Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold border-b border-base-200 pb-2">Basic Information</h3>
                  
                  {/* Display Name - Read Only with Info */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Display Name</span>
                      <span className="label-text-alt text-info">Can only be changed once every 7 days</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered input-disabled"
                      value={formData.displayName}
                      disabled
                      placeholder="Display name can only be changed in settings"
                    />
                    <label className="label">
                      <span className="label-text-alt text-base-content/60">
                        To change your display name, go to Settings → Account
                      </span>
                    </label>
                  </div>

                  {/* Bio */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Bio</span>
                      <span className="label-text-alt">{formData.bio.length}/160</span>
                    </label>
                    <textarea
                      className={`textarea textarea-bordered h-20 ${errors.bio ? 'textarea-error' : ''}`}
                      value={formData.bio}
                      onChange={(e) => {
                        if (e.target.value.length <= 160) {
                          setFormData(prev => ({ ...prev, bio: e.target.value }));
                        }
                      }}
                      placeholder="Tell us about yourself and your cosplay journey..."
                      maxLength={160}
                    />
                    {errors.bio && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.bio}</span>
                      </label>
                    )}
                  </div>
                </div>

                {/* Cosplayer Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold border-b border-base-200 pb-2">Cosplayer Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Cosplayer Type */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Cosplayer Type</span>
                      </label>
                      <select
                        className="select select-bordered"
                        value={formData.cosplayerType}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          cosplayerType: e.target.value as CosplayerType 
                        }))}
                      >
                        <option value="HOBBY">🎨 Hobby Cosplayer</option>
                        <option value="COMPETITIVE">🏆 Competitive Cosplayer</option>
                        <option value="PROFESSIONAL">💼 Professional Cosplayer</option>
                      </select>
                    </div>

                    {/* Years of Experience */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Years of Experience</span>
                      </label>
                      <select
                        className="select select-bordered"
                        value={formData.yearsOfExperience || ""}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          yearsOfExperience: e.target.value ? parseInt(e.target.value) : null 
                        }))}
                      >
                        <option value="">Select experience</option>
                        <option value="0">Just starting</option>
                        <option value="1">1 year</option>
                        <option value="2">2 years</option>
                        <option value="3">3 years</option>
                        <option value="4">4 years</option>
                        <option value="5">5 years</option>
                        <option value="6">6-10 years</option>
                        <option value="10">10+ years</option>
                      </select>
                    </div>

                    {/* Main Specialization */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Main Specialization *</span>
                      </label>
                      <select
                        className={`select select-bordered ${errors.specialization ? 'select-error' : ''}`}
                        value={formData.specialization}
                        onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                        required
                      >
                        <option value="">Select your main skill</option>
                        {specializationOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors.specialization && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.specialization}</span>
                        </label>
                      )}
                    </div>

                    {/* Skill Level */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Skill Level</span>
                      </label>
                      <select
                        className="select select-bordered"
                        value={formData.skillLevel}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          skillLevel: e.target.value as SkillLevel 
                        }))}
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Featured Cosplays Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-base-200 pb-2">
                    <h3 className="text-lg font-semibold">Featured Cosplays</h3>
                    <span className="text-sm text-base-content/60">
                      {formData.featured.filter(f => f.title || f.imageUrl).length}/3 slots filled
                    </span>
                  </div>
                  
                  <div className="bg-base-200/30 rounded-lg p-4">
                    <p className="text-sm text-base-content/70 mb-3">
                      Showcase your best cosplay work. Select from your competition credentials and add custom details.
                    </p>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => setShowFeaturedEditor(true)}
                    >
                      Edit Featured Cosplays
                    </button>
                  </div>
                  
                  {/* Featured Preview */}
                  {formData.featured.some(f => f.title || f.imageUrl) && (
                    <div className="grid grid-cols-3 gap-2">
                      {formData.featured.map((item, index) => (
                        <div key={index} className="aspect-square bg-base-200 rounded-lg overflow-hidden relative">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.title || `Featured ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-base-content/50">
                              <span className="text-xs">Empty</span>
                            </div>
                          )}
                          {item.title && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-1">
                              <p className="text-xs truncate">{item.title}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Fixed Footer */}
              <div className="p-6 border-t border-base-200 bg-base-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn btn-ghost"
                  disabled={loading || uploading || imageUploading.profile || imageUploading.cover}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || uploading || imageUploading.profile || imageUploading.cover}
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Featured Cosplays Editor */}
      <FeaturedCosplaysEditor
        isOpen={showFeaturedEditor}
        onClose={() => setShowFeaturedEditor(false)}
        onSave={handleFeaturedSave}
        initialFeatured={formData.featured}
      />
    </>
  );
};

export default EditProfileModal;