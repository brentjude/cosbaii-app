import { InformationCircleIcon } from "@heroicons/react/24/outline";

export default function WorkflowCard() {
  return (
    <div className="alert bg-info/10 border-info/20">
      <InformationCircleIcon className="w-6 h-6 text-info" />
      <div>
        <h3 className="font-bold">User Management Workflow</h3>
        <div className="text-sm">
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>New users register and appear with <span className="badge badge-warning badge-sm">INACTIVE</span> status</li>
            <li>Review user details and either <span className="text-success font-semibold">Approve</span> or <span className="text-error font-semibold">Ban</span></li>
            <li>Approved users get <span className="badge badge-success badge-sm">ACTIVE</span> status and can access the platform</li>
            <li>Banned users get <span className="badge badge-error badge-sm">BANNED</span> status and cannot log in</li>
          </ol>
        </div>
      </div>
    </div>
  );
}