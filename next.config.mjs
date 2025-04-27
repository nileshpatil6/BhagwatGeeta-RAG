/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static file serving from the public directory
  reactStrictMode: true,

  // Configure static file serving
  trailingSlash: false,

  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable TypeScript checking during build
  typescript: {
    ignoreBuildErrors: true,
  },

  // Ensure API routes work properly
  async rewrites() {
    return [
      // Rewrite the root to the index.html page
      {
        source: '/',
        destination: '/index.html',
      },
    ];
  },
};

export default nextConfig;
