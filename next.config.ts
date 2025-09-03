import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    domains: ["localhost", "utfs.io", "2jc6rnrlfu.ufs.sh"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
