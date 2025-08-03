"use client";

import React from 'react'
import { signOut } from 'next-auth/react';

const UserLogout = () => {
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
    <dialog id="logoutModal" className="modal">
    <div className="modal-box bg-primary rounded-md">
        <form method="dialog">
        {/* if there is a button in form, it will close the modal */}
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-white">✕</button>
        </form>
        <h3 className="font-bold text-lg text-white text-center">Are you sure you want to logout?</h3>
        <div className="text-center flex items-center justify-center gap-4 mt-8">
            <button 
                onClick={handleLogout} 
                className="btn btn-error text-white"
            >
                Yes, logout.
            </button>
            <form method="dialog">
            <button className="cursor-pointer text-white">Cancel</button>
            </form>
        </div>
    </div>
    </dialog>
  )
}

export default UserLogout