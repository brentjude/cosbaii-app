import { FC, ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <>
      <main className="w-full h-screen">{children}</main>
    </>
  );
};

export default AuthLayout;
