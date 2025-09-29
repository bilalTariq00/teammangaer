/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic configuration for Vercel deployment
  experimental: {
    // turbo: false // This option is not valid in Next.js 15
  },
  // Set the correct workspace root to avoid lockfile conflicts
  // outputFileTracingRoot: '/Users/nc/Desktop/joyapps', // Commented out for Vercel deployment
  // Add cache busting for development
  generateEtags: false,
  poweredByHeader: false,
  // Simplified webpack config for better Vercel compatibility
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules/**', '**/.next/**']
      }
    }
    return config
  }
};

export default nextConfig;
