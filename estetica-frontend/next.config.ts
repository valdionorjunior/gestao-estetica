import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/uploads/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "localhost:3001"],
    },
  },
};

export default nextConfig;

