"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useProfile } from "@/app/context/ProfileContext";
import Image from "next/image";
import { UserIcon } from "@heroicons/react/24/outline";

import {
  PencilSquareIcon,
  PlusCircleIcon,
  PencilIcon,
  TrophyIcon,
  FunnelIcon,
} from "@heroicons/react/16/solid";

const ProfilePage = () => {
  const { data: session } = useSession();
  const { profile, loading } = useProfile();

  // ✅ Handle all cosplayer types including PROFESSIONAL
  const getCosplayerTypeDisplay = () => {
    switch (profile?.cosplayerType) {
      case "COMPETITIVE":
        return { text: "🏆 Competitive Cosplayer", class: "badge-primary" };
      case "HOBBY":
        return { text: "🎨 Hobby Cosplayer", class: "badge-secondary" };
      case "PROFESSIONAL":
        return { text: "💼 Professional Cosplayer", class: "badge-accent" };
      default:
        return { text: "Cosplayer", class: "badge-outline" };
    }
  };

  const cosplayerTypeInfo = getCosplayerTypeDisplay();

  if (loading) {
    return (
      <main className="max-w-[1240px] mx-auto h-screen p-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full bg-primary/5 p-6">
      <div className="max-w-[1240px] mx-auto">
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

          <div className="flex flex-row max-md:flex-col gap-[20%] max-md:gap-4 justify-between mt-[-50px] max-md:mt-[-20px] z-10 relative">
            <div className="flex flex-row gap-1 basis-1/3 bg-white rounded-r-full rounded-tl-full rounded-bl-full ml-[-30px] max-md:ml-[0px] shadow-lg">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-base-200 overflow-hidden ">
                {profile?.profilePicture ? (
                  <Image
                    src={profile.profilePicture}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-base-300">
                    <UserIcon className="w-16 h-16 text-base-content/50" />
                  </div>
                )}
              </div>
              <div className="flex flex-col w-auto items-left pl-4 pr-4 ">
                <h1 className="text-3xl max-md:text-2xl font-bold text-gray-900 mt-4">
                  {profile?.displayName ||
                    session?.user?.name ||
                    "No Display Name"}
                </h1>
                <p className="text-sm text-gray-400">
                  @{session?.user?.username || "username"}
                </p>
                {/* Cosplayer Type Badge */}
                <div
                  className={`badge ${cosplayerTypeInfo.class} badge-sm mt-4`}
                >
                  {cosplayerTypeInfo.text}
                </div>
              </div>
            </div>
            <div className="flex flex-row max-md:justify-center gap-2 basis-2/3">
              <div className="card basis-1/3 flex flex-col justify-center items-center bg-white bases-[200px] p-4 shadow-lg rounded-lg">
                <h2 className="text-[32px] font-semibold mb-2">32</h2>
                <span className="text-sm text-gray-500">Champion</span>
              </div>
              <div className="card basis-1/3 flex flex-col justify-center items-center bg-white p-4 shadow-lg rounded-lg">
                <h2 className="text-[32px]  font-semibold mb-2">32</h2>
                <span className="text-sm text-gray-500">Placed</span>
              </div>
              <div className="card basis-1/3 flex flex-col justify-center items-center bg-white p-4 shadow-lg rounded-lg">
                <h2 className="text-[32px]  font-semibold mb-2">35</h2>
                <span className="text-sm text-gray-500">
                  Competition Joined
                </span>
              </div>
            </div>
          </div>

          {/* Profile Info */}
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
              <button className="btn">
                <PencilSquareIcon className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
            <div className="divider"></div>
            <div className="flex flex-row justify-between items-center">
              <div>
                <ul className="flex flex-row gap-6 text-sm text-gray-600 font-bold">
                  <li>
                    <a href="#" className="hover:text-primary">
                      INFO
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary">
                      FEATURED
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary">
                      CREDENTIALS
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary">
                      PHOTOS
                    </a>
                  </li>
                </ul>
              </div>
              <div className="flex flex-row gap-2">
                <a href="#">
                  <Image
                    src="/icons/facebook-icon.svg"
                    width={28}
                    height={28}
                    alt="Facebook Icon"
                  />
                </a>
                <a href="#">
                  <Image
                    src="/icons/instagram-icon.svg"
                    width={28}
                    height={28}
                    alt="Instagram Icon"
                  />
                </a>
                <a href="#">
                  <Image
                    src="/icons/x-icon.svg"
                    width={28}
                    height={28}
                    alt="X Icon/Twitter Icon"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row items-start gap-4 mt-4">
          <div className="basis-1/3 bg-white rounded-2xl p-6 border border-gray-200">
            <div>
              <h2 className="text-xl font-bold">
                Hi, I'm{" "}
                {profile?.displayName ||
                  session?.user?.name ||
                  "No Display Name"}
              </h2>

              {/* Bio */}
              {profile?.bio && (
                <p className="text-gray-400 mt-4 text-md">{profile.bio}</p>
              )}

              {profile?.yearsOfExperience !== null &&
                profile?.yearsOfExperience !== undefined && (
                  <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full">
                    {profile.yearsOfExperience === 0
                      ? "Just starting"
                      : `${profile.yearsOfExperience} years experience`}
                  </span>
                )}

              {profile?.specialization && (
                <span className="px-3 py-1 bg-accent/10 text-accent rounded-full">
                  {profile.specialization}
                </span>
              )}
            </div>
            <div className="mt-8">
              <h2 className="text-xl font-bold">Badges</h2>
            </div>
          </div>

          <div className="basis-2/3 flex flex-col gap-4">
            {/* Featured Competitions */}
            <div className="relative h-100 bg-white rounded-2xl border border-gray-200">
              <div className="absolute l-4 flex justify-betweem items-center w-full">
                <h2 className="absolute top-4 left-4 text-xl font-bold mb-4 text-white">
                  Featured
                </h2>

                {/* Edit Featured Button */}
                <button
                  className="absolute btn btn-primary btn-sm py-6 rounded-full top-2 right-4 tooltip tooltip-white"
                  data-tip="Edit Featured Cosplay"
                >
                  <PencilSquareIcon className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Placeholder for featured cosplay and competitions*/}
              <div className="flex flex-row">
                {/* First Card Feature */}
                <div
                  className="basis-1/3 flex flex-row items-end h-100 bg-gray-100 rounded-l-lg"
                  style={{
                    backgroundImage: "url(/images/sample-featured.png)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Competition Placeholder */}
                  <div className="flex flex-col w-60 mx-auto py-2 px-6 mb-4 bg-white rounded-2xl shadow-md">
                    <div className="flex flex-row gap-2">
                      <h3 className="text-xs font-bold">
                        {" "}
                        2018 | Otakufest Dou Cosplay Competition
                      </h3>
                      <div className="flex flex-col items-center text-yellow-500">
                        <TrophyIcon className="w-4 h-4 " />
                        <span className="text-[10px]">Champion</span>
                      </div>
                    </div>
                    <div className="flex flex-row justify-between items-center p-2">
                      <span className="text-[10px] text-gray-500">
                        Cosplay Name
                      </span>
                      <span className="text-[10px] font-bold ml-2">
                        Mikasa Ackerman
                      </span>
                    </div>
                  </div>
                </div>
                {/* Second Card Feature */}
                <div className="basis-1/3 h-100 bg-gray-200"></div>
                {/* Third Card Feature */}
                <div className="basis-1/3 h-100 bg-gray-300 rounded-r-lg"></div>
              </div>
            </div>

            {/* Competitions Joined Section */}
            <div className="flex flex-col gap-4 bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex flex-row justify-between items-center">
                <h2 className="text-xl font-bold">Competitions Joined</h2>
                <div className="flex flex-row items-center gap-2">
                  <button className="btn btn-primary btn-sm text-white">
                    <PlusCircleIcon className="w-4 h-4" />
                    Add Credentials
                  </button>
                  <div className="dropdown dropdown-end">
                    <div
                      tabIndex={0}
                      role="button"
                      className="btn btn-outline btn-sm"
                    >
                      <FunnelIcon className="w-4 h-4" />
                      Filter: Competition Name
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                    >
                      <li>
                        <a>All Users</a>
                      </li>
                      <li>
                        <a>All Users</a>
                      </li>
                      <li>
                        <a>All Users</a>
                      </li>
                      <li>
                        <a>All Users</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-2">
                {/* Competition List */}
                <div className="flex flex-row">
                  <Image
                    src="/icons/cosbaii-icon-primary.svg"
                    alt="Cosbaii Icon"
                    width={32}
                    height={32}
                    className="w-12 h-12 mr-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
