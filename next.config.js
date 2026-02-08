/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use standard Next.js build for Netlify (not static export)
  // This supports dynamic routes and server-side features
  trailingSlash: false,
  // Turbopack configuration (path aliases are picked up from tsconfig.json)
  turbopack: {},
  experimental: {
    optimizePackageImports: [
      "@radix-ui/react-accordion",
      "@radix-ui/react-avatar",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-separator",
      "@radix-ui/react-slot",
      "@radix-ui/react-toast",
      "@tanstack/react-query",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "studentperks-api-dev.azurewebsites.net",
      },
      {
        protocol: "https",
        hostname: "studentperks-api.azurewebsites.net",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
    ],
    // Add image formats for better performance
    formats: ["image/webp", "image/avif"],
  },
  // Note: headers() function doesn't work with static export
  // Security headers are handled by _headers file for static deployment

  // Build optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === "production",
  },
};

module.exports = nextConfig;
