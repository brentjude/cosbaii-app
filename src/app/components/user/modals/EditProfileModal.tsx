"use client";

import { useState, useEffect, useRef } from "react";
import { XMarkIcon, CameraIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import {
  EditProfileData,
} from "@/types/profile";

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

  const profilePicInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  // ✅ Handle null/undefined values when loading profile data
  useEffect(() => {
    if (profileData) {
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
    }
  }, [profileData, isOpen]); // ✅ Added isOpen dependency to reset on modal open

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File, type: "profile" | "cover"): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const response = await fetch("/api/upload/profile", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to upload image");
    }

    const data = await response.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // ✅ Create a copy to avoid mutating state directly
      const updatedFormData = { ...formData };

      if (profilePictureFile) {
        setUploadingProfilePic(true);
        const profilePictureUrl = await uploadImage(profilePictureFile, "profile");
        updatedFormData.profilePicture = profilePictureUrl;
        setUploadingProfilePic(false);
      }

      if (coverImageFile) {
        setUploadingCoverImage(true);
        const coverImageUrl = await uploadImage(coverImageFile, "cover");
        updatedFormData.coverImage = coverImageUrl;
        setUploadingCoverImage(false);
      }

      // ✅ Pass the updated data to parent
      await onSave(updatedFormData);

      // ✅ Reset file states after successful save
      setProfilePictureFile(null);
      setCoverImageFile(null);
      setProfilePicPreview(null);
      setCoverImagePreview(null);

    } catch (error) {
      console.error("Error uploading images:", error);
      alert(error instanceof Error ? error.message : "Failed to upload images");
      setUploadingProfilePic(false);
      setUploadingCoverImage(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // ✅ Handle number input specifically
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

  return (
    <>
      <div className="modal modal-open">
        <div className="modal-box max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-base-100 z-10 pb-2">
            <h3 className="font-bold text-lg">Edit Profile</h3>
            <button
              onClick={onClose}
              className="btn btn-sm btn-circle btn-ghost"
              disabled={loading || isUploading}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Cover Image Section */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Cover Image</span>
              </label>
              <div className="relative w-full h-48 bg-base-200 rounded-lg overflow-hidden group">
                <Image
                  src={coverImagePreview || formData.coverImage || "/images/default-cover.jpg"}
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
                    <span className="loading loading-spinner loading-lg"></span>
                  ) : (
                    <CameraIcon className="w-12 h-12 text-white" />
                  )}
                </button>
              </div>
              <input
                ref={coverImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                className="hidden"
              />
            </div>

            {/* Profile Picture Section */}
            <div className="text-center form-control">
              <label className="label">
                <span className="label-text font-semibold">Profile Picture</span>
              </label>
              <div className="flex items-center gap-4">
                <div className="mx-auto relative w-24 h-24 rounded-full overflow-hidden group">
                  <Image
                    src={profilePicPreview || formData.profilePicture || "/images/default-avatar.png"}
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
                      <span className="loading loading-spinner"></span>
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
                />
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
              />
              
              {/* ✅ Display Name Change Restrictions Alert */}
              <div className="alert alert-info mt-2 py-2 px-3">
                <InformationCircleIcon className="w-5 h-5 flex-shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold">Display Name Change Policy:</p>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px]">
                    <li>You can change your display name <strong>3 times</strong> within <strong>7 days</strong></li>
                    <li>After 3 changes, you must wait <strong>1 month</strong> before changing again</li>
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
                >
                  <option value="HOBBY">Hobby Cosplayer</option>
                  <option value="COMPETITIVE">Competitive Cosplayer</option>
                  <option value="PROFESSIONAL">Professional Cosplayer</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Years of Experience</span>
                </label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience ?? 0}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  min="0"
                  max="50"
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
                />
              </div>
            </div>

            {/* Social Media Links */}
            <div className="divider">Social Media Links</div>

            <div className="space-y-3">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">
                    Facebook URL
                  </span>
                </label>
                <input
                  type="url"
                  name="facebookUrl"
                  value={formData.facebookUrl || ""}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="https://facebook.com/username"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">
                    Instagram URL
                  </span>
                </label>
                <input
                  type="url"
                  name="instagramUrl"
                  value={formData.instagramUrl || ""}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="https://instagram.com/username"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">
                    Twitter/X URL
                  </span>
                </label>
                <input
                  type="url"
                  name="twitterUrl"
                  value={formData.twitterUrl || ""}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="https://twitter.com/username"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="modal-action sticky bottom-0 bg-base-100 pt-4 border-t border-base-200">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost"
                disabled={loading || isUploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || isUploading}
              >
                {loading || isUploading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    {uploadingProfilePic && <span className="hidden sm:inline">Uploading Profile Picture...</span>}
                    {uploadingCoverImage && <span className="hidden sm:inline">Uploading Cover Image...</span>}
                    {loading && !isUploading && <span className="hidden sm:inline">Saving...</span>}
                    <span className="sm:hidden">Saving...</span>
                  </>
                ) : (
                  <>
                    <span>Save Changes</span>
                  </>
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