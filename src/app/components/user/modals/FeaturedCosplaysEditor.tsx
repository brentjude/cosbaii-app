"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  XMarkIcon,
  CameraIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useCloudinaryUpload } from "@/hooks/common/useCloudinaryUpload";
import { FeaturedItem, UserCredential } from "@/types/profile";

interface FeaturedCosplaysEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (featured: FeaturedItem[]) => Promise<void>;
  initialFeatured: FeaturedItem[];
  loading?: boolean;
}

const FeaturedCosplaysEditor: React.FC<FeaturedCosplaysEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  initialFeatured,
  loading = false,
}) => {
  // ✅ Initialize with proper defaults
  const getEmptyFeaturedItem = (): FeaturedItem => ({
    title: "",
    description: "",
    imageUrl: "",
    character: "",
    series: "",
    type: "cosplay",
  });

  const [featured, setFeatured] = useState<FeaturedItem[]>([
    getEmptyFeaturedItem(),
    getEmptyFeaturedItem(),
    getEmptyFeaturedItem(),
  ]);

  const [userCredentials, setUserCredentials] = useState<UserCredential[]>([]);
  const [credentialsLoading, setCredentialsLoading] = useState(false);
  const [searchTerms, setSearchTerms] = useState<string[]>(["", "", ""]);
  const [showDropdowns, setShowDropdowns] = useState<boolean[]>([false, false, false]);
  const [showAddCredentialsModal, setShowAddCredentialsModal] = useState(false);
  const [imageUploading, setImageUploading] = useState<Record<number, boolean>>({});
  const [isSaving, setIsSaving] = useState(false); // ✅ Add saving state

  const featuredInputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null]);

  const {
    uploadImage,
    uploading: cloudinaryUploading,
    error: uploadError,
  } = useCloudinaryUpload();

  // ✅ Initialize featured data properly
  useEffect(() => {
    if (isOpen && initialFeatured.length > 0) {
      const featuredData: FeaturedItem[] = [];
      
      for (let i = 0; i < 3; i++) {
        if (i < initialFeatured.length && initialFeatured[i].imageUrl) {
          featuredData.push({
            ...initialFeatured[i],
            type: initialFeatured[i].type || "cosplay",
          });
        } else {
          featuredData.push(getEmptyFeaturedItem());
        }
      }
      
      setFeatured(featuredData);
    } else if (isOpen) {
      setFeatured([
        getEmptyFeaturedItem(),
        getEmptyFeaturedItem(),
        getEmptyFeaturedItem(),
      ]);
    }
  }, [isOpen, initialFeatured]);

  // ✅ Fetch user credentials
  useEffect(() => {
    if (isOpen) {
      fetchUserCredentials();
    }
  }, [isOpen]);

  const fetchUserCredentials = async () => {
    setCredentialsLoading(true);
    try {
      const response = await fetch("/api/user/credentials");
      if (response.ok) {
        const data = await response.json();
        setUserCredentials(data.credentials || []);
      }
    } catch (error) {
      console.error("Error fetching credentials:", error);
    } finally {
      setCredentialsLoading(false);
    }
  };

  const getFilteredCredentials = (index: number) => {
    const searchTerm = searchTerms[index].toLowerCase();
    if (!searchTerm) return userCredentials;

    return userCredentials.filter(
      (credential) =>
        credential.competition.name.toLowerCase().includes(searchTerm) ||
        credential.cosplayTitle?.toLowerCase().includes(searchTerm) ||
        credential.competition.location?.toLowerCase().includes(searchTerm)
    );
  };

  const handleCompetitionSelect = (index: number, credential: UserCredential) => {
    const newFeatured = [...featured];
    newFeatured[index] = {
      ...newFeatured[index],
      type: "competition",
      title: credential.cosplayTitle || credential.competition.name,
      competitionId: credential.competition.id,
      competition: credential.competition,
      position: credential.position,
      imageUrl: credential.imageUrl || newFeatured[index].imageUrl,
    };

    setFeatured(newFeatured);

    const newShowDropdowns = [...showDropdowns];
    newShowDropdowns[index] = false;
    setShowDropdowns(newShowDropdowns);

    const newSearchTerms = [...searchTerms];
    newSearchTerms[index] = credential.competition.name;
    setSearchTerms(newSearchTerms);
  };

  const handleSearchChange = (index: number, value: string) => {
    const newSearchTerms = [...searchTerms];
    newSearchTerms[index] = value;
    setSearchTerms(newSearchTerms);

    const newShowDropdowns = [...showDropdowns];
    newShowDropdowns[index] = value.length > 0;
    setShowDropdowns(newShowDropdowns);
  };

  const clearCompetitionSelection = (index: number) => {
    const newFeatured = [...featured];
    newFeatured[index] = {
      ...newFeatured[index],
      type: "cosplay",
      title: "",
      competitionId: undefined,
      competition: undefined,
      position: undefined,
    };
    setFeatured(newFeatured);

    const newSearchTerms = [...searchTerms];
    newSearchTerms[index] = "";
    setSearchTerms(newSearchTerms);
  };

  const handleTypeChange = (index: number, type: "competition" | "cosplay") => {
    const newFeatured = [...featured];
    newFeatured[index] = {
      ...newFeatured[index],
      type,
      ...(type === "cosplay" && {
        competitionId: undefined,
        competition: undefined,
        position: undefined,
        award: undefined,
      }),
    };
    setFeatured(newFeatured);

    const newSearchTerms = [...searchTerms];
    newSearchTerms[index] = "";
    setSearchTerms(newSearchTerms);

    const newShowDropdowns = [...showDropdowns];
    newShowDropdowns[index] = false;
    setShowDropdowns(newShowDropdowns);
  };

  const handleFeaturedImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setImageUploading((prev) => ({ ...prev, [index]: true }));

    try {
      const uploadResult = await uploadImage(file, {
        uploadPreset: "cosbaii-profiles",
        folder: `cosbaii/featured-cosplays`,
        onSuccess: (result) => {
          console.log("Featured image upload successful:", result);
        },
        onError: (error) => {
          console.error("Featured image upload error:", error);
        },
      });

      if (uploadResult) {
        const newFeatured = [...featured];
        newFeatured[index] = {
          ...newFeatured[index],
          imageUrl: uploadResult.url,
        };
        setFeatured(newFeatured);

        console.log(`Featured image ${index + 1} uploaded:`, uploadResult.url);
      }
    } catch (error) {
      console.error("Error uploading featured image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setImageUploading((prev) => ({ ...prev, [index]: false }));
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  const handleFeaturedChange = (
    index: number,
    field: keyof FeaturedItem,
    value: string
  ) => {
    const newFeatured = [...featured];
    newFeatured[index] = { ...newFeatured[index], [field]: value };
    setFeatured(newFeatured);
  };

  const setFeaturedInputRef = useCallback(
    (el: HTMLInputElement | null, index: number) => {
      if (!featuredInputRefs.current) {
        featuredInputRefs.current = [];
      }
      featuredInputRefs.current[index] = el;
    },
    []
  );

  // ✅ Fixed submit handler with proper loading state
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSaving(true);
    try {
      await onSave(featured);
      console.log("Featured items saved successfully");
    } catch (error) {
      console.error("Error saving featured items:", error);
      alert("Failed to save featured items. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (isSaving || Object.values(imageUploading).some(Boolean)) {
      return; // Prevent closing while saving or uploading
    }
    setSearchTerms(["", "", ""]);
    setShowDropdowns([false, false, false]);
    onClose();
  };

  if (!isOpen) return null;

  const isAnyOperationInProgress =
    isSaving ||
    loading ||
    cloudinaryUploading ||
    Object.values(imageUploading).some(Boolean);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={handleClose} />

      <div className="fixed inset-4 z-50 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4">
          <div className="bg-base-100 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-base-200 bg-base-100">
              <div>
                <h2 className="text-2xl font-bold">Edit Featured Cosplays</h2>
                <p className="text-base-content/70">
                  Showcase your best cosplay work (3 slots)
                </p>
              </div>
              <button
                onClick={handleClose}
                className="btn btn-sm btn-circle btn-ghost"
                disabled={isAnyOperationInProgress}
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

            {/* ✅ Saving Indicator */}
            {isSaving && (
              <div className="mx-6 mt-4 alert alert-info">
                <span className="loading loading-spinner loading-sm"></span>
                <span>Saving your featured cosplays...</span>
              </div>
            )}

            {/* Content */}
            <form
              onSubmit={handleSubmit}
              className="overflow-y-auto max-h-[calc(95vh-140px)]"
            >
              <div className="p-6 space-y-6">
                {/* Add credentials button if no credentials */}
                {userCredentials.length === 0 && (
                  <div className="text-center py-8 bg-base-200/50 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">
                      No Competition Credentials
                    </h3>
                    <p className="text-base-content/70 mb-4">
                      Add your competition participations to showcase in your featured section.
                    </p>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setShowAddCredentialsModal(true)}
                      disabled={isAnyOperationInProgress}
                    >
                      <PlusIcon className="w-4 h-4" />
                      Add Credentials
                    </button>
                  </div>
                )}

                {credentialsLoading ? (
                  <div className="flex justify-center py-8">
                    <span className="loading loading-spinner loading-lg"></span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {featured.map((item, index) => (
                      <div
                        key={index}
                        className="space-y-4 p-4 border border-base-200 rounded-lg"
                      >
                        <h4 className="font-medium">Featured #{index + 1}</h4>

                        {/* Type Selection */}
                        <div className="space-y-2">
                          <label className="label">
                            <span className="label-text font-medium">Type</span>
                          </label>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              className={`btn btn-sm ${
                                item.type === "competition" ? "btn-primary" : "btn-outline"
                              }`}
                              onClick={() => handleTypeChange(index, "competition")}
                              disabled={isAnyOperationInProgress}
                            >
                              🏆 Competition Result
                            </button>
                            <button
                              type="button"
                              className={`btn btn-sm ${
                                item.type === "cosplay" ? "btn-primary" : "btn-outline"
                              }`}
                              onClick={() => handleTypeChange(index, "cosplay")}
                              disabled={isAnyOperationInProgress}
                            >
                              🎭 Custom Cosplay
                            </button>
                          </div>
                        </div>

                        {/* Competition Selection */}
                        {item.type === "competition" && (
                          <div className="space-y-2">
                            <label className="label">
                              <span className="label-text font-medium">Select Competition</span>
                            </label>
                            <div className="relative">
                              <div className="input-group">
                                <input
                                  type="text"
                                  className="input input-bordered input-sm w-full pr-20"
                                  placeholder={
                                    userCredentials.length > 0
                                      ? "Search competitions..."
                                      : "No competitions found"
                                  }
                                  value={searchTerms[index]}
                                  onChange={(e) => handleSearchChange(index, e.target.value)}
                                  disabled={userCredentials.length === 0 || isAnyOperationInProgress}
                                />
                                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                                  {item.competitionId && (
                                    <button
                                      type="button"
                                      className="btn btn-ghost btn-xs"
                                      onClick={() => clearCompetitionSelection(index)}
                                      title="Clear selection"
                                      disabled={isAnyOperationInProgress}
                                    >
                                      <XMarkIcon className="w-3 h-3" />
                                    </button>
                                  )}
                                  <MagnifyingGlassIcon className="w-4 h-4 text-base-content/50" />
                                </div>
                              </div>

                              {/* Competition dropdown */}
                              {showDropdowns[index] && userCredentials.length > 0 && (
                                <div className="absolute top-full left-0 right-0 z-10 bg-base-100 border border-base-200 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
                                  {getFilteredCredentials(index).length > 0 ? (
                                    getFilteredCredentials(index).map((credential) => (
                                      <div
                                        key={credential.id}
                                        className="p-3 hover:bg-base-200 cursor-pointer border-b border-base-200 last:border-b-0"
                                        onClick={() => handleCompetitionSelect(index, credential)}
                                      >
                                        <div className="font-medium text-sm">
                                          {credential.competition.name}
                                        </div>
                                        <div className="text-xs text-base-content/70">
                                          {new Date(credential.competition.eventDate).toLocaleDateString()}
                                          {credential.competition.location &&
                                            ` • ${credential.competition.location}`}
                                        </div>
                                        {credential.cosplayTitle && (
                                          <div className="text-xs text-primary">
                                            {credential.cosplayTitle}
                                          </div>
                                        )}
                                        {credential.position && (
                                          <div className="badge badge-primary badge-xs mt-1">
                                            {credential.position}
                                          </div>
                                        )}
                                      </div>
                                    ))
                                  ) : (
                                    <div className="p-3 text-sm text-base-content/50 text-center">
                                      No competitions found
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Competition Info Display */}
                        {item.type === "competition" && item.competition && (
                          <div className="bg-base-200 rounded-lg p-3">
                            <div className="text-sm font-medium">{item.competition.name}</div>
                            <div className="text-xs text-base-content/70">
                              {new Date(item.competition.eventDate).toLocaleDateString()}
                              {item.competition.location && ` • ${item.competition.location}`}
                            </div>
                            <div className="flex gap-1 mt-1">
                              <span className="badge badge-outline badge-xs">
                                {item.competition.competitionType}
                              </span>
                              <span className="badge badge-outline badge-xs">
                                {item.competition.level}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Featured Image */}
                        <div className="space-y-2">
                          <label className="label">
                            <span className="label-text font-medium">Featured Image</span>
                          </label>
                          <div
                            className="h-32 bg-base-200 rounded-lg overflow-hidden relative group cursor-pointer border-2 border-dashed border-base-300 hover:border-primary"
                            onClick={() =>
                              !imageUploading[index] &&
                              !isAnyOperationInProgress &&
                              featuredInputRefs.current[index]?.click()
                            }
                          >
                            {item.imageUrl ? (
                              <Image src={item.imageUrl} alt={`Featured ${index + 1}`} fill className="object-cover" />
                            ) : (
                              <div className="h-full flex items-center justify-center">
                                <div className="text-center text-base-content/50">
                                  <CameraIcon className="w-8 h-8 mx-auto mb-2" />
                                  <p className="text-xs">Add {item.type} image</p>
                                </div>
                              </div>
                            )}

                            {imageUploading[index] && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <div className="text-center text-white">
                                  <span className="loading loading-spinner loading-lg mb-2"></span>
                                  <p className="text-xs">Uploading image...</p>
                                </div>
                              </div>
                            )}

                            {!imageUploading[index] && !isAnyOperationInProgress && (
                              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <CameraIcon className="w-6 h-6 text-white" />
                              </div>
                            )}
                          </div>
                          <input
                            ref={(el) => setFeaturedInputRef(el, index)}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFeaturedImageUpload(e, index)}
                            className="hidden"
                            disabled={imageUploading[index] || isAnyOperationInProgress}
                          />
                        </div>

                        {/* Featured Details */}
                        <div className="space-y-2">
                          <input
                            type="text"
                            className="input input-bordered input-sm w-full"
                            placeholder={
                              item.type === "competition"
                                ? "Competition title (auto-filled)"
                                : "Cosplay title"
                            }
                            value={item.title}
                            onChange={(e) => handleFeaturedChange(index, "title", e.target.value)}
                            disabled={isAnyOperationInProgress}
                          />
                          <input
                            type="text"
                            className="input input-bordered input-sm w-full"
                            placeholder="Character name"
                            value={item.character || ""}
                            onChange={(e) => handleFeaturedChange(index, "character", e.target.value)}
                            disabled={isAnyOperationInProgress}
                          />
                          <input
                            type="text"
                            className="input input-bordered input-sm w-full"
                            placeholder="Series/franchise"
                            value={item.series || ""}
                            onChange={(e) => handleFeaturedChange(index, "series", e.target.value)}
                            disabled={isAnyOperationInProgress}
                          />
                          <textarea
                            className="textarea textarea-bordered textarea-sm w-full"
                            placeholder="Description"
                            rows={2}
                            value={item.description}
                            onChange={(e) => handleFeaturedChange(index, "description", e.target.value)}
                            disabled={isAnyOperationInProgress}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-base-200 bg-base-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn btn-ghost"
                  disabled={isAnyOperationInProgress}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isAnyOperationInProgress}
                >
                  {isSaving ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Saving...
                    </>
                  ) : (
                    "Save Featured"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Add Credentials Modal */}
      {showAddCredentialsModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-base-100 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Add Competition Credentials</h3>
            <p className="text-base-content/70 mb-4">
              Add your competition participations first to showcase them in your featured section.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowAddCredentialsModal(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setShowAddCredentialsModal(false);
                  handleClose();
                }}
              >
                Add Credentials
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeaturedCosplaysEditor;