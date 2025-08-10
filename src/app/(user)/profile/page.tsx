"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useProfile } from "@/app/context/ProfileContext";
import { useUserCredentials } from "@/hooks/user/useUserCredentials";
import Image from "next/image";
import { UserIcon } from "@heroicons/react/24/outline";
import EditProfileModal from "@/app/components/user/modals/EditProfileModal";
import AddCredentialsModal from "@/app/components/user/modals/AddCredentialsModal";
import FeaturedCosplaysEditor from "@/app/components/user/modals/FeaturedCosplaysEditor";
import BadgeSection from "@/app/components/user/BadgeSection";

import {
  PencilSquareIcon,
  PlusCircleIcon,
  TrophyIcon,
  FunnelIcon,
  BriefcaseIcon,
  PaintBrushIcon,
  ClockIcon,
  CheckBadgeIcon,
} from "@heroicons/react/16/solid";

import { EditProfileData, SkillLevel, CosplayerType, FeaturedItem } from "@/types/profile";

const ProfilePage = () => {
  const { data: session } = useSession();
  const { profile, loading, updateProfile } = useProfile();
  const { credentials, loading: credentialsLoading, refetch: refetchCredentials } = useUserCredentials();
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [showAddCredentialsModal, setShowAddCredentialsModal] = useState(false);
  const [showFeaturedEditor, setShowFeaturedEditor] = useState(false);

  // Featured cosplays state - initialize from profile or empty array
  const [featuredCosplays, setFeaturedCosplays] = useState<FeaturedItem[]>([
    { title: "", description: "", imageUrl: "", character: "", series: "" },
    { title: "", description: "", imageUrl: "", character: "", series: "" },
    { title: "", description: "", imageUrl: "", character: "", series: "" },
  ]);

  // Helper functions remain the same...
  const getPositionInfo = (position: string) => {
    switch (position) {
      case 'CHAMPION':
        return { 
          text: 'Champion', 
          bgColor: 'bg-yellow-100', 
          textColor: 'text-yellow-800',
          icon: <TrophyIcon className="w-3 h-3" />
        };
      case 'FIRST_PLACE':
        return { 
          text: '1st Place', 
          bgColor: 'bg-yellow-100', 
          textColor: 'text-yellow-700',
          icon: <TrophyIcon className="w-3 h-3" />
        };
      case 'SECOND_PLACE':
        return { 
          text: '2nd Place', 
          bgColor: 'bg-gray-100', 
          textColor: 'text-gray-700',
          icon: <TrophyIcon className="w-3 h-3" />
        };
      case 'THIRD_PLACE':
        return { 
          text: '3rd Place', 
          bgColor: 'bg-orange-100', 
          textColor: 'text-orange-700',
          icon: <TrophyIcon className="w-3 h-3" />
        };
      default:
        return { 
          text: 'Participant', 
          bgColor: 'bg-blue-100', 
          textColor: 'text-blue-700',
          icon: null
        };
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
      });
    } catch {
      return dateString;
    }
  };

  const eventYear = (dateString: string) => {
    const date = new Date(dateString);
    return date.getFullYear();
  };

  // Featured cosplay handlers
  const handleFeaturedSave = async (featured: FeaturedItem[]) => {
    try {
      // Update local state
      setFeaturedCosplays(featured);
      
      // Save to backend
      const response = await fetch('/api/user/featured', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save featured cosplays');
      }
      
      setShowFeaturedEditor(false);
      console.log('Featured cosplays saved:', featured);
    } catch (error) {
      console.error('Error saving featured cosplays:', error);
      alert('Failed to save featured cosplays. Please try again.');
    }
  };

  // Stats calculations
  const championCount = credentials.filter(c => c.position === 'CHAMPION').length;
  const placedCount = credentials.filter(c => 
    ['CHAMPION', 'FIRST_PLACE', 'SECOND_PLACE', 'THIRD_PLACE'].includes(c.position)
  ).length;
  const totalCompetitions = credentials.length;

  const getCosplayerTypeDisplay = () => {
    switch (profile?.cosplayerType) {
      case "COMPETITIVE":
        return { text: ( 
        <> <TrophyIcon className='w-4 h-4'/> <span>Competitive Cosplayer</span> </>
      ), class: "badge-primary" };
      case "HOBBY":
        return { text: ( 
        <> <PaintBrushIcon className='w-4 h-4'/> <span>Hobby Cosplayer</span> </>
      ), class: "badge-secondary" };
      case "PROFESSIONAL":
        return { text: ( 
        <> <BriefcaseIcon className='w-4 h-4'/> <span>Pro Cosplayer</span> </>
      ), class: "badge-accent" };
      default:
        return { text: "Cosplayer", class: "badge-outline" };
    }
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleSaveProfile = async (editedData: EditProfileData) => {
    setEditLoading(true);
    try {
      const success = await updateProfile(editedData);
      if (success) {
        setShowEditModal(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setEditLoading(false);
    }
  };

  const cosplayerTypeInfo = getCosplayerTypeDisplay();

  // ✅ Fix the getEditableProfileData function with proper type casting
  const getEditableProfileData = (): EditProfileData | null => {
    if (!profile) return null;
    
    return {
      displayName: profile.displayName || "",
      bio: profile.bio || "",
      profilePicture: profile.profilePicture || "/images/default-avatar.png",
      coverImage: profile.coverImage || "/images/default-cover.jpg",
      cosplayerType: profile.cosplayerType,
      yearsOfExperience: profile.yearsOfExperience,
      specialization: profile.specialization || "",
      // ✅ Cast skillLevel to proper SkillLevel type with fallback
      skillLevel: (profile.skillLevel as SkillLevel) || "beginner",
      featured: featuredCosplays,
    };
  };

  if (loading) {
    return (
      <main className="max-w-[1240px] mx-auto h-screen p-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
    <main className="w-full bg-primary/5 p-6">
      <div className="max-w-[1240px] mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200">
          {/* Cover Image */}
          <div className="h-80 max-md:h-50 bg-gradient-to-r from-primary to-secondary rounded-2xl relative overflow-hidden">
            {profile?.coverImage ? (
              <Image
                src={profile.coverImage}
                alt="Cover"
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20" />
            )}
          </div>

          <div className="flex flex-row max-md:flex-col max-md:gap-4 justify-between mt-[-50px] max-md:mt-[-20px] z-10 relative">
            <div className="flex flex-row gap-1 basis-1/3 bg-white rounded-r-full rounded-tl-full rounded-bl-full ml-[-30px] max-md:ml-[0px] shadow-lg">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-base-200 overflow-hidden">
                  {profile?.profilePicture ? (
                    <div 
                      className="w-full h-full bg-cover bg-center bg-no-repeat"
                      style={{
                        backgroundImage: `url(${profile.profilePicture})`
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-base-300">
                      <UserIcon className="w-16 h-16 text-base-content/50" />
                    </div>
                  )}
                </div>
              <div className="flex flex-col w-auto items-left pl-4 pr-4 ">
                <h1 className="text-2xl max-md:text-2xl font-bold text-gray-900 mt-4">
                  {profile?.displayName ||
                    session?.user?.name ||
                    "No Display Name"}
                </h1>
                <p className="text-sm text-gray-400">
                  @{session?.user?.username || "username"}
                </p>
                <div
                  className={`badge ${cosplayerTypeInfo.class} badge-sm mt-4`}
                >
                  {cosplayerTypeInfo.text}
                </div>
              </div>
            </div>
            {/* Stats cards */}
            <div className="flex flex-row max-w-[600px] max-md:justify-center gap-2 mr-[-10px] basis-2/3">
              <div className="card basis-1/3 flex flex-col justify-center items-center bg-white p-4 shadow-lg rounded-lg">
                <h2 className="text-[32px] font-semibold mb-2">{championCount}</h2>
                <span className="text-sm text-gray-500">Champion</span>
              </div>
              <div className="card basis-1/3 flex flex-col justify-center items-center bg-white p-4 shadow-lg rounded-lg">
                <h2 className="text-[32px] font-semibold mb-2">{placedCount}</h2>
                <span className="text-sm text-gray-500">Placed</span>
              </div>
              <div className="card basis-1/3 flex flex-col justify-center items-center bg-white p-4 shadow-lg rounded-lg">
                <h2 className="text-[32px] font-semibold mb-2">{totalCompetitions}</h2>
                <span className="text-sm text-gray-500">Competitions Joined</span>
              </div>
            </div>
          </div>

          {/* Profile info section */}
          <div className="relative px-6 pb-6">
            <div className="flex flex-row gap-2 justify-end max-md:justify-center mt-4">
              <button className="btn btn-primary text-white">
                <Image
                  src="/icons/white-cosbaii-icon.svg"
                  className="w-4 h-4"
                  width={28}
                  height={28}
                  alt="Cosbaii Icon"
                />
                Cosbaii Card
              </button>
              <button className="btn" onClick={handleEditProfile}>
                <PencilSquareIcon className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
            <div className="divider"></div>
            <div className="flex flex-row justify-between items-center">
              <div>
                <ul className="flex flex-row gap-6 text-sm text-gray-600 font-bold">
                  <li>
                    <a href="#" className="hover:text-primary">INFO</a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary">FEATURED</a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary">CREDENTIALS</a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary">PHOTOS</a>
                  </li>
                </ul>
              </div>
              <div className="flex flex-row gap-2">
                <a href="#">
                  <Image
                    src="/icons/facebook-icon.svg"
                    width={28}
                    height={28}
                    alt="Facebook Icon"
                  />
                </a>
                <a href="#">
                  <Image
                    src="/icons/instagram-icon.svg"
                    width={28}
                    height={28}
                    alt="Instagram Icon"
                  />
                </a>
                <a href="#">
                  <Image
                    src="/icons/x-icon.svg"
                    width={28}
                    height={28}
                    alt="X Icon/Twitter Icon"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row items-start gap-4 mt-4">
          {/* Left sidebar */}
          <div className="basis-1/3 bg-white rounded-2xl p-6 border border-gray-200">
            <div>
              <h2 className="text-xl font-bold">
                Hi, I'm{" "}
                {profile?.displayName ||
                  session?.user?.name ||
                  "No Display Name"}
              </h2>

              {profile?.bio && (
                <p className="text-gray-400 mt-4 text-md">{profile.bio}</p>
              )}

              <div className="flex flex-wrap gap-2 mt-4">
                {profile?.yearsOfExperience !== null &&
                  profile?.yearsOfExperience !== undefined && (
                    <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm">
                      {profile.yearsOfExperience === 0
                        ? "Just starting"
                        : `${profile.yearsOfExperience} years experience`}
                    </span>
                  )}

                {profile?.specialization && (
                  <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
                    {profile.specialization}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-8">
              <h2 className="text-xl font-bold">Badges</h2>
              <p className="text-sm text-gray-500 mt-2">No badges earned yet</p>
            </div>
          </div>

          <div className="basis-2/3 flex flex-col gap-4">
            {/* Featured section with working edit button */}
            <div className="relative h-100 bg-white rounded-2xl border border-gray-200">
              <div className="absolute l-4 flex justify-between items-center w-full z-10">
                <h2 className="absolute top-4 left-4 text-xl font-bold text-white drop-shadow-lg">
                  Featured
                </h2>

                <button
                  className="absolute btn btn-primary btn-sm py-6 rounded-full top-2 right-4 tooltip tooltip-left"
                  data-tip="Edit Featured Cosplay"
                  onClick={() => setShowFeaturedEditor(true)}
                >
                  <PencilSquareIcon className="w-6 h-6 text-white" />
                </button>
              </div>

              <div className="flex flex-row h-100">
                {/* Display featured cosplays or placeholder */}
                {featuredCosplays.some(item => item.imageUrl) ? (
                  featuredCosplays.map((featured, index) => (
                    <div
                      key={index}
                      className={`basis-1/3 flex flex-row items-end h-full ${
                        index === 0 ? 'rounded-l-lg' : index === 2 ? 'rounded-r-lg' : ''
                      } bg-gray-100 relative overflow-hidden`}
                      style={{
                        backgroundImage: featured.imageUrl ? `url(${featured.imageUrl})` : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {featured.title && (
                        <div className="w-full mx-auto py-2 px-4 mb-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-md m-4">
                          <div className="flex flex-row gap-2 items-center">
                            <div className="flex-1">
                              <h3 className="text-xs font-bold line-clamp-1">
                                {featured.title}
                              </h3>
                              {featured.character && (
                                <p className="text-[10px] text-gray-600">
                                  {featured.character}
                                  {featured.series && ` • ${featured.series}`}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col items-center text-yellow-500">
                              <TrophyIcon className="w-4 h-4" />
                              <span className="text-[8px]">Featured</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <>
                    <div
                      className="basis-1/3 flex flex-row items-end h-full bg-gray-100 rounded-l-lg"
                      style={{
                        backgroundImage: "url(/images/sample-featured.png)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="flex flex-col w-60 mx-auto py-2 px-6 mb-4 bg-white rounded-2xl shadow-md">
                        <div className="flex flex-row gap-2">
                          <h3 className="text-xs font-bold">
                            2018 | Otakufest Duo Cosplay Competition
                          </h3>
                          <div className="flex flex-col items-center text-yellow-500">
                            <TrophyIcon className="w-4 h-4 " />
                            <span className="text-[10px]">Champion</span>
                          </div>
                        </div>
                        <div className="flex flex-row justify-between items-center p-2">
                          <span className="text-[10px] text-gray-500">
                            Cosplay Name
                          </span>
                          <span className="text-[10px] font-bold ml-2">
                            Mikasa Ackerman
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="basis-1/3 h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">Empty Slot</span>
                    </div>
                    <div className="basis-1/3 h-full bg-gray-300 rounded-r-lg flex items-center justify-center">
                      <span className="text-gray-600 text-sm">Empty Slot</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Competitions Joined Section */}
            <div className="flex flex-col gap-4 bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex flex-row justify-between items-center">
                <h2 className="text-xl font-bold">Competitions Joined</h2>
                <div className="flex flex-row items-center gap-2">
                  <button 
                    className="btn btn-primary btn-sm text-white"
                    onClick={() => setShowAddCredentialsModal(true)}
                  >
                    <PlusCircleIcon className="w-4 h-4" />
                    Add Credentials
                  </button>
                  <div className="dropdown dropdown-end">
                    <div
                      tabIndex={0}
                      role="button"
                      className="btn btn-outline btn-sm"
                    >
                      <FunnelIcon className="w-4 h-4" />
                      Filter: Competition Name
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                    >
                      <li><a>All Competitions</a></li>
                      <li><a>Champion Only</a></li>
                      <li><a>Recent First</a></li>
                      <li><a>By Position</a></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Dynamic Credentials Grid */}
              {credentialsLoading ? (
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex items-center gap-3 p-4 bg-gray-200 rounded-lg">
                        <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-300 rounded mb-2"></div>
                          <div className="h-3 bg-gray-300 rounded mb-2"></div>
                          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : credentials.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {credentials.map((credential) => {
                    const positionInfo = getPositionInfo(credential.position);
                    
                    return (
                      <div
                        key={credential.id}
                        className="flex items-center gap-3 p-4 bg-base-50 rounded-lg border border-base-200 hover:shadow-md transition-shadow relative"
                      >
                        {/* Verification Status Indicator */}
                        <div className="absolute top-2 right-2">
                          {credential.verified ? (
                            <div className="tooltip tooltip-left" data-tip="Verified by admin">
                              <CheckBadgeIcon className="w-5 h-5 text-green-500" />
                            </div>
                          ) : (
                            <div className="tooltip tooltip-left" data-tip="Under review">
                              <ClockIcon className="w-5 h-5 text-orange-500 animate-pulse" />
                            </div>
                          )}
                        </div>

                        <div className="relative flex-shrink-0">
                          <Image
                            src={credential.imageUrl || credential.competition.logoUrl || "/icons/cosbaii-icon-primary.svg"}
                            alt={credential.imageUrl ? "Cosplay Photo" : "Competition Logo"}
                            width={200}
                            height={200}
                            className="w-30 h-30 rounded-lg bg-white p-1 border border-base-200 object-cover"
                          />
  
                          
                          {/* Position Badge */}
                          {positionInfo.icon && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                              <TrophyIcon className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-gray-900 truncate">
                            {credential.competition.name} {eventYear(credential.competition.eventDate)}
                          </h3>
                          <p className="text-xs text-gray-500 mb-1">
                            {credential.competition.competitionType} • {credential.competition.rivalryType}
                          </p>
                          
                          {credential.cosplayTitle && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-600">Character:</span>
                              <span className="text-xs font-medium text-gray-900 truncate">
                                {credential.cosplayTitle}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-600">Date:</span>
                            <span className="text-xs font-medium text-gray-900">
                              {formatDate(credential.competition.eventDate)}
                            </span>
                          </div>

                          <div className="mt-2 flex items-center gap-2">
                            <span 
                              className={`px-2 py-1 text-xs font-medium rounded-full ${positionInfo.bgColor} ${positionInfo.textColor}`}
                            >
                              {positionInfo.text}
                            </span>
                            
                            {!credential.verified && (
                              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                                Under Review
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <TrophyIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No competitions yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Start building your cosplay credentials by adding your competition participations.
                  </p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowAddCredentialsModal(true)}
                  >
                    <PlusCircleIcon className="w-5 h-5" />
                    Add Your First Credential
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>

    {/* All Modals */}
    <EditProfileModal
      isOpen={showEditModal}
      onClose={() => setShowEditModal(false)}
      onSave={handleSaveProfile}
      profileData={getEditableProfileData()}
      loading={editLoading}
    />

    <AddCredentialsModal
      isOpen={showAddCredentialsModal}
      onClose={() => setShowAddCredentialsModal(false)}
      onSuccess={() => {
        setShowAddCredentialsModal(false);
        refetchCredentials();
      }}
    />

    {/* Featured Cosplays Editor - Now properly connected */}
    <FeaturedCosplaysEditor
      isOpen={showFeaturedEditor}
      onClose={() => setShowFeaturedEditor(false)}
      onSave={handleFeaturedSave}
      initialFeatured={featuredCosplays}
    />
    </>
  );
};

export default ProfilePage;