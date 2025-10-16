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
    cosplayTitle: "",
    characterName: "",
    seriesName: "",
    description: "",
    imageUrl: "",
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

  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setSelectedCompetition(null);
      setParticipantData({
        position: "",
        cosplayTitle: "",
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
      const payload = {
        competitionId: selectedCompetition!.id,
        cosplayTitle: participantData.cosplayTitle,
        characterName: participantData.characterName || undefined,
        seriesName: participantData.seriesName || undefined,
        description: participantData.description || undefined,
        imageUrl: participantData.imageUrl || undefined,
        category: participantData.category || undefined,
        position: participantData.position,
      };

      console.log('Submitting payload:', payload);

      const response = await fetch('/api/user/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      console.log('Response:', responseData);

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        console.error('API Error:', responseData);
        setErrors({ 
          submit: responseData.error || responseData.details 
            ? JSON.stringify(responseData.details) 
            : "Failed to add credential" 
        });
      }
    } catch (error) {
      console.error('Submit error:', error);
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
      
      {/* Modal - Responsive height and padding */}
      <div className="fixed inset-2 sm:inset-4 z-50 flex items-center justify-center p-2 sm:p-4">
        <div className="bg-base-100 rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full h-[80vh] sm:h-[80vh] md:h-[80vh] flex flex-col overflow-hidden">
          
          {/* Fixed Header */}
          <div className="flex-shrink-0 flex justify-between items-start sm:items-center p-4 sm:p-6 border-b border-base-200 bg-base-100">
            <div className="flex-1 pr-2">
              <h2 className="text-lg sm:text-2xl font-bold">Add Competition Credentials</h2>
              <p className="text-xs sm:text-sm text-base-content/70 mt-1">Add your participation in a competition</p>
            </div>
            <button
              onClick={handleClose}
              className="btn btn-sm btn-circle btn-ghost flex-shrink-0"
              disabled={submitLoading}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Upload Error Display */}
          {uploadError && (
            <div className="flex-shrink-0 mx-4 sm:mx-6 mt-3 sm:mt-4 alert alert-error text-sm">
              <span>{uploadError}</span>
            </div>
          )}

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">

              {/* Competition Search */}
              <div className="space-y-2">
                <label className="label py-1">
                  <span className="label-text font-medium text-sm sm:text-base">Search Competition *</span>
                </label>
                <div className="relative">
                  <div className="input-group">
                    <input
                      ref={searchInputRef}
                      type="text"
                      className={`input input-bordered input-sm sm:input-md w-full pr-20 text-sm sm:text-base ${errors.competition ? 'input-error' : ''}`}
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

                  {/* Dropdown Results */}
                  {showDropdown && !selectedCompetition && (
                    <div
                      data-dropdown-content 
                      className="absolute top-full left-0 right-0 z-50 bg-base-100 border border-base-200 rounded-lg mt-1 shadow-lg max-h-60 sm:max-h-80 overflow-y-auto"
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
                              className={`p-3 sm:p-4 border-b border-base-200 last:border-b-0 relative transition-all duration-200 ${
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
                                  <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-base-100 ${
                                    alreadyAdded ? 'bg-info' : 
                                    isAccepted ? 'bg-success' : 
                                    isUnderReview ? 'bg-warning' : 'bg-error'
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
                                    <span className={`badge badge-info badge-xs ${!isClickable ? 'opacity-60' : ''}`}>
                                      {competition.rivalryType}
                                    </span>
                                    <span className={`badge badge-accent badge-xs ${!isClickable ? 'opacity-60' : ''}`}>
                                      {competition.level}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="flex flex-col items-end gap-1 min-w-[70px] sm:min-w-[90px] flex-shrink-0">
                                  {alreadyAdded && (
                                    <div className="flex items-center gap-1">
                                      <span className="badge badge-info badge-xs text-[10px]">
                                        Already Added
                                      </span>
                                    </div>
                                  )}
                                  
                                  {!alreadyAdded && isAccepted && (
                                    <span className="badge badge-success badge-xs text-[10px]">
                                      Available
                                    </span>
                                  )}
                                  
                                  {!alreadyAdded && isUnderReview && (
                                    <span className="badge badge-warning badge-xs text-[10px]">
                                      Under Review
                                    </span>
                                  )}
                                  
                                  {!alreadyAdded && isRejected && (
                                    <span className="badge badge-error badge-xs text-[10px]">
                                      Rejected
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              {!isClickable && (
                                <div className="absolute inset-0 bg-base-200/20 rounded pointer-events-none" />
                              )}
                              
                              {alreadyAdded && (
                                <div className="absolute inset-0 bg-info/10 rounded pointer-events-none" />
                              )}
                              
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
                        <div className="p-4 sm:p-6 text-center">
                          <div className="text-base-content/50 mb-3 sm:mb-4">
                            <TrophyIcon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 opacity-30" />
                            <p className="font-medium text-sm sm:text-base">No competitions found</p>
                            <p className="text-xs sm:text-sm mt-1">Can&apos;t find the competition you&apos;re looking for?</p>
                          </div>
                          <button
                            type="button"
                            className="btn btn-primary btn-xs sm:btn-sm"
                            onClick={() => {
                              setShowAddCompetitionModal(true);
                              setShowDropdown(false);
                            }}
                          >
                            <PlusIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                            Submit New Competition
                          </button>
                        </div>
                      ) : loading ? (
                        <div className="p-3 sm:p-4 text-center">
                          <span className="loading loading-spinner loading-sm"></span>
                          <p className="text-xs sm:text-sm text-base-content/70 ml-2">Searching...</p>
                        </div>
                      ) : null}
                    </div>
                  )}

                  {errors.competition && (
                    <label className="label py-1">
                      <span className="label-text-alt text-error text-xs">{errors.competition}</span>
                    </label>
                  )}
                </div>

                {/* No Search Results Helper */}
                {searchTerm.length < 2 && (
                  <div className="text-center py-4 sm:py-6 bg-base-200 rounded-lg">
                    <TrophyIcon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 opacity-30" />
                    <p className="text-base-content/70 mb-2 text-xs sm:text-sm">Start typing to search competitions</p>
                    <p className="text-xs sm:text-sm text-base-content/50">Can&apos;t find your competition?</p>
                    <button
                      type="button"
                      className="btn btn-primary btn-xs sm:btn-sm mt-2"
                      onClick={() => setShowAddCompetitionModal(true)}
                    >
                      <PlusIcon className="w-3 h-3 sm:w-4 sm:h-4" />
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
                      <div className="flex gap-1 mt-1 sm:mt-2 flex-wrap">
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
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold border-b border-base-200 pb-2">
                    Your Participation Details
                  </h3>

                  {/* Position and Cosplay Title */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="form-control">
                      <label className="label py-1">
                        <span className="label-text font-medium text-sm sm:text-base">Position/Result *</span>
                      </label>
                      <select
                        className={`select select-bordered select-sm sm:select-md text-sm sm:text-base ${errors.position ? 'select-error' : ''}`}
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
                        <label className="label py-1">
                          <span className="label-text-alt text-error text-xs">{errors.position}</span>
                        </label>
                      )}
                    </div>

                    <div className="form-control">
                      <label className="label py-1">
                        <span className="label-text font-medium text-sm sm:text-base">Cosplay Title *</span>
                      </label>
                      <input
                        type="text"
                        className={`input input-bordered input-sm sm:input-md text-sm sm:text-base ${errors.cosplayTitle ? 'input-error' : ''}`}
                        placeholder="Name of your cosplay"
                        value={participantData.cosplayTitle}
                        onChange={(e) => setParticipantData(prev => ({ ...prev, cosplayTitle: e.target.value }))}
                        disabled={submitLoading}
                      />
                      {errors.cosplayTitle && (
                        <label className="label py-1">
                          <span className="label-text-alt text-error text-xs">{errors.cosplayTitle}</span>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Character Name and Series Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="form-control">
                      <label className="label py-1">
                        <span className="label-text font-medium text-sm sm:text-base">Character Name</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered input-sm sm:input-md text-sm sm:text-base"
                        placeholder="e.g., Gojo Satoru"
                        value={participantData.characterName}
                        onChange={(e) => setParticipantData(prev => ({ ...prev, characterName: e.target.value }))}
                        disabled={submitLoading}
                      />
                    </div>

                    <div className="form-control">
                      <label className="label py-1">
                        <span className="label-text font-medium text-sm sm:text-base">Series Name</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered input-sm sm:input-md text-sm sm:text-base"
                        placeholder="e.g., Jujutsu Kaisen"
                        value={participantData.seriesName}
                        onChange={(e) => setParticipantData(prev => ({ ...prev, seriesName: e.target.value }))}
                        disabled={submitLoading}
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-medium text-sm sm:text-base">Category</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered input-sm sm:input-md text-sm sm:text-base"
                      placeholder="e.g., Individual, Group, Best in Craftsmanship"
                      value={participantData.category}
                      onChange={(e) => setParticipantData(prev => ({ ...prev, category: e.target.value }))}
                      disabled={submitLoading}
                    />
                  </div>

                  {/* Cosplay Image Upload Section */}
                  <div className="form-control">
                    <label className="label py-1 flex-col items-start sm:flex-row sm:items-center">
                      <span className="label-text font-medium text-sm sm:text-base">Cosplay Photo</span>
                      <small className="text-[10px] sm:text-xs text-gray-500 mt-1 sm:mt-0">Note: Don&apos;t upload a photo if you want to show competition logo</small>
                    </label>
                    
                    <div className="space-y-2 sm:space-y-3">
                      {participantData.imageUrl ? (
                        <div className="relative w-full h-32 sm:h-48 bg-base-200 rounded-lg overflow-hidden">
                          <Image
                            src={participantData.imageUrl}
                            alt="Cosplay preview"
                            fill
                            className="object-cover"
                            onError={() => {
                              console.error('Failed to load cosplay image:', participantData.imageUrl);
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              className="btn btn-xs sm:btn-sm btn-primary"
                              onClick={() => !imageUploading && imageInputRef.current?.click()}
                              disabled={imageUploading || submitLoading}
                            >
                              {imageUploading ? (
                                <>
                                  <span className="loading loading-spinner loading-xs sm:loading-sm mr-1 sm:mr-2"></span>
                                  <span className="text-xs sm:text-sm">Uploading...</span>
                                </>
                              ) : (
                                <>
                                  <CameraIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                  <span className="text-xs sm:text-sm">Change Photo</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="w-full h-32 sm:h-48 bg-base-200 rounded-lg border-2 border-dashed border-base-300 hover:border-primary transition-colors cursor-pointer flex flex-col items-center justify-center"
                          onClick={() => !imageUploading && !submitLoading && imageInputRef.current?.click()}
                        >
                          {imageUploading ? (
                            <div className="text-center">
                              <span className="loading loading-spinner loading-md sm:loading-lg mb-2"></span>
                              <p className="text-xs sm:text-sm text-base-content/70">Uploading photo...</p>
                            </div>
                          ) : (
                            <div className="text-center px-4">
                              <CameraIcon className="w-10 h-10 sm:w-12 sm:h-12 text-base-content/50 mb-2 mx-auto" />
                              <p className="text-xs sm:text-sm text-base-content/70 mb-1">Click to upload cosplay photo</p>
                              <p className="text-[10px] sm:text-xs text-base-content/50">PNG, JPG, GIF up to 10MB</p>
                            </div>
                          )}
                        </div>
                      )}

                      <button
                        type="button"
                        className="btn btn-outline btn-xs sm:btn-sm w-full sm:w-auto"
                        onClick={() => !imageUploading && !submitLoading && imageInputRef.current?.click()}
                        disabled={imageUploading || submitLoading}
                      >
                        {imageUploading ? (
                          <>
                            <span className="loading loading-spinner loading-xs sm:loading-sm mr-1 sm:mr-2"></span>
                            <span className="text-xs sm:text-sm">Uploading...</span>
                          </>
                        ) : (
                          <>
                            <CameraIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            <span className="text-xs sm:text-sm">{participantData.imageUrl ? 'Change Photo' : 'Upload Photo'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-medium text-sm sm:text-base">Description</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered textarea-sm sm:textarea-md h-16 sm:h-20 text-sm sm:text-base"
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
                <div className="alert alert-error text-sm">
                  <span>{errors.submit}</span>
                </div>
              )}

            </div>
          </div>

          {/* Fixed Footer */}
          <div className="flex-shrink-0 p-4 sm:p-6 border-t border-base-200 bg-base-100 flex justify-end gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-ghost btn-sm sm:btn-md text-xs sm:text-sm"
              disabled={submitLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-primary btn-sm sm:btn-md text-xs sm:text-sm"
              disabled={submitLoading || !selectedCompetition || imageUploading}
            >
              {submitLoading ? (
                <>
                  <span className="loading loading-spinner loading-xs sm:loading-sm"></span>
                  <span className="hidden sm:inline">Adding...</span>
                  <span className="sm:hidden">Adding...</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Add Credential</span>
                  <span className="sm:hidden">Add</span>
                </>
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