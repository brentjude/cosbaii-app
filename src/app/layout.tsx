// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Cosbaii - Cosplay Competition Platform",
  description: "Join the ultimate cosplay competition platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="cosbaii">
      {/* ✅ Apply your custom theme */}
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
