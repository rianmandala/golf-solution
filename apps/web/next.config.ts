import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@gs/contracts", "@gs/format", "@gs/tokens"],
};

export default nextConfig;
