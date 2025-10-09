const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: false,
  eslint: {
    // Ensure ESLint runs during builds to maintain code quality
    ignoreDuringBuilds: false,
  },
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
    domains: [
      "localhost",
      "studentperks-api-dev.azurewebsites.net",
      "studentperks-api.azurewebsites.net", // production API
      "images.unsplash.com", // if using Unsplash for placeholder images
      "via.placeholder.com", // if using placeholder images
    ],
    // Keep unoptimized true for static export compatibility
    unoptimized: true,
    // Add image formats for better performance
    formats: ['image/webp', 'image/avif'],
  },
  // Note: headers() function doesn't work with static export
  // Security headers are handled by _headers file for static deployment
  
  // Build optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config, { dev, isServer }) => {
    // Add path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@/shared': path.resolve(__dirname, 'src/shared'),
      '@/features': path.resolve(__dirname, 'src/features'),
    }

    // Optimize bundle in production
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks.cacheGroups,
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      }
    }

    return config
  }
};

module.exports = nextConfig;

