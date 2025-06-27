import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://media.rawg.io/**')]
  }
};

export default nextConfig;
