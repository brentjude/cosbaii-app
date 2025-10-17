// Create: src/app/components/skeletons/user/UserHeaderSkeleton.tsx
export default function UserHeaderSkeleton() {
  return (
    <header className="w-full shadow-xs bg-base-100">
      <div className="navbar max-w-[1240px] mx-auto">
        <div className="navbar-start">
          <div className="ml-2 animate-pulse">
            <div className="bg-gray-200 h-[30px] w-[150px] rounded"></div>
          </div>
        </div>

        {/* Desktop Navigation - Hidden on Mobile */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal flex items-center gap-10 !p-0">
            <li>
              <div className="animate-pulse">
                <div className="bg-gray-200 size-7 rounded"></div>
              </div>
            </li>
            <li>
              <div className="animate-pulse">
                <div className="bg-gray-200 size-7 rounded"></div>
              </div>
            </li>
          </ul>
        </div>

        <div className="navbar-end flex items-center gap-2">
          {/* Notification Icon Skeleton */}
          <div className="btn btn-ghost btn-circle animate-pulse">
            <div className="bg-gray-200 w-6 h-6 rounded"></div>
          </div>

          {/* Username Skeleton - Hidden on Mobile */}
          <div className="hidden lg:block animate-pulse">
            <div className="bg-gray-200 h-4 w-20 rounded"></div>
          </div>

          {/* Avatar Skeleton - Hidden on Mobile */}
          <div className="hidden lg:block animate-pulse">
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
          </div>
        </div>
      </div>
    </header>
  );
}