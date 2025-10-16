"use client";

import { useState, useEffect, useRef } from "react";
import { XMarkIcon, CameraIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useCloudinaryUpload } from "@/hooks/common/useCloudinaryUpload";
import { EditProfileData } from "@/types/profile";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EditProfileData) => Promise<void>;
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
    yearsOfExperience: 0,
    specialization: "",
    skillLevel: "beginner",
    featured: [],
    facebookUrl: "",
    instagramUrl: "",
    twitterUrl: "",
  });

  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [uploadingProfilePic, setUploadingProfilePic] = useState(false);
  const [uploadingCoverImage, setUploadingCoverImage] = useState(false);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const profilePicInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  const { uploadImage } = useCloudinaryUpload();

  useEffect(() => {
    if (isOpen && profileData) {
      setFormData({
        ...profileData,
        featured: profileData.featured || [],
        yearsOfExperience: profileData.yearsOfExperience ?? 0,
        displayName: profileData.displayName || "",
        bio: profileData.bio || "",
        specialization: profileData.specialization || "",
        facebookUrl: profileData.facebookUrl || "",
        instagramUrl: profileData.instagramUrl || "",
        twitterUrl: profileData.twitterUrl || "",
      });
      setProfilePicPreview(null);
      setCoverImagePreview(null);
      setProfilePictureFile(null);
      setCoverImageFile(null);
      setUploadError(null);
    }
  }, [profileData, isOpen]);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setUploadError("Please select an image file");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setUploadError("Profile picture must be less than 10MB");
        return;
      }

      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setUploadError(null);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setUploadError("Please select an image file");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setUploadError("Cover image must be less than 10MB");
        return;
      }

      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setUploadError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);

    try {
      // ✅ Create a copy of formData to update with new URLs
      const updatedFormData = { ...formData };
      let hasImageChanges = false;

      // ✅ Upload profile picture to Cloudinary if file is selected
      if (profilePictureFile) {
        setUploadingProfilePic(true);
        console.log("📤 Uploading profile picture to Cloudinary...");

        const uploadResult = await uploadImage(profilePictureFile, {
          uploadPreset: "cosbaii-profiles",
          folder: "cosbaii/profiles",
          onSuccess: (result) => {
            console.log("✅ Profile picture uploaded successfully:", {
              url: result.url,
              publicId: result.publicId,
            });
          },
          onError: (error) => {
            console.error("❌ Profile picture upload failed:", error);
            throw error;
          },
        });

        if (uploadResult) {
          // ✅ Update formData with Cloudinary URL
          updatedFormData.profilePicture = uploadResult.url;
          hasImageChanges = true;
          console.log("✅ Profile picture URL saved:", uploadResult.url);
        } else {
          throw new Error("Failed to upload profile picture. Please try again.");
        }

        setUploadingProfilePic(false);
      }

      // ✅ Upload cover image to Cloudinary if file is selected
      if (coverImageFile) {
        setUploadingCoverImage(true);
        console.log("📤 Uploading cover image to Cloudinary...");

        const uploadResult = await uploadImage(coverImageFile, {
          uploadPreset: "cosbaii-profiles",
          folder: "cosbaii/covers",
          onSuccess: (result) => {
            console.log("✅ Cover image uploaded successfully:", {
              url: result.url,
              publicId: result.publicId,
            });
          },
          onError: (error) => {
            console.error("❌ Cover image upload failed:", error);
            throw error;
          },
        });

        if (uploadResult) {
          // ✅ Update formData with Cloudinary URL
          updatedFormData.coverImage = uploadResult.url;
          hasImageChanges = true;
          console.log("✅ Cover image URL saved:", uploadResult.url);
        } else {
          throw new Error("Failed to upload cover image. Please try again.");
        }

        setUploadingCoverImage(false);
      }

      // ✅ Log what's being saved
      console.log("💾 Saving profile data:", {
        profilePicture: updatedFormData.profilePicture,
        coverImage: updatedFormData.coverImage,
        displayName: updatedFormData.displayName,
        hasImageChanges,
      });

      // ✅ Call onSave with updated URLs
      await onSave(updatedFormData);

      // ✅ Reset file states after successful save
      setProfilePictureFile(null);
      setCoverImageFile(null);
      setProfilePicPreview(null);
      setCoverImagePreview(null);

      console.log("✅ Profile saved successfully!");
    } catch (error) {
      console.error("❌ Error during profile save:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload images. Please try again.";
      setUploadError(errorMessage);
      setUploadingProfilePic(false);
      setUploadingCoverImage(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "yearsOfExperience") {
      const numValue = value === "" ? 0 : parseInt(value);
      setFormData((prev) => ({
        ...prev,
        [name]: isNaN(numValue) ? 0 : numValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  if (!isOpen) return null;

  const isUploading = uploadingProfilePic || uploadingCoverImage;
  const isSubmitting = loading || isUploading;

  return (
    <>
      <div className="modal modal-open">
        <div className="modal-box max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-base-100 z-10 pb-2">
            <h3 className="font-bold text-lg">Edit Profile</h3>
            <button
              onClick={onClose}
              className="btn btn-sm btn-circle btn-ghost"
              disabled={isSubmitting}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Upload Error Alert */}
            {uploadError && (
              <div className="alert alert-error">
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
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{uploadError}</span>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setUploadError(null)}
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Cover Image Section */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Cover Image</span>
                {coverImageFile && (
                  <span className="label-text-alt text-success">
                    ✓ New image selected
                  </span>
                )}
              </label>
              <div className="relative w-full h-48 bg-base-200 rounded-lg overflow-hidden group">
                <Image
                  src={
                    coverImagePreview ||
                    formData.coverImage ||
                    "/images/default-cover.jpg"
                  }
                  alt="Cover"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => coverImageInputRef.current?.click()}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  disabled={uploadingCoverImage}
                >
                  {uploadingCoverImage ? (
                    <div className="text-center text-white">
                      <span className="loading loading-spinner loading-lg mb-2"></span>
                      <p className="text-sm">Uploading to Cloudinary...</p>
                    </div>
                  ) : (
                    <div className="text-center text-white">
                      <CameraIcon className="w-12 h-12 mb-2" />
                      <p className="text-sm">Change Cover Image</p>
                    </div>
                  )}
                </button>
              </div>
              <input
                ref={coverImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                className="hidden"
                disabled={isSubmitting}
              />
            </div>

            {/* Profile Picture Section */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Profile Picture</span>
                {profilePictureFile && (
                  <span className="label-text-alt text-success">
                    ✓ New image selected
                  </span>
                )}
              </label>
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden group">
                  <Image
                    src={
                      profilePicPreview ||
                      formData.profilePicture ||
                      "/images/default-avatar.png"
                    }
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => profilePicInputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    disabled={uploadingProfilePic}
                  >
                    {uploadingProfilePic ? (
                      <div className="text-center text-white">
                        <span className="loading loading-spinner loading-sm"></span>
                        <p className="text-xs mt-1">Uploading...</p>
                      </div>
                    ) : (
                      <CameraIcon className="w-8 h-8 text-white" />
                    )}
                  </button>
                </div>
                <input
                  ref={profilePicInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                  disabled={isSubmitting}
                />
                <div className="text-sm text-base-content/70">
                  <p>Click the image to upload</p>
                  <p className="text-xs">Max size: 10MB</p>
                </div>
              </div>
            </div>

            {/* Display Name with Restrictions */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Display Name</span>
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName || ""}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                placeholder="Enter your display name"
                maxLength={50}
                disabled={isSubmitting}
              />

              <div className="alert alert-info mt-2 py-2 px-3">
                <InformationCircleIcon className="w-5 h-5 flex-shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold">Display Name Change Policy:</p>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px]">
                    <li>
                      You can change your display name <strong>3 times</strong>{" "}
                      within <strong>7 days</strong>
                    </li>
                    <li>
                      After 3 changes, you must wait <strong>1 month</strong>{" "}
                      before changing again
                    </li>
                    <li>Choose wisely!</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formData.bio || ""}
                onChange={handleInputChange}
                className="textarea textarea-bordered h-24"
                placeholder="Tell us about yourself..."
                maxLength={500}
                disabled={isSubmitting}
              />
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  {formData.bio?.length || 0}/500 characters
                </span>
              </label>
            </div>

            {/* Cosplayer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Cosplayer Type</span>
                </label>
                <select
                  name="cosplayerType"
                  value={formData.cosplayerType}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                  disabled={isSubmitting}
                >
                  <option value="HOBBY">Hobby Cosplayer</option>
                  <option value="COMPETITIVE">Competitive Cosplayer</option>
                  <option value="PROFESSIONAL">Professional Cosplayer</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Years of Experience
                  </span>
                </label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience ?? 0}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  min="0"
                  max="50"
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Skill Level</span>
                </label>
                <select
                  name="skillLevel"
                  value={formData.skillLevel || "beginner"}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                  disabled={isSubmitting}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="professional">Professional</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Specialization</span>
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization || ""}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="e.g., Armor crafting, Sewing"
                  maxLength={100}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Social Media Links */}
            <div className="divider">Social Media Links</div>

            <div className="space-y-3">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Facebook URL</span>
                </label>
                <input
                  type="url"
                  name="facebookUrl"
                  value={formData.facebookUrl || ""}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="https://facebook.com/username"
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Instagram URL</span>
                </label>
                <input
                  type="url"
                  name="instagramUrl"
                  value={formData.instagramUrl || ""}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="https://instagram.com/username"
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Twitter/X URL</span>
                </label>
                <input
                  type="url"
                  name="twitterUrl"
                  value={formData.twitterUrl || ""}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="https://twitter.com/username"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="modal-action sticky bottom-0 bg-base-100 pt-4 border-t border-base-200">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    {uploadingProfilePic && (
                      <span className="hidden sm:inline">
                        Uploading Profile Picture...
                      </span>
                    )}
                    {uploadingCoverImage && !uploadingProfilePic && (
                      <span className="hidden sm:inline">
                        Uploading Cover Image...
                      </span>
                    )}
                    {loading && !isUploading && (
                      <span className="hidden sm:inline">Saving Profile...</span>
                    )}
                    <span className="sm:hidden">Saving...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfileModal;