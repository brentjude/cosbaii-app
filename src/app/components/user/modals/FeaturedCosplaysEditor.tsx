"use client";

import { useState, useEffect, useCallback } from "react";
import { XMarkIcon, PlusIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useCloudinaryUpload } from "@/hooks/common/useCloudinaryUpload";
import { FeaturedItem, UserCredential } from "@/types/profile";
import FeaturedItemCard from "./FeaturedItemCard";

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
  const [uploadErrors, setUploadErrors] = useState<Record<number, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const { uploadImage, uploading: cloudinaryUploading, error: uploadError } = useCloudinaryUpload();

  // Initialize featured data
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

  // Fetch user credentials
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

  const handleTypeChange = useCallback((index: number, type: "competition" | "cosplay") => {
    setFeatured((prev) => {
      const newFeatured = [...prev];
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
      return newFeatured;
    });

    setSearchTerms((prev) => {
      const newTerms = [...prev];
      newTerms[index] = "";
      return newTerms;
    });

    setShowDropdowns((prev) => {
      const newDropdowns = [...prev];
      newDropdowns[index] = false;
      return newDropdowns;
    });
  }, []);

  const handleSearchChange = useCallback((index: number, value: string) => {
    setSearchTerms((prev) => {
      const newTerms = [...prev];
      newTerms[index] = value;
      return newTerms;
    });

    setShowDropdowns((prev) => {
      const newDropdowns = [...prev];
      newDropdowns[index] = value.length > 0;
      return newDropdowns;
    });
  }, []);

  const handleCompetitionSelect = useCallback((index: number, credential: UserCredential) => {
    setFeatured((prev) => {
      const newFeatured = [...prev];
      newFeatured[index] = {
        ...newFeatured[index],
        type: "competition",
        title: credential.cosplayTitle || credential.competition.name,
        competitionId: credential.competition.id,
        competition: credential.competition,
        position: credential.position,
        imageUrl: credential.imageUrl || newFeatured[index].imageUrl,
      };
      return newFeatured;
    });

    setShowDropdowns((prev) => {
      const newDropdowns = [...prev];
      newDropdowns[index] = false;
      return newDropdowns;
    });

    setSearchTerms((prev) => {
      const newTerms = [...prev];
      newTerms[index] = credential.competition.name;
      return newTerms;
    });
  }, []);

  const handleClearCompetition = useCallback((index: number) => {
    setFeatured((prev) => {
      const newFeatured = [...prev];
      newFeatured[index] = {
        ...newFeatured[index],
        type: "cosplay",
        title: "",
        competitionId: undefined,
        competition: undefined,
        position: undefined,
      };
      return newFeatured;
    });

    setSearchTerms((prev) => {
      const newTerms = [...prev];
      newTerms[index] = "";
      return newTerms;
    });
  }, []);

  const handleImageUpload = useCallback(async (file: File, index: number) => {
    // ✅ Clear previous errors
    setUploadErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });

    // ✅ Validate file type
    if (!file.type.startsWith("image/")) {
      const errorMsg = "Please select an image file";
      setUploadErrors((prev) => ({ ...prev, [index]: errorMsg }));
      return;
    }

    // ✅ Validate file size
    if (file.size > 10 * 1024 * 1024) {
      const errorMsg = "File size must be less than 10MB";
      setUploadErrors((prev) => ({ ...prev, [index]: errorMsg }));
      return;
    }

    setImageUploading((prev) => ({ ...prev, [index]: true }));

    try {
      console.log("Starting upload for index:", index, {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: "cosbaii-profiles",
      });

      const uploadResult = await uploadImage(file, {
        uploadPreset: "cosbaii-profiles",
        folder: `cosbaii/featured-cosplays`,
        onSuccess: (result) => {
          console.log("Featured image upload successful:", {
            index,
            url: result.url,
            publicId: result.publicId,
          });
        },
        onError: (error) => {
          console.error("Featured image upload error:", {
            index,
            error: error.message,
            stack: error.stack,
          });
          setUploadErrors((prev) => ({
            ...prev,
            [index]: error.message || "Upload failed",
          }));
        },
      });

      if (uploadResult) {
        setFeatured((prev) => {
          const newFeatured = [...prev];
          newFeatured[index] = {
            ...newFeatured[index],
            imageUrl: uploadResult.url,
          };
          return newFeatured;
        });
      } else {
        // ✅ Handle case where uploadResult is null
        const errorMsg = "Failed to upload image. Please try again.";
        setUploadErrors((prev) => ({ ...prev, [index]: errorMsg }));
      }
    } catch (error) {
      console.error("Error uploading featured image:", {
        index,
        error,
        message: error instanceof Error ? error.message : "Unknown error",
      });
      
      const errorMsg = error instanceof Error ? error.message : "Failed to upload image. Please try again.";
      setUploadErrors((prev) => ({ ...prev, [index]: errorMsg }));
    } finally {
      setImageUploading((prev) => ({ ...prev, [index]: false }));
    }
  }, [uploadImage]);

  const handleFieldChange = useCallback(
    (index: number, field: keyof FeaturedItem, value: string) => {
      setFeatured((prev) => {
        const newFeatured = [...prev];
        newFeatured[index] = { ...newFeatured[index], [field]: value };
        return newFeatured;
      });
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSaving(true);
    try {
      await onSave(featured);
    } catch (error) {
      console.error("Error saving featured items:", error);
      alert("Failed to save featured items. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (isSaving || Object.values(imageUploading).some(Boolean)) {
      return;
    }
    setSearchTerms(["", "", ""]);
    setShowDropdowns([false, false, false]);
    setUploadErrors({});
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
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={handleClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center">
        <div className="w-full h-full sm:h-auto sm:max-h-[95vh] sm:max-w-6xl sm:m-4 bg-base-100 sm:rounded-2xl shadow-2xl flex flex-col">
          {/* Header - Fixed */}
          <div className="flex-none px-4 sm:px-6 py-4 sm:py-5 border-b border-base-200 bg-base-100 sm:rounded-t-2xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg sm:text-2xl font-bold">Edit Featured Cosplays</h2>
                <p className="text-xs sm:text-sm text-base-content/70 mt-0.5">
                  Showcase your best work (3 slots)
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
          </div>

          {/* Alerts - Fixed */}
          {(uploadError || isSaving || Object.keys(uploadErrors).length > 0) && (
            <div className="flex-none px-4 sm:px-6 pt-3 space-y-2">
              {/* Global upload error */}
              {uploadError && (
                <div className="alert alert-error text-xs sm:text-sm py-2">
                  <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold">Upload Error</p>
                    <p className="text-[11px] mt-0.5">{uploadError}</p>
                  </div>
                </div>
              )}

              {/* Individual item errors */}
              {Object.entries(uploadErrors).map(([index, error]) => (
                <div key={index} className="alert alert-error text-xs sm:text-sm py-2">
                  <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold">Featured #{parseInt(index) + 1} Error</p>
                    <p className="text-[11px] mt-0.5">{error}</p>
                  </div>
                  <button
                    className="btn btn-xs btn-ghost"
                    onClick={() => {
                      setUploadErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors[parseInt(index)];
                        return newErrors;
                      });
                    }}
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* Saving state */}
              {isSaving && (
                <div className="alert alert-info text-xs sm:text-sm py-2">
                  <span className="loading loading-spinner loading-sm"></span>
                  <span>Saving your featured cosplays...</span>
                </div>
              )}
            </div>
          )}

          {/* Content - Scrollable */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 pb-24 sm:pb-6">
              {credentialsLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <span className="loading loading-spinner loading-lg mb-4"></span>
                  <p className="text-sm text-base-content/70">Loading credentials...</p>
                </div>
              ) : (
                <>
                  {/* No Credentials Message */}
                  {userCredentials.length === 0 && (
                    <div className="text-center py-8 bg-base-200/50 rounded-lg mb-6">
                      <h3 className="text-base sm:text-lg font-medium mb-2">
                        No Competition Credentials
                      </h3>
                      <p className="text-xs sm:text-sm text-base-content/70 mb-4 px-4">
                        Add your competition participations to showcase them.
                      </p>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => setShowAddCredentialsModal(true)}
                        disabled={isAnyOperationInProgress}
                      >
                        <PlusIcon className="w-4 h-4" />
                        Add Credentials
                      </button>
                    </div>
                  )}

                  {/* Featured Items Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {featured.map((item, index) => (
                      <FeaturedItemCard
                        key={index}
                        item={item}
                        index={index}
                        searchTerm={searchTerms[index]}
                        showDropdown={showDropdowns[index]}
                        userCredentials={userCredentials}
                        imageUploading={imageUploading[index] || false}
                        disabled={isAnyOperationInProgress}
                        onTypeChange={(type) => handleTypeChange(index, type)}
                        onSearchChange={(value) => handleSearchChange(index, value)}
                        onCompetitionSelect={(credential) =>
                          handleCompetitionSelect(index, credential)
                        }
                        onClearCompetition={() => handleClearCompetition(index)}
                        onImageUpload={(file) => handleImageUpload(file, index)}
                        onFieldChange={(field, value) =>
                          handleFieldChange(index, field, value)
                        }
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Footer - Fixed (Above Mobile Nav) */}
            <div className="flex-none px-4 sm:px-6 py-3 sm:py-4 border-t border-base-200 bg-base-100 sm:rounded-b-2xl fixed sm:relative bottom-16 sm:bottom-0 left-0 right-0 z-10">
              <div className="flex justify-end gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn btn-ghost btn-sm sm:btn-md"
                  disabled={isAnyOperationInProgress}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm sm:btn-md"
                  disabled={isAnyOperationInProgress}
                >
                  {isSaving ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      <span className="hidden sm:inline">Saving...</span>
                    </>
                  ) : (
                    <>
                      Save<span className="hidden sm:inline"> Featured</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Add Credentials Modal */}
      {showAddCredentialsModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-base-100 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Add Competition Credentials</h3>
            <p className="text-sm text-base-content/70 mb-4">
              Add your competition participations first to showcase them in your featured section.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setShowAddCredentialsModal(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setShowAddCredentialsModal(false);
                  handleClose();
                }}
              >
                Go to Credentials
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeaturedCosplaysEditor;