'use client'

import React from 'react'
import { ArrowRightEndOnRectangleIcon } from '@heroicons/react/16/solid'
import { useSession, signOut } from 'next-auth/react'
import UserLogout from './UserLogout'

const UserHeader = () => {
  const { data: session, status } = useSession();

 // Handle logout
  const handleLogout = async () => {
    try {
      await signOut({
        redirect: true,
        callbackUrl: '/' // Redirect to homepage
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
            <div className="dropdown">
            <div  role="button" className="btn btn-ghost lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
            </div>
            <ul
                
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                <li><a>Item 1</a></li>
                <li>
                <a>Parent</a>
                <ul className="p-2">
                    <li><a>Submenu 1</a></li>
                    <li><a>Submenu 2</a></li>
                </ul>
                </li>
                <li><a>Item 3</a></li>
            </ul>
            </div>
            <a className="btn btn-ghost text-xl">daisyUI</a>
        </div>
        <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
            <li><a>Item 1</a></li>
            <li><a>Item 3</a></li>
            </ul>
        </div>
        <div className="navbar-end dropdown dropdown-bottom dropdown-end">
            { session?.user ? (
                <span className="mr-2 text-sm">
                {session.user.username}
                </span>
            ) : 'Guest' }
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /> </svg>
            </div>
            <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-md z-1 mt-3 w-52 p-2 shadow">
                <li><a>Profile</a></li>
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
    </header>
   
  )
}

export default UserHeader