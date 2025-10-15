import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { Competition } from "@/types/competition";
import {
  getStatusBadgeClass,
  formatDate,
  getCompetitionTypeLabel,
  getRivalryTypeLabel,
  getLevelLabel,
} from "@/utils/competition";

interface CompetitionTableRowProps {
  competition: Competition;
  actionLoading: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onReview: (action: "ACCEPT" | "REJECT") => void;
  onViewParticipants: () => void;
}

export default function CompetitionTableRow({
  competition,
  actionLoading,
  onView,
  onEdit,
  onDelete,
  onReview,
  onViewParticipants,
}: CompetitionTableRowProps) {
  return (
    <tr className="hover">
      <td>
        <div>
          <div className="font-semibold">{competition.name}</div>
          <div className="flex gap-2 mt-1 flex-wrap">
            <span className="badge badge-sm badge-outline">
              {getCompetitionTypeLabel(competition.competitionType)}
            </span>
            <span className="badge badge-sm badge-info">
              {getRivalryTypeLabel(competition.rivalryType)}
            </span>
            <span className="badge badge-sm badge-accent">
              {getLevelLabel(competition.level)}
            </span>
          </div>
          {competition.location && (
            <div className="text-sm text-base-content/70 flex items-center gap-1 mt-1">
              <MapPinIcon className="w-3 h-3" />
              {competition.location}
            </div>
          )}
          {competition.organizer && (
            <div className="text-sm text-base-content/70">
              Org: {competition.organizer}
            </div>
          )}
        </div>
      </td>
      <td>
        <div className="flex items-center gap-1">
          <CalendarIcon className="w-4 h-4 text-base-content/50" />
          {formatDate(competition.eventDate)}
        </div>
      </td>
      <td>
        <div className="flex items-center gap-2">
          <UserIcon className="w-4 h-4 text-base-content/50" />
          <div>
            <div className="font-medium">
              {competition.submittedBy.name || competition.submittedBy.email}
            </div>
            <div className="text-sm text-base-content/70">
              {competition.submittedBy.role}
            </div>
          </div>
        </div>
      </td>
      <td>
        <div className={`badge ${getStatusBadgeClass(competition.status)}`}>
          {competition.status}
        </div>
      </td>
      <td>
        <button
          className="btn btn-sm btn-ghost gap-2 tooltip"
          data-tip="View Participants"
          onClick={onViewParticipants}
        >
          <UsersIcon className="w-4 h-4" />
          <span className="font-semibold">{competition._count.participants}</span>
        </button>
      </td>
      <td>
        <div className="flex gap-1">
          {competition.status === "SUBMITTED" && (
            <>
              <button
                className="btn btn-sm btn-success tooltip"
                data-tip="Accept Competition"
                onClick={() => onReview("ACCEPT")}
                disabled={actionLoading}
              >
                <CheckIcon className="w-4 h-4" />
              </button>
              <button
                className="btn btn-sm btn-error tooltip"
                data-tip="Reject Competition"
                onClick={() => onReview("REJECT")}
                disabled={actionLoading}
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </>
          )}

          <button
            className="btn btn-sm btn-info btn-outline tooltip"
            data-tip="View Details"
            onClick={onView}
          >
            <EyeIcon className="w-4 h-4" />
          </button>

          <button
            className="btn btn-sm btn-ghost tooltip"
            data-tip="Edit Competition"
            onClick={onEdit}
          >
            <PencilIcon className="w-4 h-4" />
          </button>

          <button
            className="btn btn-sm btn-error btn-outline tooltip"
            data-tip="Delete Competition"
            onClick={onDelete}
            disabled={actionLoading}
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}