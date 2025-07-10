/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  eslint: {
    // Ignore ESLint during builds to avoid configuration issues
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: [
      "@radix-ui/react-accordion",
      "@radix-ui/react-avatar",
      "@radix-ui/react-dialog",
    ],
  },
  images: {
    domains: ["localhost", "your-api-domain.com"],
    unoptimized: true,
  },
};

module.exports = nextConfig;

