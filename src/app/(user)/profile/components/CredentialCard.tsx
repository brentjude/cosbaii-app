"use client";

import Image from "next/image";
import {
  TrophyIcon,
  CheckBadgeIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/16/solid";
import { CompetitionCredential } from "@/types/profile";
import { PositionInfo } from "@/lib/user/profile/position";

interface CredentialCardProps {
  credential: CompetitionCredential;
  positionInfo: PositionInfo;
  imageData: {
    src: string;
    alt: string;
    isCosplayPhoto: boolean;
  };
  formatDate: (dateString: string) => string;
  formatMonthYear: (dateString: string) => string;
  eventYear: (dateString: string) => number;
  onClick?: () => void;
}

export default function CredentialCard({
  credential,
  positionInfo,
  imageData,
  formatDate,
  formatMonthYear,
  eventYear,
  onClick,
}: CredentialCardProps) {
  // Helper to get status badge
  const getStatusBadge = () => {
    if (credential.verified) {
      return {
        icon: CheckBadgeIcon,
        color: "text-green-500",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        label: "Verified",
        tooltip: "Verified by admin",
      };
    }

    // Check if rejected (status === 'REJECTED')
    if (credential.status === "REJECTED") {
      return {
        icon: XCircleIcon,
        color: "text-red-500",
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        label: "Rejected",
        tooltip: "Credential was rejected",
      };
    }

    // Default: Under review
    return {
      icon: ClockIcon,
      color: "text-orange-500",
      bgColor: "bg-orange-100",
      textColor: "text-orange-800",
      label: "Under Review",
      tooltip: "Under review",
    };
  };

  const statusBadge = getStatusBadge();

  return (
    <div onClick={onClick} className={onClick ? "cursor-pointer" : ""}>
      {/* Mobile Layout */}
      <div className="flex sm:hidden items-center gap-3 p-3 bg-base-50 rounded-lg border border-base-200 hover:shadow-md transition-shadow relative">
        {/* Verification Badge */}
        <div className="absolute top-2 right-2">
          <div className="tooltip tooltip-left" data-tip={statusBadge.tooltip}>
            <statusBadge.icon className={`w-4 h-4 ${statusBadge.color} ${statusBadge.color === "text-orange-500" ? "animate-pulse" : ""}`} />
          </div>
        </div>

        {/* Image */}
        <div className="relative flex-shrink-0">
          <Image
            src={imageData.src}
            alt={imageData.alt}
            width={80}
            height={80}
            className={`w-20 h-20 rounded-lg border border-base-200 object-cover ${
              imageData.isCosplayPhoto ? "bg-gray-50" : "bg-white p-1"
            }`}
          />

          {positionInfo.icon && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
              <TrophyIcon className="w-2.5 h-2.5 text-white" />
            </div>
          )}
        </div>

        {/* Info Column */}
        <div className="flex-1 min-w-0 pr-6">
          <h3 className="font-semibold text-xs text-gray-900 truncate">
            {credential.competition.name} | {eventYear(credential.competition.eventDate)}
          </h3>

          <div className="flex items-center gap-2 mt-1">
            <p className="text-[10px] text-gray-500">
              {credential.competition.competitionType} •{" "}
              {credential.competition.rivalryType} • {credential.competition.level}
            </p>
            <span
              className={`px-1.5 py-0.5 text-[8px] font-medium rounded-full ${positionInfo.bgColor} ${positionInfo.textColor}`}
            >
              {positionInfo.text}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1 mt-1 text-[10px] text-gray-600">
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

          {/* Status Tag */}
          <div className="mt-2">
            <span
              className={`px-2 py-1 ${statusBadge.bgColor} ${statusBadge.textColor} text-[8px] font-medium rounded-full`}
            >
              {statusBadge.label}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex items-start gap-4 p-4 bg-base-50 rounded-lg border border-base-200 hover:shadow-md transition-shadow relative">
        {/* Verification Badge */}
        <div className="absolute top-3 right-3">
          <div className="tooltip tooltip-left" data-tip={statusBadge.tooltip}>
            <statusBadge.icon className={`w-5 h-5 ${statusBadge.color} ${statusBadge.color === "text-orange-500" ? "animate-pulse" : ""}`} />
          </div>
        </div>

        {/* First Column: Image */}
        <div className="relative flex-shrink-0">
          <Image
            src={imageData.src}
            alt={imageData.alt}
            width={96}
            height={96}
            className={`w-24 h-24 rounded-lg border border-base-200 object-cover ${
              imageData.isCosplayPhoto ? "bg-gray-50" : "bg-white p-1"
            }`}
          />

          {positionInfo.icon && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
              <TrophyIcon className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Second Column: Information */}
        <div className="flex-1 min-w-0 pr-8 space-y-2">
          {/* First Row: Competition Name | Date Year */}
          <h3 className="font-bold text-sm text-gray-900 truncate">
            {credential.competition.name} |{" "}
            {eventYear(credential.competition.eventDate)}
          </h3>

          {/* Second Row: Competition Type • Rivalry Type • Level */}
          <p className="text-xs text-gray-600">
            {credential.competition.competitionType} •{" "}
            {credential.competition.rivalryType} • {credential.competition.level}
          </p>

          {/* Third Row: Month Year • Character Name • Series Name */}
          <div className="flex flex-wrap items-center gap-1 text-xs text-gray-600">
            <span className="font-medium text-gray-700">
              {formatMonthYear(credential.competition.eventDate)}
            </span>

            {credential.cosplayTitle && (
              <>
                <span>•</span>
                <span className="font-medium text-gray-900">
                  {credential.cosplayTitle}
                </span>
              </>
            )}

            {credential.seriesName && (
              <>
                <span>•</span>
                <span>{credential.seriesName}</span>
              </>
            )}
          </div>

          {/* Fourth Row: Position and Status Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {/* Position Tag */}
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${positionInfo.bgColor} ${positionInfo.textColor}`}
            >
              {positionInfo.text}
            </span>

            {/* Status Tag */}
            <span
              className={`px-3 py-1 ${statusBadge.bgColor} ${statusBadge.textColor} text-xs font-semibold rounded-full flex items-center gap-1`}
            >
              <statusBadge.icon className="w-3 h-3" />
              {statusBadge.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}