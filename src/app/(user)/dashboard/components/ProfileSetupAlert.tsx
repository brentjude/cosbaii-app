"use client";

const ProfileSetupAlert: React.FC = () => {
  return (
    <div className="alert alert-info mb-4 rounded-lg text-white">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="stroke-current shrink-0 w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <div>
        <h3 className="font-bold">Complete your profile setup!</h3>
        <div className="text-xs">
          You&apos;ve got 7 days to fully set up your Cosbaii profile.
          <br />
          We&apos;ll check if everything&apos;s complete, and if not, your
          profile will be removed to make space for new members.
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupAlert;