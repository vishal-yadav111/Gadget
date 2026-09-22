import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 100],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  async rewrites() {
    return [
      {
        source: "/api/evaluate-direct/:path*",
        destination: "https://store.xtracover.com/api/StoreApi/:path*",
      },
    ];
  },
};

export default nextConfig;
