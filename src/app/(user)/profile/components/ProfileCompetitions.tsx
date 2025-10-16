import { useState } from "react";
import {
  PlusCircleIcon,
  FunnelIcon,
  TrophyIcon,
  PencilSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/16/solid";
import { CompetitionCredential } from "@/types/profile";
import { PositionInfo } from "@/lib/user/profile/position";
import CredentialCard from "./CredentialCard";
import CredentialCardSkeleton from "./CredentialCardSkeleton";

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
    document.getElementById("credentials")?.scrollIntoView({ behavior: "smooth" });
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
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
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
    if (
      credential.competition.logoUrl &&
      credential.competition.logoUrl.trim() !== ""
    ) {
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

  // Helper function to format month and year
  const formatMonthYear = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
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
              Showing {startIndex + 1}-{Math.min(endIndex, credentials.length)} of{" "}
              {credentials.length} credentials
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
            <CredentialCardSkeleton key={i} />
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
                <CredentialCard
                  key={credential.id}
                  credential={credential}
                  positionInfo={positionInfo}
                  imageData={imageData}
                  formatDate={formatDate}
                  formatMonthYear={formatMonthYear}
                  eventYear={eventYear}
                />
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
                          ? "btn-primary"
                          : page === "..."
                          ? "btn-ghost cursor-default"
                          : "btn-ghost"
                      }`}
                      onClick={() =>
                        typeof page === "number" && handlePageChange(page)
                      }
                      disabled={page === "..."}
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
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
            No competitions yet
          </h3>
          <p className="text-sm sm:text-base text-gray-500 mb-4">
            Start building your cosplay credentials by adding your competition
            participations.
          </p>
          <button
            className="btn btn-sm sm:btn-md btn-primary"
            onClick={onAddCredential}
          >
            <PlusCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            Add Your First Credential
          </button>
        </div>
      )}
    </div>
  );
}