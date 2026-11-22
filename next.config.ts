import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Isolated browser checks can run beside the ordinary local app.
  distDir: process.env.SIDEKICK_NEXT_DIST_DIR || ".next",
  typescript: { tsconfigPath: process.env.SIDEKICK_NEXT_TSCONFIG || "tsconfig.json" },
  poweredByHeader: false,
  devIndicators: false,
  experimental: {
    // Rewrites default to 30s. Reading can take up to 180s, and activity
    // composition may make four bounded provider calls before returning.
    proxyTimeout: 900_000,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL || "http://127.0.0.1:8000"}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
