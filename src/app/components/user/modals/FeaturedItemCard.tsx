"use client";

import { useCallback, useRef } from "react";
import { CameraIcon, XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { FeaturedItem, UserCredential } from "@/types/profile";

interface FeaturedItemCardProps {
  item: FeaturedItem;
  index: number;
  searchTerm: string;
  showDropdown: boolean;
  userCredentials: UserCredential[];
  imageUploading: boolean;
  disabled: boolean;
  onTypeChange: (type: "competition" | "cosplay") => void;
  onSearchChange: (value: string) => void;
  onCompetitionSelect: (credential: UserCredential) => void;
  onClearCompetition: () => void;
  onImageUpload: (file: File) => void;
  onFieldChange: (field: keyof FeaturedItem, value: string) => void;
}

const FeaturedItemCard: React.FC<FeaturedItemCardProps> = ({
  item,
  index,
  searchTerm,
  showDropdown,
  userCredentials,
  imageUploading,
  disabled,
  onTypeChange,
  onSearchChange,
  onCompetitionSelect,
  onClearCompetition,
  onImageUpload,
  onFieldChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onImageUpload(file);
        e.target.value = "";
      }
    },
    [onImageUpload]
  );

  const getFilteredCredentials = useCallback(() => {
    if (!searchTerm) return userCredentials;

    const term = searchTerm.toLowerCase();
    return userCredentials.filter(
      (credential) =>
        credential.competition.name.toLowerCase().includes(term) ||
        credential.cosplayTitle?.toLowerCase().includes(term) ||
        credential.competition.location?.toLowerCase().includes(term)
    );
  }, [searchTerm, userCredentials]);

  return (
    <div className="bg-base-100 rounded-xl border border-base-200 overflow-hidden">
      {/* Header */}
      <div className="bg-base-200 px-4 py-3 border-b border-base-300">
        <h4 className="font-semibold text-sm">Featured #{index + 1}</h4>
      </div>

      <div className="p-4 space-y-4">
        {/* Type Selection */}
        <div className="space-y-2">
          <label className="label py-1">
            <span className="label-text font-medium text-xs">Type</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className={`btn btn-sm text-xs ${
                item.type === "competition" ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => onTypeChange("competition")}
              disabled={disabled}
            >
              🏆 Competition
            </button>
            <button
              type="button"
              className={`btn btn-sm text-xs ${
                item.type === "cosplay" ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => onTypeChange("cosplay")}
              disabled={disabled}
            >
              🎭 Custom
            </button>
          </div>
        </div>

        {/* Competition Selection */}
        {item.type === "competition" && (
          <div className="space-y-2">
            <label className="label py-1">
              <span className="label-text font-medium text-xs">Competition</span>
            </label>
            <div className="relative">
              <input
                type="text"
                className="input input-bordered input-sm w-full pr-16 text-xs"
                placeholder={
                  userCredentials.length > 0
                    ? "Search competitions..."
                    : "No competitions"
                }
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                disabled={userCredentials.length === 0 || disabled}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                {item.competitionId && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs"
                    onClick={onClearCompetition}
                    title="Clear"
                    disabled={disabled}
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                )}
                <MagnifyingGlassIcon className="w-4 h-4 text-base-content/50" />
              </div>

              {/* Dropdown */}
              {showDropdown && userCredentials.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-10 bg-base-100 border border-base-200 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
                  {getFilteredCredentials().length > 0 ? (
                    getFilteredCredentials().map((credential) => (
                      <div
                        key={credential.id}
                        className="p-2 hover:bg-base-200 cursor-pointer border-b border-base-200 last:border-b-0"
                        onClick={() => onCompetitionSelect(credential)}
                      >
                        <div className="font-medium text-xs">
                          {credential.competition.name}
                        </div>
                        <div className="text-[10px] text-base-content/70">
                          {new Date(credential.competition.eventDate).toLocaleDateString()}
                          {credential.competition.location &&
                            ` • ${credential.competition.location}`}
                        </div>
                        {credential.position && (
                          <div className="badge badge-primary badge-xs mt-1">
                            {credential.position}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-xs text-base-content/50 text-center">
                      No competitions found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Competition Info Display */}
        {item.type === "competition" && item.competition && (
          <div className="bg-primary/10 rounded-lg p-3 space-y-1">
            <div className="text-xs font-medium">{item.competition.name}</div>
            <div className="text-[10px] text-base-content/70">
              {new Date(item.competition.eventDate).toLocaleDateString()}
              {item.competition.location && ` • ${item.competition.location}`}
            </div>
            <div className="flex gap-1 mt-1">
              <span className="badge badge-outline badge-xs">
                {item.competition.competitionType}
              </span>
              <span className="badge badge-outline badge-xs">
                {item.competition.level}
              </span>
            </div>
          </div>
        )}

        {/* Featured Image */}
        <div className="space-y-2">
          <label className="label py-1">
            <span className="label-text font-medium text-xs">Image</span>
          </label>
          <div
            className="aspect-[4/3] bg-base-200 rounded-lg overflow-hidden relative group cursor-pointer border-2 border-dashed border-base-300 hover:border-primary transition-colors"
            onClick={() => !imageUploading && !disabled && fileInputRef.current?.click()}
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
                  <CameraIcon className="w-6 h-6 mx-auto mb-1" />
                  <p className="text-[10px]">Add image</p>
                </div>
              </div>
            )}

            {imageUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white">
                  <span className="loading loading-spinner loading-md mb-1"></span>
                  <p className="text-[10px]">Uploading...</p>
                </div>
              </div>
            )}

            {!imageUploading && !disabled && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <CameraIcon className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={imageUploading || disabled}
          />
        </div>

        {/* Details */}
        <div className="space-y-2">
          <input
            type="text"
            className="input input-bordered input-sm w-full text-xs"
            placeholder={
              item.type === "competition"
                ? "Title (auto-filled)"
                : "Cosplay title"
            }
            value={item.title}
            onChange={(e) => onFieldChange("title", e.target.value)}
            disabled={disabled}
          />
          <input
            type="text"
            className="input input-bordered input-sm w-full text-xs"
            placeholder="Character name"
            value={item.character || ""}
            onChange={(e) => onFieldChange("character", e.target.value)}
            disabled={disabled}
          />
          <input
            type="text"
            className="input input-bordered input-sm w-full text-xs"
            placeholder="Series/franchise"
            value={item.series || ""}
            onChange={(e) => onFieldChange("series", e.target.value)}
            disabled={disabled}
          />
          <textarea
            className="textarea textarea-bordered textarea-sm w-full text-xs"
            placeholder="Description"
            rows={2}
            value={item.description}
            onChange={(e) => onFieldChange("description", e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};

export default FeaturedItemCard;