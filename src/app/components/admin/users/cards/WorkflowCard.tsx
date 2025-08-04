"use client";

import { CheckIcon, XMarkIcon, ClockIcon } from "@heroicons/react/24/outline";

const WorkflowCard = () => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title mb-4">User Review Workflow</h2>
        <div className="flex justify-center">
          <div className="steps steps-horizontal">
            <div className="step step-warning">
              <div className="flex flex-col items-center">
                <ClockIcon className="w-6 h-6 mb-1" />
                <span className="text-xs">Inactive</span>
                <span className="text-xs text-base-content/70">New signup</span>
              </div>
            </div>
            <div className="step step-success">
              <div className="flex flex-col items-center">
                <CheckIcon className="w-6 h-6 mb-1" />
                <span className="text-xs">Active</span>
                <span className="text-xs text-base-content/70">Approved</span>
              </div>
            </div>
            <div className="step step-error">
              <div className="flex flex-col items-center">
                <XMarkIcon className="w-6 h-6 mb-1" />
                <span className="text-xs">Banned</span>
                <span className="text-xs text-base-content/70">Rejected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowCard;
