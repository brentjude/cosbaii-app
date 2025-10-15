"use client";

import { XMarkIcon, CalendarIcon, MapPinIcon, TrophyIcon, LinkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { Competition } from "@/types/competition";
import {
  getStatusBadgeClass,
  formatDate,
  formatDateTime,
  getCompetitionTypeLabel,
  getRivalryTypeLabel,
  getLevelLabel,
} from "@/utils/competition";

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

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">Competition Details</h3>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Logo */}
        {competition.logoUrl && (
          <div className="mb-6 flex justify-center">
            <div className="relative w-64 h-64 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={competition.logoUrl}
                alt={competition.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* Competition Name & Status */}
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-2xl font-bold">{competition.name}</h2>
            <span className={`badge badge-lg ${getStatusBadgeClass(competition.status)}`}>
              {competition.status}
            </span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex gap-2 flex-wrap mb-6">
          <span className="badge badge-lg badge-outline">
            <TrophyIcon className="w-4 h-4 mr-1" />
            {getCompetitionTypeLabel(competition.competitionType)}
          </span>
          <span className="badge badge-lg badge-info">
            {getRivalryTypeLabel(competition.rivalryType)}
          </span>
          <span className="badge badge-lg badge-accent">
            {getLevelLabel(competition.level)}
          </span>
        </div>

        {/* Description */}
        {competition.description && (
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Description</h4>
            <p className="text-base-content/80 whitespace-pre-wrap">
              {competition.description}
            </p>
          </div>
        )}

        {/* Event Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-base-200 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-primary font-semibold mb-2">
              <CalendarIcon className="w-5 h-5" />
              Event Date
            </div>
            <p className="text-lg">{formatDate(competition.eventDate)}</p>
          </div>

          {competition.location && (
            <div className="bg-base-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-primary font-semibold mb-2">
                <MapPinIcon className="w-5 h-5" />
                Location
              </div>
              <p className="text-lg">{competition.location}</p>
            </div>
          )}

          {competition.organizer && (
            <div className="bg-base-200 p-4 rounded-lg">
              <div className="font-semibold mb-2">Organizer</div>
              <p className="text-lg">{competition.organizer}</p>
            </div>
          )}

          <div className="bg-base-200 p-4 rounded-lg">
            <div className="font-semibold mb-2">Participants</div>
            <p className="text-lg font-bold text-primary">
              {competition._count.participants}
            </p>
          </div>
        </div>

        {/* Reference Links */}
        {(competition.eventUrl ||
          competition.facebookUrl ||
          competition.instagramUrl ||
          competition.referenceLinks) && (
          <div className="mb-6">
            <div className="flex items-center gap-2 font-semibold mb-3">
              <LinkIcon className="w-5 h-5" />
              Reference Links
            </div>
            <div className="space-y-2">
              {competition.eventUrl && (
                <div className="flex items-start gap-2">
                  <span className="text-sm font-medium w-24">Event URL:</span>
                  <a
                    href={competition.eventUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link link-primary text-sm break-all"
                  >
                    {competition.eventUrl}
                  </a>
                </div>
              )}

              {competition.facebookUrl && (
                <div className="flex items-start gap-2">
                  <span className="text-sm font-medium w-24">Facebook:</span>
                  <a
                    href={competition.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link link-primary text-sm break-all"
                  >
                    {competition.facebookUrl}
                  </a>
                </div>
              )}

              {competition.instagramUrl && (
                <div className="flex items-start gap-2">
                  <span className="text-sm font-medium w-24">Instagram:</span>
                  <a
                    href={competition.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link link-primary text-sm break-all"
                  >
                    {competition.instagramUrl}
                  </a>
                </div>
              )}

              {competition.referenceLinks && (
                <div className="flex items-start gap-2">
                  <span className="text-sm font-medium w-24">Other:</span>
                  <p className="text-sm text-base-content/70 whitespace-pre-wrap flex-1">
                    {competition.referenceLinks}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Submission Info */}
        <div className="border-t pt-4 mt-6">
          <h4 className="font-semibold mb-3">Submission Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-base-content/70">Submitted by:</span>
              <span className="font-medium">
                {competition.submittedBy.name || competition.submittedBy.email}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-base-content/70">Submitted at:</span>
              <span className="font-medium">
                {formatDateTime(competition.createdAt)}
              </span>
            </div>
            {competition.reviewedAt && (
              <>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Reviewed at:</span>
                  <span className="font-medium">
                    {formatDateTime(competition.reviewedAt)}
                  </span>
                </div>
                {competition.rejectionReason && (
                  <div className="mt-3 p-3 bg-error/10 rounded-lg border border-error/20">
                    <span className="text-sm font-semibold text-error block mb-1">
                      Rejection Reason:
                    </span>
                    <p className="text-sm text-base-content/80">
                      {competition.rejectionReason}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="modal-action">
          <button onClick={onClose} className="btn btn-ghost">
            Close
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={onClose}>
          close
        </button>
      </form>
    </dialog>
  );
};

export default ViewCompetitionModal;