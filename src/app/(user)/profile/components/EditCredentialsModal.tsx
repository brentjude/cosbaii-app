"use client";
/* eslint-disable react/no-unescaped-entities */

import { useState, useEffect } from "react";
import {
  XMarkIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckBadgeIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { CompetitionCredential } from "@/types/profile";

interface EditCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  credentials: CompetitionCredential[];
  onSave: () => Promise<void>;
  getPositionInfo: (position: string) => {
    text: string;
    bgColor: string;
    textColor: string;
    icon: boolean;
  };
  formatDate: (dateString: string) => string;
}

export default function EditCredentialsModal({
  isOpen,
  onClose,
  credentials,
  onSave,
  getPositionInfo,
  formatDate,
}: EditCredentialsModalProps) {
  const [orderedCredentials, setOrderedCredentials] = useState<CompetitionCredential[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize ordered credentials when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log('Initial credentials:', credentials);
      setOrderedCredentials([...credentials]);
      setConfirmDeleteId(null);
      setHasChanges(false);
      setError(null);
    }
  }, [isOpen, credentials]);

  const handleMoveUp = (index: number) => {
    if (index === 0) return;

    const newOrder = [...orderedCredentials];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    setOrderedCredentials(newOrder);
    setHasChanges(true);
    
    console.log('After move up:', newOrder.map((c, i) => ({ id: c.id, newIndex: i })));
  };

  const handleMoveDown = (index: number) => {
    if (index === orderedCredentials.length - 1) return;

    const newOrder = [...orderedCredentials];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    setOrderedCredentials(newOrder);
    setHasChanges(true);
    
    console.log('After move down:', newOrder.map((c, i) => ({ id: c.id, newIndex: i })));
  };

  const handleDeleteClick = (credentialId: number) => {
    setConfirmDeleteId(credentialId);
  };

  const handleConfirmDelete = async (credentialId: number) => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/user/credentials/${credentialId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete credential");
      }

      // Remove from local state
      setOrderedCredentials((prev) => prev.filter((c) => c.id !== credentialId));
      setConfirmDeleteId(null);
      setHasChanges(true);
    } catch (err) {
      console.error("Error deleting credential:", err);
      setError(err instanceof Error ? err.message : "Failed to delete credential");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const handleSave = async () => {
    if (!hasChanges) {
      onClose();
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const orderUpdates = orderedCredentials.map((credential, index) => ({
        id: credential.id,
        order: index,
      }));

      console.log('Sending order updates:', orderUpdates);

      const response = await fetch("/api/user/credentials/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credentials: orderUpdates }),
      });

      const result = await response.json();
      console.log('Reorder response:', result);

      if (!response.ok) {
        throw new Error(result.error || "Failed to save changes");
      }

      await onSave();
      onClose();
    } catch (err) {
      console.error("Error saving credential order:", err);
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const canDelete = (credential: CompetitionCredential) => {
    return credential.verified || !credential.verified;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* Modal - Full screen on mobile, centered on desktop */}
      <div className="fixed inset-0 sm:inset-4 z-50 flex items-start sm:items-center justify-center">
        <div className="w-full h-full sm:h-auto sm:max-h-[95vh] sm:max-w-4xl bg-base-100 sm:rounded-2xl shadow-2xl flex flex-col">
          {/* Header - Fixed */}
          <div className="flex-none px-4 sm:px-6 py-4 sm:py-5 border-b border-base-200 bg-base-100 sm:rounded-t-2xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg sm:text-2xl font-bold">Manage Credentials</h2>
                <p className="text-xs sm:text-sm text-base-content/70 mt-0.5">
                  Rearrange or delete competitions
                </p>
              </div>
              <button
                onClick={onClose}
                className="btn btn-sm btn-circle btn-ghost"
                disabled={isSaving || isDeleting}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Alerts - Fixed */}
          <div className="flex-none px-4 sm:px-6">
            {/* Error Alert */}
            {error && (
              <div className="mt-3 alert alert-error text-xs sm:text-sm py-2">
                <ExclamationTriangleIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="flex-1 min-w-0 truncate">{error}</span>
                <button
                  className="btn btn-xs btn-ghost flex-shrink-0"
                  onClick={() => setError(null)}
                >
                  <XMarkIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            )}

            {/* Info Alert */}
            <div className="mt-3 alert alert-info text-xs sm:text-sm py-2 sm:py-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-4 h-4 sm:w-5 sm:h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <div className="text-[11px] sm:text-sm">
                <p className="font-medium">Quick Tips</p>
                <ul className="list-disc list-inside mt-0.5 space-y-0.5">
                  <li className="hidden sm:list-item">You can delete any credential (pending or verified)</li>
                  <li>Use arrows to reorder credentials</li>
                  <li className="hidden sm:list-item">Changes are saved when you click "Save Changes"</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Content - Scrollable (with padding for mobile bottom nav) */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 pb-28 sm:pb-6 min-h-0">
            {orderedCredentials.length === 0 ? (
              <div className="text-center py-12">
                <TrophyIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                  No credentials yet
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  Add competition credentials to manage them here.
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {orderedCredentials.map((credential, index) => {
                  const positionInfo = getPositionInfo(credential.position);
                  const isConfirmingDelete = confirmDeleteId === credential.id;

                  return (
                    <div
                      key={credential.id}
                      className={`card bg-base-200 shadow-sm transition-all ${
                        isConfirmingDelete ? "ring-2 ring-error" : ""
                      }`}
                    >
                      <div className="card-body p-3 sm:p-4">
                        {/* Confirmation Overlay */}
                        {isConfirmingDelete && (
                          <div className="mb-3 bg-error/10 border border-error rounded-lg p-3">
                            <div className="flex items-start gap-2 sm:gap-3">
                              <ExclamationTriangleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-error flex-shrink-0 mt-0.5" />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-error text-sm sm:text-base mb-1 sm:mb-2">
                                  Confirm Deletion
                                </h4>
                                <p className="text-xs sm:text-sm text-base-content/80 mb-2 sm:mb-3">
                                  Delete this credential? This can't be undone.
                                </p>
                                <div className="flex gap-2">
                                  <button
                                    className="btn btn-error btn-xs sm:btn-sm"
                                    onClick={() => handleConfirmDelete(credential.id)}
                                    disabled={isDeleting}
                                  >
                                    {isDeleting ? (
                                      <>
                                        <span className="loading loading-spinner loading-xs"></span>
                                        <span className="hidden sm:inline">Deleting...</span>
                                      </>
                                    ) : (
                                      <>
                                        <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span className="hidden sm:inline">Confirm</span>
                                        <span className="sm:hidden">Delete</span>
                                      </>
                                    )}
                                  </button>
                                  <button
                                    className="btn btn-ghost btn-xs sm:btn-sm"
                                    onClick={handleCancelDelete}
                                    disabled={isDeleting}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-start gap-2 sm:gap-4">
                          {/* Reorder Controls */}
                          <div className="flex flex-col gap-0.5 sm:gap-1 flex-shrink-0">
                            <button
                              className="btn btn-xs btn-ghost btn-square"
                              onClick={() => handleMoveUp(index)}
                              disabled={index === 0 || isSaving || isDeleting}
                              aria-label="Move up"
                            >
                              <ArrowUpIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                            <div className="text-[10px] sm:text-xs text-center font-semibold text-base-content/50">
                              {index + 1}
                            </div>
                            <button
                              className="btn btn-xs btn-ghost btn-square"
                              onClick={() => handleMoveDown(index)}
                              disabled={
                                index === orderedCredentials.length - 1 ||
                                isSaving ||
                                isDeleting
                              }
                              aria-label="Move down"
                            >
                              <ArrowDownIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                          </div>

                          {/* Credential Image - Hidden on Mobile */}
                          <div className="relative flex-shrink-0 hidden sm:block">
                            <Image
                              src={
                                credential.imageUrl ||
                                credential.competition.logoUrl ||
                                "/icons/cosbaii-icon-primary.svg"
                              }
                              alt={
                                credential.imageUrl
                                  ? "Cosplay Photo"
                                  : "Competition Logo"
                              }
                              width={80}
                              height={80}
                              className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-white p-1 border border-base-300 object-cover"
                            />

                            {positionInfo.icon && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                                <TrophyIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                              </div>
                            )}
                          </div>

                          {/* Credential Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1 sm:mb-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm sm:text-base truncate">
                                  {credential.competition.name}
                                </h3>
                                <p className="text-[11px] sm:text-sm text-base-content/70 truncate">
                                  {credential.competition.competitionType} •{" "}
                                  {credential.competition.rivalryType}
                                  <span className="hidden sm:inline"> • {credential.competition.level}</span>
                                </p>
                              </div>

                              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                                {credential.verified ? (
                                  <div
                                    className="tooltip tooltip-left"
                                    data-tip="Verified"
                                  >
                                    <CheckBadgeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                                  </div>
                                ) : (
                                  <div
                                    className="tooltip tooltip-left"
                                    data-tip="Pending"
                                  >
                                    <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-warning animate-pulse" />
                                  </div>
                                )}
                              </div>
                            </div>

                            {credential.cosplayTitle && (
                              <div className="flex items-center gap-1.5 mb-0.5 sm:mb-1">
                                <span className="text-[10px] sm:text-xs text-base-content/60">
                                  Cosplay:
                                </span>
                                <span className="text-xs sm:text-sm font-medium truncate">
                                  {credential.cosplayTitle}
                                </span>
                              </div>
                            )}

                            {credential.characterName && (
                              <div className="flex items-center gap-1.5 mb-0.5 sm:mb-1">
                                <span className="text-[10px] sm:text-xs text-base-content/60">
                                  Character:
                                </span>
                                <span className="text-xs sm:text-sm truncate">
                                  {credential.characterName}
                                  {credential.seriesName && (
                                    <span className="hidden sm:inline"> ({credential.seriesName})</span>
                                  )}
                                </span>
                              </div>
                            )}

                            <div className="flex items-center gap-1.5 mb-1.5 sm:mb-2">
                              <span className="text-[10px] sm:text-xs text-base-content/60">Date:</span>
                              <span className="text-xs sm:text-sm">
                                {formatDate(credential.competition.eventDate)}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                              <span
                                className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full ${positionInfo.bgColor} ${positionInfo.textColor}`}
                              >
                                {positionInfo.text}
                              </span>

                              {!credential.verified && (
                                <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-warning/20 text-warning text-[10px] sm:text-xs font-medium rounded-full">
                                  Pending
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Delete Button */}
                          <div className="flex flex-col justify-center flex-shrink-0">
                            {canDelete(credential) && (
                              <button
                                className="btn btn-error btn-xs sm:btn-sm btn-outline"
                                onClick={() => handleDeleteClick(credential.id)}
                                disabled={
                                  isSaving || isDeleting || isConfirmingDelete
                                }
                                aria-label="Delete credential"
                              >
                                <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer - Fixed (Above Mobile Nav) */}
          <div className="flex-none px-4 sm:px-6 py-3 sm:py-4 border-t border-base-200 bg-base-100 sm:rounded-b-2xl fixed sm:relative bottom-16 sm:bottom-0 left-0 right-0 z-10">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
              <div className="text-xs sm:text-sm text-base-content/70 text-center sm:text-left">
                {hasChanges ? (
                  <span className="text-warning font-medium">
                    ⚠️ Unsaved changes
                  </span>
                ) : (
                  <span>No changes</span>
                )}
              </div>
              <div className="flex gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-ghost btn-sm flex-1 sm:flex-none"
                  disabled={isSaving || isDeleting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="btn btn-primary btn-sm flex-1 sm:flex-none"
                  disabled={!hasChanges || isSaving || isDeleting}
                >
                  {isSaving ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      <span className="hidden sm:inline">Saving...</span>
                      <span className="sm:hidden">Save</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Save Changes</span>
                      <span className="sm:hidden">Save</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}