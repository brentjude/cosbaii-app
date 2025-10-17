"use client";

import UserProfileCard from "@/app/components/user/UserProfileCard";
import SubmitFeedbackCard from "@/app/components/user/SubmitFeedbackCard";

const SidebarContent: React.FC = () => {
  return (
    <div className="lg:col-span-1 space-y-4">
      <UserProfileCard />
      <SubmitFeedbackCard />
    </div>
  );
};

export default SidebarContent;