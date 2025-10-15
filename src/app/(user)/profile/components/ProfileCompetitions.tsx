import Image from "next/image";
import {
  PlusCircleIcon,
  FunnelIcon,
  TrophyIcon,
  CheckBadgeIcon,
  ClockIcon,
} from "@heroicons/react/16/solid";
import { CompetitionCredential } from "@/types/profile";
import { PositionInfo } from "@/lib/user/profile/position";

interface Props {
  credentials: CompetitionCredential[]; // ✅ Changed from Credential[]
  loading: boolean;
  onAddCredential: () => void;
  getPositionInfo: (position: string) => PositionInfo;
  formatDate: (dateString: string) => string;
  eventYear: (dateString: string) => number;
}
export default function ProfileCompetitions({
  credentials,
  loading,
  onAddCredential,
  getPositionInfo,
  formatDate,
  eventYear,
}: Props) {
  return (
    <div id="credentials" className="flex flex-col gap-4 bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-xl font-bold">Competitions Joined</h2>
        <div className="flex flex-row items-center gap-2">
          <button
            className="btn btn-primary btn-sm text-white"
            onClick={onAddCredential}
          >
            <PlusCircleIcon className="w-4 h-4" />
            Add Credentials
          </button>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-outline btn-sm">
              <FunnelIcon className="w-4 h-4" />
              Filter: Competition Name
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

      {loading ? (
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
                    src={
                      credential.imageUrl ||
                      credential.competition.logoUrl ||
                      "/icons/cosbaii-icon-primary.svg"
                    }
                    alt={credential.imageUrl ? "Cosplay Photo" : "Competition Logo"}
                    width={200}
                    height={200}
                    className="w-30 h-30 rounded-lg bg-white p-1 border border-base-200 object-cover"
                  />

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
                    {credential.competition.competitionType} •{" "}
                    {credential.competition.rivalryType}
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">No competitions yet</h3>
          <p className="text-gray-500 mb-4">
            Start building your cosplay credentials by adding your competition participations.
          </p>
          <button className="btn btn-primary" onClick={onAddCredential}>
            <PlusCircleIcon className="w-5 h-5" />
            Add Your First Credential
          </button>
        </div>
      )}
    </div>
  );
}