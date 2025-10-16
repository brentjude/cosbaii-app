"use client";

import { useState, useEffect, useRef } from "react";
import { XMarkIcon, CameraIcon } from "@heroicons/react/24/outline";
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
  }, [profileData]);

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

    // ✅ Updated to use the correct endpoint
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

      onSave(updatedFormData);
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
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Profile Picture</span>
              </label>
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden group">
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

            {/* Basic Information */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Display Name</span>
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName || ""} // ✅ Handle null
                onChange={handleInputChange}
                className="input input-bordered w-full"
                placeholder="Enter your display name"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formData.bio || ""} // ✅ Handle null
                onChange={handleInputChange}
                className="textarea textarea-bordered h-24"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Cosplayer Type</span>
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
                  <span className="label-text">Years of Experience</span>
                </label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience ?? 0} // ✅ Handle null
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  min="0"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Skill Level</span>
                </label>
                <select
                  name="skillLevel"
                  value={formData.skillLevel || "beginner"} // ✅ Handle null
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
                  <span className="label-text">Specialization</span>
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization || ""} // ✅ Handle null
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="e.g., Armor crafting, Sewing, Prop making"
                />
              </div>
            </div>

            {/* Social Media Links */}
            <div className="divider">Social Media</div>

            <div className="space-y-3">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Facebook URL</span>
                </label>
                <input
                  type="url"
                  name="facebookUrl"
                  value={formData.facebookUrl || ""} // ✅ Handle null/undefined
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="https://facebook.com/username"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Instagram URL</span>
                </label>
                <input
                  type="url"
                  name="instagramUrl"
                  value={formData.instagramUrl || ""} // ✅ Handle null/undefined
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="https://instagram.com/username"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Twitter URL</span>
                </label>
                <input
                  type="url"
                  name="twitterUrl"
                  value={formData.twitterUrl || ""} // ✅ Handle null/undefined
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="https://twitter.com/username"
                />
              </div>
            </div>


            {/* Action Buttons */}
            <div className="modal-action sticky bottom-0 bg-base-100 pt-4">
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
                    <span className="loading loading-spinner"></span>
                    {uploadingProfilePic && "Uploading Profile Picture..."}
                    {uploadingCoverImage && "Uploading Cover Image..."}
                    {loading && !isUploading && "Saving..."}
                  </>
                ) : (
                  "Save Changes"
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