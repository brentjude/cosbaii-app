import { Competition } from "@/types/competition";
import CompetitionTableRow from "./CompetitionTableRow";

interface CompetitionsTableProps {
  competitions: Competition[];
  loading: boolean;
  actionLoading: boolean;
  onView: (competition: Competition) => void;
  onEdit: (competition: Competition) => void;
  onDelete: (competition: Competition) => void;
  onReview: (competition: Competition, action: "ACCEPT" | "REJECT") => void;
  onViewParticipants: (competition: Competition) => void;
}

export default function CompetitionsTable({
  competitions,
  loading,
  actionLoading,
  onView,
  onEdit,
  onDelete,
  onReview,
  onViewParticipants,
}: CompetitionsTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (competitions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-base-content/70">No competitions found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Competition Details</th>
            <th>Event Date</th>
            <th>Submitted By</th>
            <th>Status</th>
            <th>Participants</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {competitions.map((competition) => (
            <CompetitionTableRow
              key={competition.id}
              competition={competition}
              actionLoading={actionLoading}
              onView={() => onView(competition)}
              onEdit={() => onEdit(competition)}
              onDelete={() => onDelete(competition)}
              onReview={(action) => onReview(competition, action)}
              onViewParticipants={() => onViewParticipants(competition)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}