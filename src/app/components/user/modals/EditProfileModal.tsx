"use client";

import { useState, useEffect, useRef } from "react";
import { XMarkIcon, CameraIcon, PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

type CosplayerType = "COMPETITIVE" | "HOBBY" | "PROFESSIONAL";
type SkillLevel = "beginner" | "intermediate" | "advanced";

interface Competition {
  id: number;
  name: string;
  eventDate: string;
  location?: string;
  competitionType: string;
  rivalryType: string;
  level: string;
}

interface UserCredential {
  id: number;
  competition: Competition;
  cosplayTitle?: string;
  position?: string;
  category?: string;
  imageUrl?: string;
}

interface FeaturedItem {
  id?: number;
  title: string;
  description: string;
  imageUrl: string;
  character?: string;
  series?: string;
  competitionId?: number;
  competition?: Competition;
}

interface EditProfileData {
  displayName: string;
  bio: string;
  profilePicture: string;
  coverImage: string;
  cosplayerType: CosplayerType;
  yearsOfExperience: number | null;
  specialization: string;
  skillLevel: SkillLevel;
  featured: FeaturedItem[];
}

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
    featured: [
      { title: "", description: "", imageUrl: "", character: "", series: "" },
      { title: "", description: "", imageUrl: "", character: "", series: "" },
      { title: "", description: "", imageUrl: "", character: "", series: "" },
    ],
  });

  const [errors, setErrors] = useState<Partial<EditProfileData>>({});
  const [userCredentials, setUserCredentials] = useState<UserCredential[]>([]);
  const [credentialsLoading, setCredentialsLoading] = useState(false);
  const [searchTerms, setSearchTerms] = useState<string[]>(["", "", ""]);
  const [showDropdowns, setShowDropdowns] = useState<boolean[]>([false, false, false]);
  const [showAddCredentialsModal, setShowAddCredentialsModal] = useState(false);

 const profileInputRef = useRef<HTMLInputElement>(null);
const coverInputRef = useRef<HTMLInputElement>(null);
const featuredInputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null]); // Initialize with array

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

  // Fetch user credentials when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchUserCredentials();
    }
  }, [isOpen]);

  // Initialize form data when profileData changes
  useEffect(() => {
    if (profileData) {
      setFormData({
        ...profileData,
        featured: profileData.featured.length >= 3 
          ? profileData.featured.slice(0, 3)
          : [
              ...profileData.featured,
              ...Array(3 - profileData.featured.length).fill({
                title: "",
                description: "",
                imageUrl: "",
                character: "",
                series: "",
              }),
            ],
      });
      setErrors({});
    }
  }, [profileData]);

  // Fetch user's competition credentials
  const fetchUserCredentials = async () => {
    setCredentialsLoading(true);
    try {
      const response = await fetch('/api/user/credentials');
      if (response.ok) {
        const data = await response.json();
        setUserCredentials(data.credentials || []);
      }
    } catch (error) {
      console.error('Error fetching credentials:', error);
    } finally {
      setCredentialsLoading(false);
    }
  };

  // Filter credentials based on search term
  const getFilteredCredentials = (index: number) => {
    const searchTerm = searchTerms[index].toLowerCase();
    if (!searchTerm) return userCredentials;
    
    return userCredentials.filter(credential => 
      credential.competition.name.toLowerCase().includes(searchTerm) ||
      credential.cosplayTitle?.toLowerCase().includes(searchTerm) ||
      credential.competition.location?.toLowerCase().includes(searchTerm)
    );
  };

  // Handle competition selection
  const handleCompetitionSelect = (index: number, credential: UserCredential) => {
    const newFeatured = [...formData.featured];
    newFeatured[index] = {
      ...newFeatured[index],
      title: credential.cosplayTitle || credential.competition.name,
      competitionId: credential.competition.id,
      competition: credential.competition,
      imageUrl: credential.imageUrl || newFeatured[index].imageUrl,
    };
    
    setFormData(prev => ({ ...prev, featured: newFeatured }));
    
    // Close dropdown and clear search
    const newShowDropdowns = [...showDropdowns];
    newShowDropdowns[index] = false;
    setShowDropdowns(newShowDropdowns);
    
    const newSearchTerms = [...searchTerms];
    newSearchTerms[index] = credential.competition.name;
    setSearchTerms(newSearchTerms);
  };

  // Handle search input change
  const handleSearchChange = (index: number, value: string) => {
    const newSearchTerms = [...searchTerms];
    newSearchTerms[index] = value;
    setSearchTerms(newSearchTerms);
    
    const newShowDropdowns = [...showDropdowns];
    newShowDropdowns[index] = value.length > 0;
    setShowDropdowns(newShowDropdowns);
  };

  // Clear competition selection
  const clearCompetitionSelection = (index: number) => {
    const newFeatured = [...formData.featured];
    newFeatured[index] = {
      ...newFeatured[index],
      title: "",
      competitionId: undefined,
      competition: undefined,
    };
    setFormData(prev => ({ ...prev, featured: newFeatured }));
    
    const newSearchTerms = [...searchTerms];
    newSearchTerms[index] = "";
    setSearchTerms(newSearchTerms);
  };

  // Handle image upload for profile/cover
  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "cover"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      [type === "profile" ? "profilePicture" : "coverImage"]: previewUrl,
    }));
  };

  // Handle featured image upload
  const handleFeaturedImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const newFeatured = [...formData.featured];
    newFeatured[index] = { ...newFeatured[index], imageUrl: previewUrl };
    setFormData(prev => ({ ...prev, featured: newFeatured }));
  };

  // Handle featured item changes
  const handleFeaturedChange = (
    index: number,
    field: keyof FeaturedItem,
    value: string
  ) => {
    const newFeatured = [...formData.featured];
    newFeatured[index] = { ...newFeatured[index], [field]: value };
    setFormData(prev => ({ ...prev, featured: newFeatured }));
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Partial<EditProfileData> = {};

    if (!formData.displayName.trim()) {
      newErrors.displayName = "Display name is required";
    }

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
    setSearchTerms(["", "", ""]);
    setShowDropdowns([false, false, false]);
    onClose();
  };

  const handleAddCredentials = () => {
    setShowAddCredentialsModal(true);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={handleClose} />
      
      {/* Modal - positioned on main page with external scrollbar */}
      <div className="fixed inset-4 z-50 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4">
          <div className="bg-base-100 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
            {/* Fixed Header */}
            <div className="flex justify-between items-center p-6 border-b border-base-200 bg-base-100">
              <div>
                <h2 className="text-2xl font-bold">Edit Profile</h2>
                <p className="text-base-content/70">Update your cosplay profile information</p>
              </div>
              <button
                onClick={handleClose}
                className="btn btn-sm btn-circle btn-ghost"
                disabled={loading}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

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
                      onClick={() => coverInputRef.current?.click()}
                    >
                      <Image
                        src={formData.coverImage}
                        alt="Cover"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="text-center text-white">
                          <CameraIcon className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">Click to change cover</p>
                        </div>
                      </div>
                    </div>
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "cover")}
                      className="hidden"
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
                          onClick={() => profileInputRef.current?.click()}
                        >
                          <CameraIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <div>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => profileInputRef.current?.click()}
                        >
                          Change Photo
                        </button>
                        <p className="text-xs text-base-content/60 mt-1">
                          JPG, PNG, GIF up to 5MB
                        </p>
                      </div>
                    </div>
                    <input
                      ref={profileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "profile")}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Basic Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold border-b border-base-200 pb-2">Basic Information</h3>
                  
                  {/* Display Name */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Display Name *</span>
                    </label>
                    <input
                      type="text"
                      className={`input input-bordered ${errors.displayName ? 'input-error' : ''}`}
                      value={formData.displayName}
                      onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                      placeholder="Your cosplay name"
                      required
                    />
                    {errors.displayName && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.displayName}</span>
                      </label>
                    )}
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

                    {/* Specialization */}
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

                {/* Featured Cosplays */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-base-200 pb-2">
                    <h3 className="text-lg font-semibold">Featured Cosplays (3 slots)</h3>
                    {userCredentials.length === 0 && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={handleAddCredentials}
                      >
                        <PlusIcon className="w-4 h-4" />
                        Add Credentials
                      </button>
                    )}
                  </div>

                  {credentialsLoading ? (
                    <div className="flex justify-center py-8">
                      <span className="loading loading-spinner loading-lg"></span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {formData.featured.map((item, index) => (
                        <div key={index} className="space-y-4 p-4 border border-base-200 rounded-lg">
                          <h4 className="font-medium">Featured #{index + 1}</h4>
                          
                          {/* Competition Selection */}
                          <div className="space-y-2">
                            <label className="label">
                              <span className="label-text font-medium">Select Competition</span>
                            </label>
                            <div className="relative">
                              <div className="input-group">
                                <input
                                  type="text"
                                  className="input input-bordered input-sm w-full pr-20"
                                  placeholder={userCredentials.length > 0 ? "Search competitions..." : "No competitions found"}
                                  value={searchTerms[index]}
                                  onChange={(e) => handleSearchChange(index, e.target.value)}
                                  disabled={userCredentials.length === 0}
                                />
                                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                                  {item.competitionId && (
                                    <button
                                      type="button"
                                      className="btn btn-ghost btn-xs"
                                      onClick={() => clearCompetitionSelection(index)}
                                      title="Clear selection"
                                    >
                                      <XMarkIcon className="w-3 h-3" />
                                    </button>
                                  )}
                                  <MagnifyingGlassIcon className="w-4 h-4 text-base-content/50" />
                                </div>
                              </div>
                              
                              {/* Dropdown */}
                              {showDropdowns[index] && userCredentials.length > 0 && (
                                <div className="absolute top-full left-0 right-0 z-10 bg-base-100 border border-base-200 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
                                  {getFilteredCredentials(index).length > 0 ? (
                                    getFilteredCredentials(index).map((credential) => (
                                      <div
                                        key={credential.id}
                                        className="p-3 hover:bg-base-200 cursor-pointer border-b border-base-200 last:border-b-0"
                                        onClick={() => handleCompetitionSelect(index, credential)}
                                      >
                                        <div className="font-medium text-sm">{credential.competition.name}</div>
                                        <div className="text-xs text-base-content/70">
                                          {new Date(credential.competition.eventDate).toLocaleDateString()}
                                          {credential.competition.location && ` • ${credential.competition.location}`}
                                        </div>
                                        {credential.cosplayTitle && (
                                          <div className="text-xs text-primary">{credential.cosplayTitle}</div>
                                        )}
                                        {credential.position && (
                                          <div className="badge badge-primary badge-xs mt-1">{credential.position}</div>
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
                            
                            {userCredentials.length === 0 && (
                              <div className="text-center py-4 bg-base-200 rounded-lg">
                                <p className="text-sm text-base-content/70 mb-2">No competition credentials found</p>
                                <button
                                  type="button"
                                  className="btn btn-primary btn-xs"
                                  onClick={handleAddCredentials}
                                >
                                  <PlusIcon className="w-3 h-3" />
                                  Add Credentials
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Competition Info Display */}
                          {item.competition && (
                            <div className="bg-base-200 rounded-lg p-3">
                              <div className="text-sm font-medium">{item.competition.name}</div>
                              <div className="text-xs text-base-content/70">
                                {new Date(item.competition.eventDate).toLocaleDateString()}
                                {item.competition.location && ` • ${item.competition.location}`}
                              </div>
                              <div className="flex gap-1 mt-1">
                                <span className="badge badge-outline badge-xs">{item.competition.competitionType}</span>
                                <span className="badge badge-outline badge-xs">{item.competition.level}</span>
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
                              onClick={() => featuredInputRefs.current[index]?.click()}
                            >
                              {item.imageUrl ? (
                                <Image
                                  src={item.imageUrl}
                                  alt={`Featured ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="h-full flex items-center justify-center">
                                  <div className="text-center text-base-content/50">
                                    <CameraIcon className="w-8 h-8 mx-auto mb-2" />
                                    <p className="text-xs">Add cosplay image</p>
                                  </div>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <CameraIcon className="w-6 h-6 text-white" />
                              </div>
                            </div>
                            <input
                                ref={el => (featuredInputRefs.current[index] = el)}
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFeaturedImageUpload(e, index)}
                                className="hidden"
                                />
                          </div>

                          {/* Featured Details */}
                          <div className="space-y-2">
                            <input
                              type="text"
                              className="input input-bordered input-sm w-full"
                              placeholder="Cosplay title"
                              value={item.title}
                              onChange={(e) => handleFeaturedChange(index, 'title', e.target.value)}
                            />
                            <input
                              type="text"
                              className="input input-bordered input-sm w-full"
                              placeholder="Character name"
                              value={item.character || ""}
                              onChange={(e) => handleFeaturedChange(index, 'character', e.target.value)}
                            />
                            <input
                              type="text"
                              className="input input-bordered input-sm w-full"
                              placeholder="Series/franchise"
                              value={item.series || ""}
                              onChange={(e) => handleFeaturedChange(index, 'series', e.target.value)}
                            />
                            <textarea
                              className="textarea textarea-bordered textarea-sm w-full"
                              placeholder="Description"
                              rows={2}
                              value={item.description}
                              onChange={(e) => handleFeaturedChange(index, 'description', e.target.value)}
                            />
                          </div>
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
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
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

      {/* Add Credentials Modal Placeholder */}
      {showAddCredentialsModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-base-100 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Add Competition Credentials</h3>
            <p className="text-base-content/70 mb-4">
              You haven't joined any competitions yet. Add your competition participations to showcase in your featured section.
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
                  // Redirect to competitions page or open add credentials form
                  window.open('/user/competitions', '_blank');
                }}
              >
                Browse Competitions
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfileModal;