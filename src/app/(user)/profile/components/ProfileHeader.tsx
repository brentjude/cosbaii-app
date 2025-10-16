import Image from "next/image";
import { UserIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { Session } from "next-auth";
import { Profile } from "@/types/profile";
import { UserSettings } from "@/types/settings";
import { CosplayerTypeInfo } from "@/lib/user/profile/cosplayer-type";

interface Props {
  profile: Profile | null;
  session: Session | null;
  cosplayerTypeInfo: CosplayerTypeInfo;
  userSettings: UserSettings | null;
  championCount: number;
  placedCount: number;
  totalCompetitions: number;
  onEditProfile: () => void;
}

export default function ProfileHeader({
  profile,
  session,
  cosplayerTypeInfo,
  userSettings,
  championCount,
  placedCount,
  totalCompetitions,
  onEditProfile,
}: Props) {
  // ✅ Handle null displayName safely
  const displayName = profile?.displayName || session?.user?.name || "No Display Name";
  const username = session?.user?.username || "username";

  return (
    <div className="bg-white rounded-2xl border border-gray-200">
      {/* Cover Image */}
      <div className="h-80 max-md:h-50 bg-gradient-to-r from-primary to-secondary rounded-2xl relative overflow-hidden">
        {profile?.coverImage ? (
          <Image
            src={profile.coverImage}
            alt="Cover"
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20" />
        )}
      </div>

      <div className="flex flex-row max-md:flex-col max-md:gap-4 justify-between mt-[-50px] max-md:mt-[-20px] z-10 relative">
        {/* Profile Info */}
        <div className="flex flex-row gap-1 basis-1/3 bg-white rounded-r-full rounded-tl-full rounded-bl-full ml-[-30px] max-md:ml-[0px] shadow-lg">
          <div className="w-32 h-32 rounded-full border-4 border-white bg-base-200 overflow-hidden">
            {profile?.profilePicture ? (
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${profile.profilePicture})`,
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-base-300">
                <UserIcon className="w-16 h-16 text-base-content/50" />
              </div>
            )}
          </div>
          <div className="flex flex-col w-auto items-left pl-4 pr-4">
            <h1 className="text-2xl max-md:text-2xl font-bold text-gray-900 mt-4">
              {displayName}
            </h1>
            <p className="text-sm text-gray-400">@{username}</p>
            <div className={`badge ${cosplayerTypeInfo.class} badge-sm mt-4`}>
              {cosplayerTypeInfo.text}
            </div>
          </div>
        </div>

        {/* Stats cards */}
        {userSettings?.showCompetitionCounter && (
          <div className="flex flex-row max-w-[400px] sm:max-w-[600px] max-md:justify-center gap-2 mr-[-10px] basis-2/3">
            <div className="card basis-1/3 flex flex-col justify-center items-center text-center bg-white p-4 shadow-lg rounded-lg">
              <h2 className="text-[32px] font-semibold mb-2">{championCount}</h2>
              <span className="text-sm text-gray-500">Champion</span>
            </div>
            <div className="card basis-1/3 flex flex-col justify-center items-center text-center bg-white p-4 shadow-lg rounded-lg">
              <h2 className="text-[32px] font-semibold mb-2">{placedCount}</h2>
              <span className="text-sm text-gray-500">Placed</span>
            </div>
            <div className="card basis-1/3 flex flex-col justify-center items-center text-center bg-white p-4 shadow-lg rounded-lg">
              <h2 className="text-[32px] font-semibold mb-2">{totalCompetitions}</h2>
              <span className="text-sm text-gray-500">Competitions Joined</span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons and Social Links */}
      <div className="relative px-6 pb-6">
        <div className="flex flex-row gap-2 justify-end max-md:justify-center mt-4">
          <button className="btn btn-primary text-white">
            <Image
              src="/icons/white-cosbaii-icon.svg"
              className="w-4 h-4"
              width={28}
              height={28}
              alt="Cosbaii Icon"
            />
            Cosbaii Card
          </button>
          <button className="btn" onClick={onEditProfile}>
            <PencilSquareIcon className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
        <div className="divider"></div>
        <div className="flex flex-row justify-between items-center">
          <div>
            <ul className="flex flex-row gap-6 text-sm text-gray-600 font-bold">
              <li>
                <a href="#info" className="hover:text-primary">
                  INFO
                </a>
              </li>
              <li>
                <a href="#featured" className="hover:text-primary">
                  FEATURED
                </a>
              </li>
              <li>
                <a href="#credentials" className="hover:text-primary">
                  CREDENTIALS
                </a>
              </li>
            </ul>
          </div>
          <div className="flex flex-row gap-2">
            {profile?.facebookUrl && (
              <a
                href={profile.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/icons/facebook-icon.svg"
                  width={28}
                  height={28}
                  alt="Facebook Icon"
                />
              </a>
            )}
            {profile?.instagramUrl && (
              <a
                href={profile.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/icons/instagram-icon.svg"
                  width={28}
                  height={28}
                  alt="Instagram Icon"
                />
              </a>
            )}
            {profile?.twitterUrl && (
              <a
                href={profile.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/icons/x-icon.svg"
                  width={28}
                  height={28}
                  alt="X Icon/Twitter Icon"
                />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}