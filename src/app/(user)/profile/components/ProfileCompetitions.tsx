import { useState } from "react";
import Image from "next/image";
import {
  PlusCircleIcon,
  FunnelIcon,
  TrophyIcon,
  CheckBadgeIcon,
  ClockIcon,
  PencilSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/16/solid";
import { CompetitionCredential } from "@/types/profile";
import { PositionInfo } from "@/lib/user/profile/position";

interface Props {
  credentials: CompetitionCredential[];
  loading: boolean;
  onAddCredential: () => void;
  onEditCredentials: () => void;
  getPositionInfo: (position: string) => PositionInfo;
  formatDate: (dateString: string) => string;
  eventYear: (dateString: string) => number;
}

export default function ProfileCompetitions({
  credentials,
  loading,
  onAddCredential,
  onEditCredentials,
  getPositionInfo,
  formatDate,
  eventYear,
}: Props) {
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(credentials.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCredentials = credentials.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of credentials section
    document.getElementById('credentials')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, last page, and pages around current page
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Helper function to get the image source with priority
  const getImageSource = (credential: CompetitionCredential) => {
    // Priority 1: Cosplay photo (if exists and not empty)
    if (credential.imageUrl && credential.imageUrl.trim() !== "") {
      return {
        src: credential.imageUrl,
        alt: "Cosplay Photo",
        isCosplayPhoto: true,
      };
    }
    
    // Priority 2: Competition logo (if exists and not empty)
    if (credential.competition.logoUrl && credential.competition.logoUrl.trim() !== "") {
      return {
        src: credential.competition.logoUrl,
        alt: `${credential.competition.name} Logo`,
        isCosplayPhoto: false,
      };
    }
    
    // Priority 3: Default icon
    return {
      src: "/icons/cosbaii-icon-primary.svg",
      alt: "Default Icon",
      isCosplayPhoto: false,
    };
  };

  return (
    <div
      id="credentials"
      className="flex flex-col gap-4 bg-white rounded-2xl p-4 sm:p-6 border border-gray-200"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold">Competitions Joined</h2>
          {credentials.length > 0 && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Showing {startIndex + 1}-{Math.min(endIndex, credentials.length)} of {credentials.length} credentials
            </p>
          )}
        </div>

        {/* Action Buttons - Stack on mobile, row on desktop */}
        <div className="flex flex-row items-center gap-2 w-full sm:w-auto">
          {/* Edit Button */}
          {credentials.length > 0 && (
            <button
              className="btn btn-ghost btn-sm tooltip tooltip-left flex-1 sm:flex-none"
              data-tip="Manage credentials"
              onClick={onEditCredentials}
            >
              <PencilSquareIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Manage</span>
            </button>
          )}

          <button
            className="btn btn-primary btn-sm text-white flex-1 sm:flex-none"
            onClick={onAddCredential}
          >
            <PlusCircleIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Add Credentials</span>
            <span className="sm:hidden">Add</span>
          </button>

          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-outline btn-sm">
              <FunnelIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Filter: Competition Name</span>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li>
                <a>All Competitions</a>
              </li>
              <li>
                <a>Champion Only</a>
              </li>
              <li>
                <a>Recent First</a>
              </li>
              <li>
                <a>By Position</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 sm:gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              {/* Mobile Loading */}
              <div className="flex sm:hidden items-center gap-3 p-3 bg-gray-200 rounded-lg">
                <div className="w-20 h-20 bg-gray-300 rounded-lg flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-2 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>

              {/* Desktop Loading */}
              <div className="hidden sm:flex items-center gap-3 p-4 bg-gray-200 rounded-lg">
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
        <>
          {/* Credentials Grid - Mobile: 1 column, Desktop: 2 columns */}
          <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 sm:gap-4">
            {currentCredentials.map((credential) => {
              const positionInfo = getPositionInfo(credential.position);
              const imageData = getImageSource(credential);

              return (
                <div
                  key={credential.id}
                  className="flex items-center gap-3 p-3 sm:p-4 bg-base-50 rounded-lg border border-base-200 hover:shadow-md transition-shadow relative"
                >
                  {/* Verification Badge */}
                  <div className="absolute top-2 right-2">
                    {credential.verified ? (
                      <div className="tooltip tooltip-left" data-tip="Verified by admin">
                        <CheckBadgeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      </div>
                    ) : (
                      <div className="tooltip tooltip-left" data-tip="Under review">
                        <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 animate-pulse" />
                      </div>
                    )}
                  </div>

                  {/* Image - Prioritize cosplay photo > competition logo > default */}
                  <div className="relative flex-shrink-0">
                    <Image
                      src={imageData.src}
                      alt={imageData.alt}
                      width={200}
                      height={200}
                      className={`w-20 h-20 sm:w-30 sm:h-30 rounded-lg border border-base-200 object-cover ${
                        imageData.isCosplayPhoto 
                          ? "bg-gray-50" // Cosplay photo - minimal background
                          : "bg-white p-1" // Logo/Default - white background with padding
                      }`}
                    />

                    {positionInfo.icon && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                        <TrophyIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Info Column */}
                  <div className="flex-1 min-w-0 pr-6">
                    {/* Competition Name | Year */}
                    <h3 className="font-semibold text-xs sm:text-sm text-gray-900 truncate">
                      {credential.competition.name} | {eventYear(credential.competition.eventDate)}
                    </h3>

                    {/* Competition Type • Rivalry Type (with tags) */}
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[10px] sm:text-xs text-gray-500">
                        {credential.competition.competitionType} •{" "}
                        {credential.competition.rivalryType}
                      </p>
                      <span
                        className={`px-1.5 py-0.5 text-[8px] sm:text-xs font-medium rounded-full ${positionInfo.bgColor} ${positionInfo.textColor}`}
                      >
                        {positionInfo.text}
                      </span>
                    </div>

                    {/* Date | Character | Series */}
                    <div className="flex flex-wrap items-center gap-1 mt-1 text-[10px] sm:text-xs text-gray-600">
                      <span className="font-medium">
                        {formatDate(credential.competition.eventDate)}
                      </span>
                      
                      {credential.cosplayTitle && (
                        <>
                          <span>•</span>
                          <span className="font-medium text-gray-900 truncate">
                            {credential.cosplayTitle}
                          </span>
                        </>
                      )}
                      
                      {credential.seriesName && (
                        <>
                          <span>•</span>
                          <span className="truncate">{credential.seriesName}</span>
                        </>
                      )}
                    </div>

                    {/* Under Review Tag (if not verified) */}
                    {!credential.verified && (
                      <div className="mt-2">
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-[8px] sm:text-xs font-medium rounded-full">
                          Under Review
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-200">
              {/* Page Info */}
              <div className="text-xs sm:text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>

              {/* Pagination Buttons */}
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Previous Button */}
                <button
                  className="btn btn-xs sm:btn-sm btn-ghost"
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                >
                  <ChevronLeftIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      className={`btn btn-xs sm:btn-sm ${
                        page === currentPage
                          ? 'btn-primary'
                          : page === '...'
                          ? 'btn-ghost cursor-default'
                          : 'btn-ghost'
                      }`}
                      onClick={() => typeof page === 'number' && handlePageChange(page)}
                      disabled={page === '...'}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  className="btn btn-xs sm:btn-sm btn-ghost"
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRightIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <TrophyIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No competitions yet</h3>
          <p className="text-sm sm:text-base text-gray-500 mb-4">
            Start building your cosplay credentials by adding your competition participations.
          </p>
          <button className="btn btn-sm sm:btn-md btn-primary" onClick={onAddCredential}>
            <PlusCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            Add Your First Credential
          </button>
        </div>
      )}
    </div>
  );
}