/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@radix-ui/react-accordion', '@radix-ui/react-avatar', '@radix-ui/react-dialog'],
  },
  images: {
    domains: ['localhost', 'your-api-domain.com'],
    unoptimized: true,
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  // Redirects
  async redirects() {
    return [
      // Add any redirects from your old routes if needed
    ];
  },
};

export default nextConfig;
