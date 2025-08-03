"use client";

import { FC, ReactNode } from "react";
import UserHeader from "../components/user/UserHeader";
import { SessionProvider } from "next-auth/react";


interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <>
    <SessionProvider>
      <UserHeader />
      <main className="w-full h-screen">
        
        {children}
        
        </main>
    </SessionProvider>
    </>
  );
};

export default AuthLayout;
