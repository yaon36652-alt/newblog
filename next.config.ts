import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 注意：不要开启 cacheComponents / partialPrefetching，
  // 与页面级 dynamic = "force-dynamic"（实时读库）冲突
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
