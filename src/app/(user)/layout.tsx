"use client";

import { FC, ReactNode } from "react";
import UserHeader from "../components/user/UserHeader";
import { SessionProvider } from "next-auth/react";
import { ProfileProvider } from "../context/ProfileContext";


interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <SessionProvider>
    <ProfileProvider>
      
        <UserHeader />
      
      <main className="w-full h-screen">
        
        {children}
        
        </main>
   
    </ProfileProvider>
     </SessionProvider>
  );
};

export default AuthLayout;
