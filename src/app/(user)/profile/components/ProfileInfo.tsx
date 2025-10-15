import { Profile } from "@/types/profile";
import { UserSettings } from "@/types/settings";

interface Props {
  profile: Profile | null;
  session: { user?: { name?: string | null } } | null;
  userSettings: UserSettings | null;
}

export default function ProfileInfo({ profile, userSettings }: Props) {

  return (
    <div className="basis-1/3 bg-white rounded-2xl p-6 border border-gray-200">
      <div id="info">

        {profile?.bio && (
          <p className="text-gray-400 mt-4 text-md">{profile.bio}</p>
        )}

        <div className="flex flex-wrap gap-2 mt-4">
          {profile?.yearsOfExperience !== null &&
            profile?.yearsOfExperience !== undefined && (
              <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm">
                {profile.yearsOfExperience === 0
                  ? "Just starting"
                  : `${profile.yearsOfExperience} years experience`}
              </span>
            )}

          {profile?.specialization && (
            <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
              {profile.specialization}
            </span>
          )}
        </div>
      </div>

      {userSettings?.showBadges && (
        <div className="mt-8">
          <h2 className="text-xl font-bold">Badges</h2>
          <p className="text-sm text-gray-500 mt-2">No badges earned yet</p>
        </div>
      )}
    </div>
  );
}