// Update: src/app/components/user/modals/ProfileSetupModal.tsx
"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useCloudinaryUpload } from "@/hooks/common/useCloudinaryUpload";
import {
  CameraIcon,
  CheckIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

// ✅ Import ProfileSetupData from shared types instead of defining locally
import { ProfileSetupData } from "@/types/profile";

// ✅ Keep only the errors interface here
interface ProfileSetupErrors {
  cosplayerType?: string;
  yearsOfExperience?: string;
  specialization?: string;
  skillLevel?: string;
  displayName?: string;
  bio?: string;
  profilePicture?: string;
  coverImage?: string;
}

interface ProfileSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: ProfileSetupData) => void;
  loading?: boolean;
}

const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  loading = false,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState<ProfileSetupData>({
    cosplayerType: "HOBBY",
    yearsOfExperience: null,
    specialization: "",
    skillLevel: "beginner",
    displayName: "",
    bio: "",
    profilePicture: "/images/default-avatar.png",
    coverImage: "/images/default-cover.jpg",
  });

  const [errors, setErrors] = useState<ProfileSetupErrors>({});

  // ✅ Add file input refs
  const profilePictureInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  // ✅ Add loading states for uploads
  const [profilePictureLoading, setProfilePictureLoading] = useState(false);
  const [coverImageLoading, setCoverImageLoading] = useState(false);

  const { uploadImage } = useCloudinaryUpload();

  const totalSteps = 4;

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

  

  // ✅ File upload handler
  const handleFileUpload = async (file: File, type: "profile" | "cover") => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    const setLoading =
      type === "profile" ? setProfilePictureLoading : setCoverImageLoading;
    setLoading(true);

    try {
      const uploadResult = await uploadImage(file, {
        uploadPreset: "cosbaii-profiles",
        folder: `cosbaii/profiles/${type}`,
        onSuccess: (result) => {
          console.log("Upload successful:", result);
        },
        onError: (error) => {
          console.error("Upload error:", error);
        },
      });

      if (uploadResult) {
        setFormData((prev) => ({
          ...prev,
          [type === "profile" ? "profilePicture" : "coverImage"]:
            uploadResult.url,
        }));
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle profile picture upload
  const handleProfilePictureUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file, "profile");
    }
  };

  // ✅ Handle cover image upload
  const handleCoverImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file, "cover");
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: ProfileSetupErrors = {};

    switch (step) {
      case 1:
        if (
          !formData.cosplayerType ||
          !["COMPETITIVE", "HOBBY", "PROFESSIONAL"].includes(
            formData.cosplayerType
          )
        ) {
          newErrors.cosplayerType = "Please select your cosplayer type";
        }
        break;
      case 2:
        if (!formData.specialization || formData.specialization === "") {
          newErrors.specialization = "Please select your specialization";
        }
        if (!formData.skillLevel) {
          newErrors.skillLevel = "Please select your skill level";
        }
        break;
      case 3:
        if (!formData.displayName.trim()) {
          newErrors.displayName = "Display name is required";
        } else if (formData.displayName.length < 2) {
          newErrors.displayName = "Display name must be at least 2 characters";
        } else if (formData.displayName.length > 50) {
          newErrors.displayName = "Display name must be 50 characters or less";
        }

        // ✅ Add bio validation
        if (formData.bio.length > 160) {
          newErrors.bio = "Bio must be 160 characters or less";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleComplete = () => {
    if (validateStep(currentStep)) {
      const cleanData: ProfileSetupData = {
        cosplayerType: formData.cosplayerType,
        yearsOfExperience: formData.yearsOfExperience,
        specialization: formData.specialization.trim(),
        skillLevel: formData.skillLevel,
        displayName: formData.displayName.trim(),
        bio: formData.bio.trim(),
        profilePicture: formData.profilePicture,
        coverImage: formData.coverImage,
      };

      console.log("Submitting profile data:", cleanData);
      onComplete(cleanData);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-base-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-primary">
                Welcome to COSBAII!
              </h2>
              <p className="text-base-content/70">
                Let&apos;s set up your cosplay profile
              </p>
            </div>
            <button
              onClick={handleSkip}
              className="btn btn-ghost btn-sm"
              disabled={loading}
            >
              Skip for now
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-base-content/60 mb-2">
              <span>
                Step {currentStep} of {totalSteps}
              </span>
              <span>
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </span>
            </div>
            <progress
              className="progress progress-primary w-full"
              value={currentStep}
              max={totalSteps}
            ></progress>
          </div>
        </div>

        {/* ✅ Hidden file inputs */}
        <input
          ref={profilePictureInputRef}
          type="file"
          accept="image/*"
          onChange={handleProfilePictureUpload}
          className="hidden"
        />
        <input
          ref={coverImageInputRef}
          type="file"
          accept="image/*"
          onChange={handleCoverImageUpload}
          className="hidden"
        />

        {/* Content */}
        <div className="p-6">
          {/* ✅ Step 1: Cosplayer Type with Professional option */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">
                  What type of cosplayer are you?
                </h3>
                <p className="text-base-content/70">
                  This helps us tailor your experience
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className={`card cursor-pointer transition-all border-2 ${
                    formData.cosplayerType === "COMPETITIVE"
                      ? "border-primary bg-primary/10"
                      : "border-base-300 hover:border-primary/50"
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, cosplayerType: "COMPETITIVE" })
                  }
                >
                  <div className="card-body text-center">
                    <div className="text-4xl mb-3">🏆</div>
                    <h4 className="font-semibold">Competitive</h4>
                    <p className="text-sm text-base-content/70">
                      Participate in competitions and contests
                    </p>
                  </div>
                </div>

                <div
                  className={`card cursor-pointer transition-all border-2 ${
                    formData.cosplayerType === "HOBBY"
                      ? "border-primary bg-primary/10"
                      : "border-base-300 hover:border-primary/50"
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, cosplayerType: "HOBBY" })
                  }
                >
                  <div className="card-body text-center">
                    <div className="text-4xl mb-3">🎨</div>
                    <h4 className="font-semibold">Hobby</h4>
                    <p className="text-sm text-base-content/70">
                      Cosplay for fun and creativity
                    </p>
                  </div>
                </div>

                <div
                  className={`card cursor-pointer transition-all border-2 ${
                    formData.cosplayerType === "PROFESSIONAL"
                      ? "border-primary bg-primary/10"
                      : "border-base-300 hover:border-primary/50"
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, cosplayerType: "PROFESSIONAL" })
                  }
                >
                  <div className="card-body text-center">
                    <div className="text-4xl mb-3">💼</div>
                    <h4 className="font-semibold">Professional</h4>
                    <p className="text-sm text-base-content/70">
                      Work in cosplay industry professionally
                    </p>
                  </div>
                </div>
              </div>

              {errors.cosplayerType && (
                <p className="text-error text-sm text-center">
                  {errors.cosplayerType}
                </p>
              )}
            </div>
          )}

          {/* Step 2: Skills & Experience */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">
                  Tell us about your skills
                </h3>
                <p className="text-base-content/70">
                  Help us understand your expertise
                </p>
              </div>

              {/* Years of Experience */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">
                    Years of Experience
                  </span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={formData.yearsOfExperience || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      yearsOfExperience: e.target.value
                        ? parseInt(e.target.value)
                        : null,
                    })
                  }
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

              {/* Specialization */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">
                    Main Specialization
                  </span>
                </label>
                <select
                  className={`select select-bordered w-full ${
                    errors.specialization ? "select-error" : ""
                  }`}
                  value={formData.specialization}
                  onChange={(e) =>
                    setFormData({ ...formData, specialization: e.target.value })
                  }
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
                    <span className="label-text-alt text-error">
                      {errors.specialization}
                    </span>
                  </label>
                )}
              </div>

              {/* Skill Level */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Skill Level</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(["beginner", "intermediate", "advanced"] as const).map(
                    (level) => (
                      <button
                        key={level}
                        type="button"
                        className={`btn ${
                          formData.skillLevel === level
                            ? "btn-primary"
                            : "btn-outline"
                        }`}
                        onClick={() =>
                          setFormData({ ...formData, skillLevel: level })
                        }
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    )
                  )}
                </div>
                {errors.skillLevel && (
                  <p className="text-error text-sm mt-1">{errors.skillLevel}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Profile Info */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">
                  Create your profile
                </h3>
                <p className="text-base-content/70">
                  Add your display name and bio
                </p>
              </div>

              {/* Display Name */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Display Name</span>
                </label>
                <input
                  type="text"
                  className={`input input-bordered w-full ${
                    errors.displayName ? "input-error" : ""
                  }`}
                  placeholder="Your cosplay name"
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData({ ...formData, displayName: e.target.value })
                  }
                />
                {errors.displayName && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.displayName}
                    </span>
                  </label>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Bio (Optional)</span>
                  <span className="label-text-alt text-base-content/60">
                    {formData.bio.length}/160 characters
                  </span>
                </label>
                <textarea
                  className={`textarea textarea-bordered w-full ${
                    formData.bio.length > 160 ? "textarea-error" : ""
                  }`}
                  placeholder="Tell us about yourself and your cosplay journey..."
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => {
                    if (e.target.value.length <= 160) {
                      setFormData({ ...formData, bio: e.target.value });
                    }
                  }}
                  maxLength={160} // ✅ HTML validation
                />
                {formData.bio.length > 160 && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      Bio must be 160 characters or less
                    </span>
                  </label>
                )}
              </div>
            </div>
          )}

          {/* ✅ Step 4: Profile Pictures with functional upload */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">
                  Add profile pictures
                </h3>
                <p className="text-base-content/70">
                  Upload your profile and cover images
                </p>
              </div>

              {/* ✅ Profile Picture Upload */}
              <div className="flex flex-col items-center space-y-4">
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
                    onClick={() => profilePictureInputRef.current?.click()}
                    disabled={profilePictureLoading}
                  >
                    {profilePictureLoading ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      <CameraIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="text-center">
                  <p className="text-sm text-base-content/70">
                    Profile Picture
                  </p>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline mt-2"
                    onClick={() => profilePictureInputRef.current?.click()}
                    disabled={profilePictureLoading}
                  >
                    {profilePictureLoading ? "Uploading..." : "Change Photo"}
                  </button>
                </div>
              </div>

              {/* ✅ Cover Image Upload */}
              <div className="space-y-2">
                <div
                  className="h-32 bg-base-200 rounded-lg overflow-hidden relative group cursor-pointer"
                  onClick={() => coverImageInputRef.current?.click()}
                >
                  <Image
                    src={formData.coverImage}
                    alt="Cover"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {coverImageLoading ? (
                      <span className="loading loading-spinner loading-md text-white"></span>
                    ) : (
                      <div className="text-center text-white">
                        <CameraIcon className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Click to change cover</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-base-content/70">Cover Image</p>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline mt-2"
                    onClick={() => coverImageInputRef.current?.click()}
                    disabled={coverImageLoading}
                  >
                    {coverImageLoading ? "Uploading..." : "Change Cover"}
                  </button>
                </div>
              </div>

              {/* ✅ File Upload Guidelines */}
              <div className="alert alert-info">
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
                  ></path>
                </svg>
                <div>
                  <h3 className="font-bold">Image Guidelines:</h3>
                  <div className="text-xs mt-1">
                    • Supported formats: JPG, PNG, GIF, WebP
                    <br />
                    • Maximum file size: 5MB
                    <br />• Recommended: Square images for profile, 16:9 for
                    cover
                  </div>
                </div>
              </div>

              {/* Profile Summary */}
              <div className="bg-base-200 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Profile Summary:</h4>
                <ul className="space-y-1 text-sm">
                  <li>
                    • Type:{" "}
                    {formData.cosplayerType === "COMPETITIVE"
                      ? "🏆 Competitive"
                      : formData.cosplayerType === "HOBBY"
                      ? "🎨 Hobby"
                      : formData.cosplayerType === "PROFESSIONAL"
                      ? "💼 Professional"
                      : "Not selected"}
                  </li>
                  <li>
                    • Experience:{" "}
                    {formData.yearsOfExperience
                      ? `${formData.yearsOfExperience} years`
                      : "Not specified"}
                  </li>
                  <li>
                    • Specialization:{" "}
                    {formData.specialization || "Not specified"}
                  </li>
                  <li>
                    • Skill Level:{" "}
                    {formData.skillLevel.charAt(0).toUpperCase() +
                      formData.skillLevel.slice(1)}
                  </li>
                  <li>• Display Name: {formData.displayName || "Not set"}</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-base-200 flex justify-between">
          <button
            className="btn btn-ghost"
            onClick={handlePrevious}
            disabled={currentStep === 1 || loading}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Previous
          </button>

          <div className="flex gap-2">
            {currentStep < totalSteps ? (
              <button
                className="btn btn-primary"
                onClick={handleNext}
                disabled={loading}
              >
                Next
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={handleComplete}
                disabled={loading || profilePictureLoading || coverImageLoading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                ) : (
                  <CheckIcon className="w-4 h-4 mr-2" />
                )}
                Complete Setup
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupModal;
