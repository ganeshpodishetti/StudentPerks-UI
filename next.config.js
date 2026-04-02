/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use standard Next.js build for Netlify (not static export)
  // This supports dynamic routes and server-side features
  trailingSlash: false,
  // Turbopack configuration (path aliases are picked up from tsconfig.json)
  turbopack: {},
  experimental: {
    // Inlines critical CSS and defers non-critical rules where possible.
    optimizeCss: true,
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
      "lucide-react",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
      "cmdk",
    ],
  },
  images: {
    remotePatterns: [
      // Allowlisted image hosts only - no wildcard patterns
      {
        protocol: 'https',
        hostname: 'api.perkscrowd.com',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
      {
        protocol: 'https',
        hostname: 'perkscrowd.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Keep localhost for dev
      ...(process.env.NODE_ENV !== 'production' ? [{
        protocol: 'http',
        hostname: 'localhost',
      }] : []),
    ],
    formats: ["image/webp", "image/avif"],
  },
  // Note: headers() function doesn't work with static export
  // Security headers are handled by _headers file for static deployment

  // Build optimizations
  compiler: {
    // Remove all console methods in production (log, error, warn, info, debug, etc.)
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Reduce passive fingerprinting in production responses.
  poweredByHeader: false,
  // Generate ETags for caching
  generateEtags: true,
  // Enable compression
  compress: true,
  async redirects() {
    return [
      {
        source: '/auth/login',
        destination: '/login',
        permanent: true,
      },
      {
        source: '/auth/forgot-password',
        destination: '/forgot-password',
        permanent: true,
      },
      {
        source: '/auth/reset-password',
        destination: '/reset-password',
        permanent: true,
      },
      {
        source: '/admin',
        destination: '/dashboard',
        permanent: true,
      },
      {
        source: '/admin/:path*',
        destination: '/dashboard/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
