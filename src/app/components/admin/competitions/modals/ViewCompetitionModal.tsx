"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image"; // ✅ Add this import

type CompetitionType = "GENERAL" | "ARMOR" | "CLOTH" | "SINGING";
type RivalryType = "SOLO" | "DUO" | "GROUP";
type CompetitionLevel =
  | "BARANGAY"
  | "LOCAL"
  | "REGIONAL"
  | "NATIONAL"
  | "WORLDWIDE";
type CompetitionStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "ACCEPTED"
  | "ONGOING"
  | "COMPLETED"
  | "REJECTED"
  | "CANCELLED";

interface Competition {
  id: number;
  name: string;
  description: string | null;
  eventDate: string;
  location: string | null;
  organizer: string | null;
  competitionType: CompetitionType;
  rivalryType: RivalryType;
  level: CompetitionLevel;
  logoUrl: string | null;
  eventUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  referenceLinks: string | null;
  submittedById: number;
  submittedBy: {
    id: number;
    name: string | null;
    email: string;
    username: string | null;
    role: string;
  };
  status: CompetitionStatus;
  reviewedById: number | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    participants: number;
    awards: number;
  };
}

interface ViewCompetitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  competition: Competition | null;
}

const ViewCompetitionModal = ({
  isOpen,
  onClose,
  competition,
}: ViewCompetitionModalProps) => {
  if (!isOpen || !competition) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatEnumValue = (value: string) => {
    return value.charAt(0) + value.slice(1).toLowerCase().replace("_", " ");
  };

  const getStatusBadgeClass = (status: CompetitionStatus) => {
    switch (status) {
      case "DRAFT":
        return "badge-ghost";
      case "SUBMITTED":
        return "badge-warning";
      case "ACCEPTED":
        return "badge-success";
      case "ONGOING":
        return "badge-info";
      case "COMPLETED":
        return "badge-primary";
      case "REJECTED":
        return "badge-error";
      case "CANCELLED":
        return "badge-ghost";
      default:
        return "badge-ghost";
    }
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">Competition Details</h3>
          <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Competition Info */}
          <div className="bg-base-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-4">
                {/* ✅ Line 119: Replaced <img> with <Image /> */}
                <Image
                  src={competition.logoUrl || "/icons/cosbaii-icon-primary.svg"}
                  alt="Competition Logo"
                  width={64}
                  height={64}
                  className="w-16 h-16 object-contain rounded bg-white border border-base-300"
                  onError={(e) => {
                    e.currentTarget.src = "/icons/cosbaii-icon-primary.svg";
                  }}
                />
                <div>
                  <h4 className="font-bold text-xl">{competition.name}</h4>
                  <div className="flex gap-2 mt-2">
                    <span className="badge badge-outline">
                      {formatEnumValue(competition.competitionType)}
                    </span>
                    <span className="badge badge-info">
                      {formatEnumValue(competition.rivalryType)}
                    </span>
                    <span className="badge badge-accent">
                      {formatEnumValue(competition.level)}
                    </span>
                  </div>

                  {/* Instagram URL (shown in header as well) */}
                  {competition.instagramUrl && (
                    <a
                      href={competition.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link link-primary text-sm mt-2 inline-block"
                    >
                      {competition.instagramUrl}
                    </a>
                  )}
                </div>
              </div>
              <div
                className={`badge ${getStatusBadgeClass(
                  competition.status
                )} badge-lg`}
              >
                {competition.status}
              </div>
            </div>

            {competition.description && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-1">Description:</p>
                <p className="text-sm text-base-content/80">
                  {competition.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Event Date:</p>
                <p className="text-sm">{formatDate(competition.eventDate)}</p>
              </div>
              {competition.location && (
                <div>
                  <p className="text-sm font-medium">Location:</p>
                  <p className="text-sm">{competition.location}</p>
                </div>
              )}
              {competition.organizer && (
                <div>
                  <p className="text-sm font-medium">Organizer:</p>
                  <p className="text-sm">{competition.organizer}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium">Participants:</p>
                <p className="text-sm">{competition._count.participants}</p>
              </div>
            </div>
          </div>

          {/* Logo and Reference Links */}
          {(competition.logoUrl ||
            competition.eventUrl ||
            competition.facebookUrl ||
            competition.instagramUrl ||
            competition.referenceLinks) && (
            <div className="bg-base-200 rounded-lg p-4">
              <h5 className="font-semibold mb-3">Media & References</h5>
              <div className="space-y-2">
                {competition.logoUrl && (
                  <div>
                  <p className="text-sm font-medium mb-1">Competition Logo:</p>
                  <div className="flex items-center gap-2">
                    {/* ✅ Line 209: Replaced <img> with <Image /> */}
                    <Image
                      src={competition.logoUrl || "/icons/cosbaii-icon-primary.svg"}
                      alt="Competition Logo"
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = "/icons/cosbaii-icon-primary.svg";
                      }}
                    />
                    {competition.logoUrl && (
                      <a
                        href={competition.logoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-primary text-sm"
                      >
                        View Full Image
                      </a>
                    )}
                  </div>
                </div>
                )}
                {competition.eventUrl && (
                  <div>
                    <p className="text-sm font-medium">Official Event:</p>
                    <a
                      href={competition.eventUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link link-primary text-sm"
                    >
                      {competition.eventUrl}
                    </a>
                  </div>
                )}
                {competition.facebookUrl && (
                  <div>
                    <p className="text-sm font-medium">Facebook:</p>
                    <a
                      href={competition.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link link-primary text-sm"
                    >
                      {competition.facebookUrl}
                    </a>
                  </div>
                )}
                {competition.instagramUrl && (
                  <div>
                    <p className="text-sm font-medium">Instagram:</p>
                    <a
                      href={competition.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link link-primary text-sm"
                    >
                      {competition.instagramUrl}
                    </a>
                  </div>
                )}
                {competition.referenceLinks && (
                  <div>
                    <p className="text-sm font-medium">
                      Additional References:
                    </p>
                    <pre className="text-xs bg-base-300 p-2 rounded whitespace-pre-wrap">
                      {competition.referenceLinks}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submission Info */}
          <div className="bg-base-200 rounded-lg p-4">
            <h5 className="font-semibold mb-3">Submission Details</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Submitted By:</p>
                <p className="text-sm">
                  {competition.submittedBy.name ||
                    competition.submittedBy.email}
                </p>
                <p className="text-xs text-base-content/70">
                  Role: {competition.submittedBy.role}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Submission Date:</p>
                <p className="text-sm">{formatDate(competition.createdAt)}</p>
              </div>
              {competition.reviewedAt && (
                <div>
                  <p className="text-sm font-medium">Review Date:</p>
                  <p className="text-sm">
                    {formatDate(competition.reviewedAt)}
                  </p>
                </div>
              )}
              {competition.rejectionReason && (
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-error">
                    Rejection Reason:
                  </p>
                  <p className="text-sm">{competition.rejectionReason}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-action">
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>

      {/* Backdrop */}
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={onClose}>
          close
        </button>
      </form>
    </dialog>
  );
};

export default ViewCompetitionModal;