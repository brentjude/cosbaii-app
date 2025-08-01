import { FC, ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <>
      <main className="w-full h-screen">{children} test</main>
    </>
  );
};

export default AuthLayout;
