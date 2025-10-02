import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  images: {
    unoptimized: true
  },
  // Remover basePath para GitHub Pages
  // basePath: process.env.NODE_ENV === 'production' ? '/freelancer' : '',
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/freelancer' : '',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
