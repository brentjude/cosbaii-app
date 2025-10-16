import type { NextConfig } from "next";
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.daisyui.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // ✅ Prisma webpack configuration for Vercel
  webpack: (config, { isServer }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    if (isServer) config.plugins = [...config.plugins, new PrismaPlugin()]
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return config
  },
  // ✅ FIXED: Use serverExternalPackages instead of experimental.serverComponentsExternalPackages
  serverExternalPackages: ['@prisma/client', '@prisma/engines'],
};

export default nextConfig;