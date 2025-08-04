'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import UserLogout from './UserLogout'

//icons
import { 
  UserIcon, 
  HomeIcon,
  ArrowRightEndOnRectangleIcon,
  Cog6ToothIcon
} from '@heroicons/react/16/solid';

const UserHeader = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  return (
    <header className="w-full shadow-xs">
      <div className="navbar max-w-[1240px] mx-auto">
        <div className="navbar-start">
            <a className="btn btn-ghost">
              <Image
                src={"/images/cosbaii-colored-wordmark.svg"}
                alt="Logo"
                width={150}
                height={30}
              /></a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal flex items-center gap-10 !p-0">
            <li>
              <Link href="#" 
                    className={`!p-0 flex flex-col hover:bg-white hover:text-primary ${
                  pathname === '/dashboard' ? 'text-primary' : 'text-base-400'
                }`}>
                <HomeIcon 
                  className="text-base-400 size-8" />
              </Link>
            </li>
            <li>
              <Link href="#" className="!p-0 flex flex-col hover:bg-white hover:text-primary">
                <UserIcon className="text-base-400 size-8" />
              </Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end dropdown dropdown-bottom dropdown-end">
            { session?.user ? (
                <span className="mr-2 text-sm">
                {session.user.username}
                </span>
            ) : 'Guest' }
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">            
                    <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
                  </div>
            </div>
            <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-md z-1 mt-3 w-52 p-2 shadow">
                <li><Link href="#" className='flex items-center gap-2 w-full text-left'><UserIcon className="w-4 h-4"/> Profile</Link></li>
                <li><Link href="#" className='flex items-center gap-2 w-full text-left'><Cog6ToothIcon className="w-4 h-4"/> Settings</Link></li>
                <li><button 
                  onClick={() => {
                    const modal = document.getElementById('logoutModal') as HTMLDialogElement;
                    if (modal) {
                      modal.showModal();
                    }
                  }}
                  className="flex items-center gap-2 w-full text-left text-error hover:bg-error hover:text-error-content"
                >
                  <ArrowRightEndOnRectangleIcon className="w-4 h-4"/>
                  Logout
                </button></li>
            </ul>
            </div>
             <UserLogout />
      </div>
    </header>
   
  )
}

export default UserHeader