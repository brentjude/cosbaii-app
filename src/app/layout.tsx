// Update: src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { Open_Sans, Paytone_One } from "next/font/google";

// ✅ Configure Open Sans font
const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-open-sans",
  display: "swap",
});

// ✅ Configure Paytone One font
const paytoneOne = Paytone_One({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-paytone-one",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cosbaii - Cosplay Competition Platform",
  description: "Join the ultimate cosplay competition platform"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="cosbaii"
      className={`${openSans.variable} ${paytoneOne.variable}`}
    >
      <body className={openSans.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
