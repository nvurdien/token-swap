import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  experimental: {
    serverComponentsExternalPackages: ["@funkit/api-base"],
  },
};

export default nextConfig;
