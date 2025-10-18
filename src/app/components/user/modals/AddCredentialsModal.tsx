"use client";

import { useState, useEffect, useRef } from "react";
import { XMarkIcon, MagnifyingGlassIcon, PlusIcon, TrophyIcon, CameraIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import AddNewCompetitionModal from "./AddNewCompetitionModal";
import { useCloudinaryUpload } from "@/hooks/common/useCloudinaryUpload";
import { useToastContext } from "@/app/context/ToastContext";

interface Competition {
  id: number;
  name: string;
  eventDate: string;
  location?: string;
  competitionType: string;
  rivalryType: string;
  level: string;
  logoUrl?: string;
  status: string;
}

interface CredentialResponse {
  credentials?: Array<{
    competitionId: number;
    [key: string]: unknown;
  }>;
}

interface AddCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddCredentialsModal: React.FC<AddCredentialsModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToastContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [showAddCompetitionModal, setShowAddCompetitionModal] = useState(false);
  const [userCredentials, setUserCredentials] = useState<number[]>([]);
  const [imageUploading, setImageUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [participantData, setParticipantData] = useState({
    position: "",
    characterName: "", // ✅ Changed from cosplayTitle to characterName
    seriesName: "", // ✅ Added seriesName field
    description: "",
    imageUrl: "", // ✅ Optional now
    category: "",
  });

  const [submitLoading, setSubmitLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const searchInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, error: uploadError } = useCloudinaryUpload();

  const positionOptions = [
    { value: "CHAMPION", label: "Champion" },
    { value: "FIRST_PLACE", label: "1st Place" },
    { value: "SECOND_PLACE", label: "2nd Place" },
    { value: "THIRD_PLACE", label: "3rd Place" },
    { value: "PARTICIPANT", label: "Participant" },
  ];

  useEffect(() => {
    if (isOpen) {
      fetchUserCredentials();
    }
  }, [isOpen]);

  const fetchUserCredentials = async () => {
    try {
      const response = await fetch('/api/user/credentials');
      if (response.ok) {
        const data = await response.json() as CredentialResponse;
        const competitionIds = data.credentials?.map((cred) => cred.competitionId) || [];
        setUserCredentials(competitionIds);
      }
    } catch (error) {
      console.error('Error fetching user credentials:', error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setImageUploading(true);
    try {
      const uploadResult = await uploadImage(file, {
        uploadPreset: 'cosbaii-profiles',
        folder: 'cosbaii/cosplay-credentials',
        onSuccess: (result) => {
          console.log('Cosplay image upload successful:', result);
          toast.success("Image uploaded successfully!");
        },
        onError: (error) => {
          console.error('Cosplay image upload error:', error);
          toast.error("Failed to upload image");
        }
      });

      if (uploadResult) {
        setParticipantData(prev => ({
          ...prev,
          imageUrl: uploadResult.url
        }));
      }
    } catch (error) {
      console.error('Error uploading cosplay image:', error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setImageUploading(false);
    }

    if (event.target) {
      event.target.value = '';
    }
  };

  useEffect(() => {
    const fetchCompetitions = async () => {
      if (searchTerm.length < 2) {
        setCompetitions([]);
        setShowDropdown(false);
        return;
      }

      if (selectedCompetition && selectedCompetition.name === searchTerm) {
        setShowDropdown(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/competitions/search?q=${encodeURIComponent(searchTerm)}`);
        if (response.ok) {
          const data = await response.json();
          setCompetitions(data.competitions || []);
          setShowDropdown(data.competitions && data.competitions.length > 0);
        } else {
          setCompetitions([]);
          setShowDropdown(false);
        }
      } catch (error) {
        console.error('Error fetching competitions:', error);
        setCompetitions([]);
        setShowDropdown(false);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchCompetitions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedCompetition]);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setSelectedCompetition(null);
      setParticipantData({
        position: "",
        characterName: "",
        seriesName: "",
        description: "",
        imageUrl: "",
        category: "",
      });
      setErrors({});
      setShowDropdown(false);
      setCompetitions([]);
    }
  }, [isOpen]);

  const handleCompetitionSelect = (competition: Competition) => {
    if (!isCompetitionSelectable(competition)) {
      return;
    }
    
    setSelectedCompetition(competition);
    setSearchTerm(competition.name);
    setShowDropdown(false);
    setErrors(prev => ({ ...prev, competition: "" }));
  };

  const isCompetitionSelectable = (competition: Competition) => {
    const isAccepted = competition.status === 'ACCEPTED';
    const alreadyAdded = userCredentials.includes(competition.id);
    return isAccepted && !alreadyAdded;
  };

  const handleClearSelection = () => {
    setSelectedCompetition(null);
    setSearchTerm("");
    setShowDropdown(false);
    setCompetitions([]);
    searchInputRef.current?.focus();
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedCompetition) {
      newErrors.competition = "Please select a competition";
    }

    // ✅ Changed validation from cosplayTitle to characterName
    if (!participantData.characterName.trim()) {
      newErrors.characterName = "Character name is required";
    }

    if (!participantData.position) {
      newErrors.position = "Please select your position";
    }

    // ✅ Image is now optional, no validation needed

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (selectedCompetition && value !== selectedCompetition.name) {
      setSelectedCompetition(null);
    }
    
    if (errors.competition) {
      setErrors(prev => ({ ...prev, competition: "" }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitLoading(true);
    try {
      // ✅ Format data to match API expectations
      const submitData = {
        competitionId: selectedCompetition!.id,
        position: participantData.position,
        // Combine character and series name into cosplayTitle for the API
        cosplayTitle: participantData.seriesName 
          ? `${participantData.characterName} - ${participantData.seriesName}`
          : participantData.characterName,
        description: participantData.description,
        imageUrl: participantData.imageUrl || undefined, // Send undefined if empty
        category: participantData.category || undefined,
      };


      const response = await fetch('/api/user/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Credentials submitted successfully! Pending review.");
        onSuccess();
        onClose();
      } else {
        toast.error(data.error || "Failed to add credential");
        setErrors({ submit: data.error || "Failed to add credential" });
      }
    } catch (error) {
      console.error('Error submitting credentials:', error);
      toast.error("Failed to add credential. Please try again.");
      setErrors({ submit: "Failed to add credential" });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleClose = () => {
    setShowDropdown(false);
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        disabled={imageUploading}
      />

      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={handleClose} />
      
      {/* ✅ Mobile-optimized Modal */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="bg-base-100 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl h-[90vh] sm:h-auto sm:max-h-[90vh] flex flex-col overflow-hidden">
          
          {/* Fixed Header */}
          <div className="flex-shrink-0 flex justify-between items-center p-4 sm:p-6 border-b border-base-200 bg-base-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Add Competition Credentials</h2>
              <p className="text-sm sm:text-base text-base-content/70">Add your participation in a competition</p>
            </div>
            <button
              onClick={handleClose}
              className="btn btn-sm btn-circle btn-ghost"
              disabled={submitLoading}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Upload Error Display */}
          {uploadError && (
            <div className="flex-shrink-0 mx-4 sm:mx-6 mt-4 alert alert-error text-sm">
              <span>{uploadError}</span>
            </div>
          )}

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">

              {/* Competition Search */}
              <div className="space-y-2">
                <label className="label">
                  <span className="label-text font-medium">Search Competition *</span>
                </label>
                <div className="relative">
                  <div className="input-group">
                    <input
                      ref={searchInputRef}
                      type="text"
                      className={`input input-bordered w-full pr-20 text-sm sm:text-base ${errors.competition ? 'input-error' : ''}`}
                      placeholder="Type competition name..."
                      value={searchTerm}
                      onChange={handleInputChange}
                      onFocus={() => {
                        if (!selectedCompetition && searchTerm.length >= 2 && competitions.length > 0) {
                          setShowDropdown(true);
                        }
                      }}
                      disabled={submitLoading}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      {selectedCompetition && (
                        <button
                          type="button"
                          className="btn btn-ghost btn-xs"
                          onClick={handleClearSelection}
                          title="Clear selection"
                        >
                          <XMarkIcon className="w-3 h-3" />
                        </button>
                      )}
                      {loading ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        <MagnifyingGlassIcon className="w-4 h-4 text-base-content/50" />
                      )}
                    </div>
                  </div>

                {/* Dropdown Results */}
                {showDropdown && !selectedCompetition && (
                  <div
                    data-dropdown-content 
                    className="absolute top-full left-0 right-0 z-50 bg-base-100 border border-base-200 rounded-lg mt-1 shadow-lg max-h-60 sm:max-h-80 overflow-y-auto"
                  >
                    {loading ? (
                      // ✅ Loading Skeleton
                      <div className="space-y-0">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="p-3 sm:p-4 border-b border-base-200 last:border-b-0 animate-pulse">
                            <div className="flex items-start gap-2 sm:gap-3">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-base-300 rounded"></div>
                              </div>
                              <div className="flex-1 min-w-0 space-y-2">
                                <div className="h-4 bg-base-300 rounded w-3/4"></div>
                                <div className="h-3 bg-base-300 rounded w-1/2"></div>
                                <div className="flex gap-1 mt-2">
                                  <div className="h-5 bg-base-300 rounded w-16"></div>
                                </div>
                              </div>
                              <div className="flex-shrink-0">
                                <div className="h-5 bg-base-300 rounded w-12"></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : competitions.length > 0 ? (
                      competitions.map((competition) => {
                        const isAccepted = competition.status === 'ACCEPTED';
                        const alreadyAdded = userCredentials.includes(competition.id);
                        const isClickable = isAccepted && !alreadyAdded;
                        
                        return (
                          <div
                            key={competition.id}
                            className={`p-3 sm:p-4 border-b border-base-200 last:border-b-0 relative transition-all duration-200 ${
                              isClickable 
                                ? 'hover:bg-base-200 cursor-pointer active:bg-base-300' 
                                : 'opacity-50 cursor-not-allowed bg-base-100'
                            } ${!isClickable ? 'grayscale' : ''}`}
                            onClick={() => isClickable && handleCompetitionSelect(competition)}
                          >
                            <div className="flex items-start gap-2 sm:gap-3">
                              <div className="relative flex-shrink-0">
                                <Image
                                  src={competition.logoUrl || "/icons/cosbaii-icon-primary.svg"}
                                  alt="Competition Logo"
                                  width={40}
                                  height={40}
                                  className={`w-8 h-8 sm:w-10 sm:h-10 object-cover rounded bg-base-300 ${
                                    !isClickable ? 'grayscale opacity-70' : ''
                                  }`}
                                  onError={(e) => {
                                    e.currentTarget.src = "/icons/cosbaii-icon-primary.svg";
                                  }}
                                />
                                <div className={`absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 rounded-full border-2 border-base-100 ${
                                  alreadyAdded ? 'bg-info' : 
                                  isAccepted ? 'bg-success' : 'bg-warning'
                                }`}></div>
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className={`font-medium text-sm sm:text-base truncate ${!isClickable ? 'text-base-content/60' : ''}`}>
                                  {competition.name}
                                </div>
                                <div className={`text-xs sm:text-sm truncate ${!isClickable ? 'text-base-content/50' : 'text-base-content/70'}`}>
                                  {formatDate(competition.eventDate)}
                                  {competition.location && ` • ${competition.location}`}
                                </div>
                                <div className="flex gap-1 mt-1 flex-wrap">
                                  <span className={`badge badge-outline badge-xs ${!isClickable ? 'opacity-60' : ''}`}>
                                    {competition.competitionType}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex-shrink-0">
                                {alreadyAdded && (
                                  <span className="badge badge-info badge-xs">Added</span>
                                )}
                                {!alreadyAdded && isAccepted && (
                                  <span className="badge badge-success badge-xs hidden sm:inline-flex">Available</span>
                                )}
                              </div>
                            </div>
                            
                            {!isClickable && (
                              <div className="absolute inset-0 bg-base-200/20 rounded pointer-events-none" />
                            )}
                            {alreadyAdded && (
                              <div className="absolute inset-0 bg-info/10 rounded pointer-events-none" />
                            )}
                          </div>
                        );
                      })
                    ) : searchTerm.length >= 2 && !loading ? (
                      <div className="p-4 sm:p-6 text-center">
                        <div className="text-base-content/50 mb-4">
                          <TrophyIcon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 opacity-30" />
                          <p className="font-medium text-sm sm:text-base">No competitions found</p>
                          <p className="text-xs sm:text-sm mt-1">Can&apos;t find the competition you&apos;re looking for?</p>
                        </div>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setShowAddCompetitionModal(true);
                            setShowDropdown(false);
                          }}
                        >
                          <PlusIcon className="w-4 h-4" />
                          Submit New Competition
                        </button>
                      </div>
                    ) : null}
                  </div>
                )}
                  {errors.competition && (
                    <label className="label">
                      <span className="label-text-alt text-error text-xs">{errors.competition}</span>
                    </label>
                  )}
                </div>

                {/* No Search Results Helper */}
                {searchTerm.length < 2 && (
                  <div className="text-center py-4 sm:py-6 bg-base-200 rounded-lg">
                    <TrophyIcon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm sm:text-base text-base-content/70 mb-2">Start typing to search competitions</p>
                    <p className="text-xs sm:text-sm text-base-content/50">Can&apos;t find your competition?</p>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm mt-2"
                      onClick={() => setShowAddCompetitionModal(true)}
                    >
                      <PlusIcon className="w-4 h-4" />
                      Submit New Competition
                    </button>
                  </div>
                )}
              </div>

              {/* Selected Competition Display */}
              {selectedCompetition && (
                <div className="bg-base-200 rounded-lg p-3 sm:p-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Image
                      src={selectedCompetition.logoUrl || "/icons/cosbaii-icon-primary.svg"}
                      alt="Competition Logo"
                      width={48}
                      height={48}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded bg-base-300"
                      onError={(e) => {
                        e.currentTarget.src = "/icons/cosbaii-icon-primary.svg";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm sm:text-base truncate">{selectedCompetition.name}</h4>
                      <p className="text-xs sm:text-sm text-base-content/70 truncate">
                        {formatDate(selectedCompetition.eventDate)}
                        {selectedCompetition.location && ` • ${selectedCompetition.location}`}
                      </p>
                      <div className="flex gap-1 mt-2 flex-wrap">
                        <span className="badge badge-outline badge-xs">
                          {selectedCompetition.competitionType}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Participation Details */}
              {selectedCompetition && (
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold border-b border-base-200 pb-2">
                    Your Participation Details
                  </h3>

                  {/* Position */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-sm sm:text-base">Position/Result *</span>
                    </label>
                    <select
                      className={`select select-bordered text-sm sm:text-base ${errors.position ? 'select-error' : ''}`}
                      value={participantData.position}
                      onChange={(e) => {
                        setParticipantData(prev => ({ ...prev, position: e.target.value }));
                        setErrors(prev => ({ ...prev, position: "" }));
                      }}
                      disabled={submitLoading}
                    >
                      <option value="">Select your position</option>
                      {positionOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.position && (
                      <label className="label">
                        <span className="label-text-alt text-error text-xs">{errors.position}</span>
                      </label>
                    )}
                  </div>

                  {/* ✅ Character Name and Series Name in 2-column grid on desktop */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium text-sm sm:text-base">Character *</span>
                      </label>
                      <input
                        type="text"
                        className={`input input-bordered text-sm sm:text-base ${errors.characterName ? 'input-error' : ''}`}
                        placeholder="e.g., Sakura Haruno"
                        value={participantData.characterName}
                        onChange={(e) => {
                          setParticipantData(prev => ({ ...prev, characterName: e.target.value }));
                          setErrors(prev => ({ ...prev, characterName: "" }));
                        }}
                        disabled={submitLoading}
                        maxLength={200}
                      />
                      {errors.characterName && (
                        <label className="label">
                          <span className="label-text-alt text-error text-xs">{errors.characterName}</span>
                        </label>
                      )}
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium text-sm sm:text-base">Series/Movie</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered text-sm sm:text-base"
                        placeholder="e.g., Naruto Shippuden"
                        value={participantData.seriesName}
                        onChange={(e) => setParticipantData(prev => ({ ...prev, seriesName: e.target.value }))}
                        disabled={submitLoading}
                        maxLength={200}
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-sm sm:text-base">Category</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered text-sm sm:text-base"
                      placeholder="e.g., Individual, Group, Best in Craftsmanship"
                      value={participantData.category}
                      onChange={(e) => setParticipantData(prev => ({ ...prev, category: e.target.value }))}
                      disabled={submitLoading}
                      maxLength={100}
                    />
                  </div>

                  {/* ✅ Cosplay Image Upload Section - Optional */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-sm sm:text-base">Cosplay Photo (Optional)</span>
                    </label>
                    
                    <div className="space-y-3">
                      {participantData.imageUrl ? (
                        <div className="relative w-full h-40 sm:h-48 bg-base-200 rounded-lg overflow-hidden">
                          <Image
                            src={participantData.imageUrl}
                            alt="Cosplay preview"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              className="btn btn-sm btn-primary"
                              onClick={() => !imageUploading && imageInputRef.current?.click()}
                              disabled={imageUploading || submitLoading}
                            >
                              {imageUploading ? (
                                <>
                                  <span className="loading loading-spinner loading-sm mr-2"></span>
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <CameraIcon className="w-4 h-4 mr-2" />
                                  Change Photo
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="w-full h-32 sm:h-40 bg-base-200 rounded-lg border-2 border-dashed border-base-300 hover:border-primary transition-colors cursor-pointer flex flex-col items-center justify-center"
                          onClick={() => !imageUploading && !submitLoading && imageInputRef.current?.click()}
                        >
                          {imageUploading ? (
                            <div className="text-center">
                              <span className="loading loading-spinner loading-md mb-2"></span>
                              <p className="text-xs sm:text-sm text-base-content/70">Uploading photo...</p>
                            </div>
                          ) : (
                            <div className="text-center px-4">
                              <CameraIcon className="w-8 h-8 sm:w-10 sm:h-10 text-base-content/50 mb-2 mx-auto" />
                              <p className="text-xs sm:text-sm text-base-content/70 mb-1">Click to upload cosplay photo</p>
                              <p className="text-xs text-base-content/50">PNG, JPG up to 10MB</p>
                            </div>
                          )}
                        </div>
                      )}

                      <button
                        type="button"
                        className="btn btn-outline btn-sm w-full sm:w-auto"
                        onClick={() => !imageUploading && !submitLoading && imageInputRef.current?.click()}
                        disabled={imageUploading || submitLoading}
                      >
                        {imageUploading ? (
                          <>
                            <span className="loading loading-spinner loading-sm mr-2"></span>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <CameraIcon className="w-4 h-4 mr-2" />
                            {participantData.imageUrl ? 'Change Photo' : 'Upload Photo'}
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-sm sm:text-base">Description</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered h-20 text-sm sm:text-base"
                      placeholder="Tell us about your cosplay experience..."
                      value={participantData.description}
                      onChange={(e) => setParticipantData(prev => ({ ...prev, description: e.target.value }))}
                      disabled={submitLoading}
                      maxLength={5000}
                    />
                  </div>
                </div>
              )}

              {/* Submit Error */}
              {errors.submit && (
                <div className="alert alert-error text-sm">
                  <span>{errors.submit}</span>
                </div>
              )}

            </div>
          </div>

          {/* Fixed Footer */}
          <div className="flex-shrink-0 p-4 sm:p-6 border-t border-base-200 bg-base-100 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-ghost order-2 sm:order-1"
              disabled={submitLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-primary order-1 sm:order-2"
              disabled={submitLoading || !selectedCompetition || imageUploading}
            >
              {submitLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Adding...
                </>
              ) : (
                "Add Credential"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Add Competition Modal */}
      <AddNewCompetitionModal
        isOpen={showAddCompetitionModal}
        onClose={() => setShowAddCompetitionModal(false)}
        onSuccess={() => {
          setShowAddCompetitionModal(false);
        }}
      />
    </>
  );
};

export default AddCredentialsModal;