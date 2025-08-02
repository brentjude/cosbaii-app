import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cosbaii",
  description: "Platform for Cosplayers",
  icons: {
    icon: [
      { url : './favicon.ico' }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="cosbaii">
      <body>{children}</body>
    </html>
  );
}
