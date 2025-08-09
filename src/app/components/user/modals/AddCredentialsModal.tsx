// Update: src/app/components/user/modals/AddCredentialsModal.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { XMarkIcon, MagnifyingGlassIcon, PlusIcon, TrophyIcon, CameraIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import AddNewCompetitionModal from "./AddNewCompetitionModal";
import { useCloudinaryUpload } from "@/hooks/common/useCloudinaryUpload";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [showAddCompetitionModal, setShowAddCompetitionModal] = useState(false);
  
  // ✅ Add state for user's existing credentials
  const [userCredentials, setUserCredentials] = useState<number[]>([]);
  const [credentialsLoading, setCredentialsLoading] = useState(false);

  const [imageUploading, setImageUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [participantData, setParticipantData] = useState({
    position: "",
    cosplayTitle: "",
    description: "",
    imageUrl: "",
    category: "",
  });

  const [submitLoading, setSubmitLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const searchInputRef = useRef<HTMLInputElement>(null);

  const { uploadImage, uploading, error: uploadError } = useCloudinaryUpload();

  const positionOptions = [
    { value: "CHAMPION", label: "Champion" },
    { value: "FIRST_PLACE", label: "1st Place" },
    { value: "SECOND_PLACE", label: "2nd Place" },
    { value: "THIRD_PLACE", label: "3rd Place" },
    { value: "PARTICIPANT", label: "Participant" },
  ];

  // ✅ Fetch user's existing credentials when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchUserCredentials();
    }
  }, [isOpen]);

  const fetchUserCredentials = async () => {
    setCredentialsLoading(true);
    try {
      const response = await fetch('/api/user/credentials');
      if (response.ok) {
        const data = await response.json();
        // Extract competition IDs from user's credentials
        const competitionIds = data.credentials?.map((cred: any) => cred.competitionId) || [];
        setUserCredentials(competitionIds);
      }
    } catch (error) {
      console.error('Error fetching user credentials:', error);
    } finally {
      setCredentialsLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

    setImageUploading(true);
    try {
      const uploadResult = await uploadImage(file, {
        uploadPreset: 'cosbaii-profiles',
        folder: 'cosbaii/cosplay-credentials',
        onSuccess: (result) => {
          console.log('Cosplay image upload successful:', result);
        },
        onError: (error) => {
          console.error('Cosplay image upload error:', error);
        }
      });

      if (uploadResult) {
        setParticipantData(prev => ({
          ...prev,
          imageUrl: uploadResult.url
        }));
        console.log('Cosplay image uploaded successfully:', uploadResult.url);
      }

    } catch (error) {
      console.error('Error uploading cosplay image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setImageUploading(false);
    }

    if (event.target) {
      event.target.value = '';
    }
  };

  // Fetch competitions when search term changes
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
          console.error('Search API error:', response.status);
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

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setSelectedCompetition(null);
      setParticipantData({
        position: "",
        cosplayTitle: "",
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
    // ✅ Check if competition is selectable
    if (!isCompetitionSelectable(competition)) {
      return;
    }
    
    setSelectedCompetition(competition);
    setSearchTerm(competition.name);
    setShowDropdown(false);
    setErrors(prev => ({ ...prev, competition: "" }));
  };

  // ✅ Helper function to check if competition is selectable
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

    if (!participantData.cosplayTitle.trim()) {
      newErrors.cosplayTitle = "Cosplay title is required";
    }

    if (!participantData.position) {
      newErrors.position = "Please select your position";
    }

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
      const response = await fetch('/api/user/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competitionId: selectedCompetition!.id,
          ...participantData,
        }),
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        const error = await response.json();
        setErrors({ submit: error.error || "Failed to add credential" });
      }
    } catch (error) {
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
      
      {/* ✅ Updated Modal with fixed height and scrollable content */}
      <div className="fixed inset-4 z-50 flex items-center justify-center p-4">
        <div className="bg-base-100 rounded-2xl shadow-2xl max-w-2xl w-full h-[60vh] flex flex-col overflow-hidden">
          
          {/* ✅ Fixed Header - doesn't scroll */}
          <div className="flex-shrink-0 flex justify-between items-center p-6 border-b border-base-200 bg-base-100">
            <div>
              <h2 className="text-2xl font-bold">Add Competition Credentials</h2>
              <p className="text-base-content/70">Add your participation in a competition</p>
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
            <div className="flex-shrink-0 mx-6 mt-4 alert alert-error">
              <span>{uploadError}</span>
            </div>
          )}

          {/* ✅ Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">

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
                      className={`input input-bordered w-full pr-20 ${errors.competition ? 'input-error' : ''}`}
                      placeholder="Type competition name (min 2 characters)..."
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

                  {/* ✅ Updated Dropdown Results with scrollable area */}
                  {showDropdown && !selectedCompetition && (
                    <div
                      data-dropdown-content 
                      className="absolute top-full left-0 right-0 z-50 bg-base-100 border border-base-200 rounded-lg mt-1 shadow-lg max-h-80 overflow-y-auto"
                    >
                      {competitions.length > 0 ? (
                        competitions.map((competition) => {
                          const isUnderReview = competition.status === 'SUBMITTED';
                          const isRejected = competition.status === 'REJECTED';
                          const isAccepted = competition.status === 'ACCEPTED';
                          const alreadyAdded = userCredentials.includes(competition.id);
                          const isClickable = isAccepted && !alreadyAdded;
                          
                          return (
                            <div
                              key={competition.id}
                              className={`p-4 border-b border-base-200 last:border-b-0 relative transition-all duration-200 ${
                                isClickable 
                                  ? 'hover:bg-base-200 cursor-pointer' 
                                  : 'opacity-50 cursor-not-allowed bg-base-100'
                              } ${!isClickable ? 'grayscale' : ''}`}
                              onClick={() => isClickable && handleCompetitionSelect(competition)}
                              title={
                                alreadyAdded 
                                  ? "You already have credentials for this competition"
                                  : isUnderReview 
                                  ? "This competition is pending admin approval" 
                                  : isRejected 
                                  ? "This competition was rejected by admin"
                                  : "Click to select this competition"
                              }
                            >
                              <div className="flex items-start gap-3">
                                <div className="relative">
                                  <img
                                    src={competition.logoUrl || "/icons/cosbaii-icon-primary.svg"}
                                    alt="Competition Logo"
                                    className={`w-10 h-10 object-cover rounded bg-base-300 ${
                                      !isClickable ? 'grayscale opacity-70' : ''
                                    }`}
                                    onError={(e) => {
                                      e.currentTarget.src = "/icons/cosbaii-icon-primary.svg";
                                    }}
                                  />
                                  {/* Status indicator dot */}
                                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-base-100 ${
                                    alreadyAdded ? 'bg-info' : 
                                    isAccepted ? 'bg-success' : 
                                    isUnderReview ? 'bg-warning' : 'bg-error'
                                  }`}></div>
                                </div>
                                
                                <div className="flex-1">
                                  <div className={`font-medium ${!isClickable ? 'text-base-content/60' : ''}`}>
                                    {competition.name}
                                  </div>
                                  <div className={`text-sm ${!isClickable ? 'text-base-content/50' : 'text-base-content/70'}`}>
                                    {formatDate(competition.eventDate)}
                                    {competition.location && ` • ${competition.location}`}
                                  </div>
                                  <div className="flex gap-1 mt-1 flex-wrap">
                                    <span className={`badge badge-outline badge-xs ${!isClickable ? 'opacity-60' : ''}`}>
                                      {competition.competitionType}
                                    </span>
                                    <span className={`badge badge-info badge-xs ${!isClickable ? 'opacity-60' : ''}`}>
                                      {competition.rivalryType}
                                    </span>
                                    <span className={`badge badge-accent badge-xs ${!isClickable ? 'opacity-60' : ''}`}>
                                      {competition.level}
                                    </span>
                                  </div>
                                </div>
                                
                                {/* ✅ Enhanced Status Badge with "Already Added" indicator */}
                                <div className="flex flex-col items-end gap-1 min-w-[90px]">
                                  {alreadyAdded && (
                                    <div className="flex items-center gap-1">
                                      <span className="badge badge-info badge-xs">
                                        Already Added
                                      </span>
                                      <div className="tooltip tooltip-left" data-tip="You already have credentials for this competition">
                                        <svg className="w-3 h-3 text-info" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {!alreadyAdded && isAccepted && (
                                    <div className="flex items-center gap-1">
                                      <span className="badge badge-success badge-xs">
                                        Available
                                      </span>
                                    </div>
                                  )}
                                  
                                  {!alreadyAdded && isUnderReview && (
                                    <div className="flex items-center gap-1">
                                      <span className="badge badge-warning badge-xs">
                                        Under Review
                                      </span>
                                      <div className="tooltip tooltip-left" data-tip="Pending admin approval">
                                        <svg className="w-3 h-3 text-warning animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                        </svg>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {!alreadyAdded && isRejected && (
                                    <div className="flex items-center gap-1">
                                      <span className="badge badge-error badge-xs">
                                        Rejected
                                      </span>
                                      <div className="tooltip tooltip-left" data-tip="Rejected by admin">
                                        <svg className="w-3 h-3 text-error" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {!isClickable && (
                                    <div className="text-xs text-base-content/40 mt-1 text-center">
                                      Not selectable
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Subtle overlay for non-clickable items */}
                              {!isClickable && (
                                <div className="absolute inset-0 bg-base-200/20 rounded pointer-events-none" />
                              )}
                              
                              {/* ✅ Blue overlay for already added competitions */}
                              {alreadyAdded && (
                                <div className="absolute inset-0 bg-info/10 rounded pointer-events-none" />
                              )}
                              
                              {/* Striped pattern for rejected competitions */}
                              {isRejected && (
                                <div className="absolute inset-0 bg-repeat opacity-10 pointer-events-none" 
                                  style={{
                                    backgroundImage: `repeating-linear-gradient(
                                      45deg,
                                      transparent,
                                      transparent 5px,
                                      rgba(239, 68, 68, 0.3) 5px,
                                      rgba(239, 68, 68, 0.3) 10px
                                    )`
                                  }} />
                              )}
                            </div>
                          );
                        })
                      ) : searchTerm.length >= 2 && !loading ? (
                        <div className="p-6 text-center">
                          <div className="text-base-content/50 mb-4">
                            <TrophyIcon className="w-12 h-12 mx-auto mb-2 opacity-30" />
                            <p className="font-medium">No competitions found</p>
                            <p className="text-sm mt-1">Can't find the competition you're looking for?</p>
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
                      ) : loading ? (
                        <div className="p-4 text-center">
                          <span className="loading loading-spinner loading-sm"></span>
                          <p className="text-sm text-base-content/70 ml-2">Searching...</p>
                        </div>
                      ) : null}
                    </div>
                  )}

                  {errors.competition && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.competition}</span>
                    </label>
                  )}
                </div>

                {/* No Search Results Helper */}
                {searchTerm.length < 2 && (
                  <div className="text-center py-6 bg-base-200 rounded-lg">
                    <TrophyIcon className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p className="text-base-content/70 mb-2">Start typing to search competitions</p>
                    <p className="text-sm text-base-content/50">Can't find your competition?</p>
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
                <div className="bg-base-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={selectedCompetition.logoUrl || "/icons/cosbaii-icon-primary.svg"}
                      alt="Competition Logo"
                      className="w-12 h-12 object-cover rounded bg-base-300"
                      onError={(e) => {
                        e.currentTarget.src = "/icons/cosbaii-icon-primary.svg";
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{selectedCompetition.name}</h4>
                      <p className="text-sm text-base-content/70">
                        {formatDate(selectedCompetition.eventDate)}
                        {selectedCompetition.location && ` • ${selectedCompetition.location}`}
                      </p>
                      <div className="flex gap-1 mt-2">
                        <span className="badge badge-outline badge-xs">
                          {selectedCompetition.competitionType}
                        </span>
                        <span className="badge badge-info badge-xs">
                          {selectedCompetition.rivalryType}
                        </span>
                        <span className="badge badge-accent badge-xs">
                          {selectedCompetition.level}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Participation Details */}
              {selectedCompetition && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b border-base-200 pb-2">
                    Your Participation Details
                  </h3>

                  {/* Position and Cosplay Title */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Position/Result *</span>
                      </label>
                      <select
                        className={`select select-bordered ${errors.position ? 'select-error' : ''}`}
                        value={participantData.position}
                        onChange={(e) => setParticipantData(prev => ({ ...prev, position: e.target.value }))}
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
                          <span className="label-text-alt text-error">{errors.position}</span>
                        </label>
                      )}
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Cosplay Title *</span>
                      </label>
                      <input
                        type="text"
                        className={`input input-bordered ${errors.cosplayTitle ? 'input-error' : ''}`}
                        placeholder="Name of your cosplay"
                        value={participantData.cosplayTitle}
                        onChange={(e) => setParticipantData(prev => ({ ...prev, cosplayTitle: e.target.value }))}
                        disabled={submitLoading}
                      />
                      {errors.cosplayTitle && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.cosplayTitle}</span>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Category */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Category</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      placeholder="e.g., Individual, Group, Best in Craftsmanship"
                      value={participantData.category}
                      onChange={(e) => setParticipantData(prev => ({ ...prev, category: e.target.value }))}
                      disabled={submitLoading}
                    />
                  </div>

                  {/* Cosplay Image Upload Section */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Cosplay Photo</span>
                    </label>
                    
                    <div className="space-y-3">
                      {participantData.imageUrl ? (
                        <div className="relative w-full h-48 bg-base-200 rounded-lg overflow-hidden">
                          <Image
                            src={participantData.imageUrl}
                            alt="Cosplay preview"
                            fill
                            className="object-cover"
                            onError={(e) => {
                              console.error('Failed to load cosplay image:', participantData.imageUrl);
                            }}
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
                          className="w-full h-48 bg-base-200 rounded-lg border-2 border-dashed border-base-300 hover:border-primary transition-colors cursor-pointer flex flex-col items-center justify-center"
                          onClick={() => !imageUploading && !submitLoading && imageInputRef.current?.click()}
                        >
                          {imageUploading ? (
                            <div className="text-center">
                              <span className="loading loading-spinner loading-lg mb-2"></span>
                              <p className="text-sm text-base-content/70">Uploading photo...</p>
                            </div>
                          ) : (
                            <div className="text-center">
                              <CameraIcon className="w-12 h-12 text-base-content/50 mb-2" />
                              <p className="text-sm text-base-content/70 mb-1">Click to upload cosplay photo</p>
                              <p className="text-xs text-base-content/50">PNG, JPG, GIF up to 10MB</p>
                            </div>
                          )}
                        </div>
                      )}

                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
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
                      <span className="label-text font-medium">Description</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered h-20"
                      placeholder="Tell us about your cosplay experience in this competition..."
                      value={participantData.description}
                      onChange={(e) => setParticipantData(prev => ({ ...prev, description: e.target.value }))}
                      disabled={submitLoading}
                    />
                  </div>
                </div>
              )}

              {/* Submit Error */}
              {errors.submit && (
                <div className="alert alert-error">
                  <span>{errors.submit}</span>
                </div>
              )}

            </div>
          </div>

          {/* ✅ Fixed Footer - doesn't scroll */}
          <div className="flex-shrink-0 p-6 border-t border-base-200 bg-base-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-ghost"
              disabled={submitLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-primary"
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