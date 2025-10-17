"use client";

interface WelcomeHeaderProps {
  displayName?: string;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ displayName }) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Welcome back{displayName ? `, ${displayName}` : ""}!
      </h1>
      <p className="text-gray-600 mt-2">Here is your Cosbaii dashboard</p>
    </div>
  );
};

export default WelcomeHeader;