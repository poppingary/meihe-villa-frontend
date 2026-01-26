import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudfront.net',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  // Proxy API requests in development to avoid cross-origin cookie issues
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    // Only proxy in development when API URL is empty (use local backend)
    if (process.env.NODE_ENV === 'development' && !apiUrl) {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8888/api/:path*',
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
