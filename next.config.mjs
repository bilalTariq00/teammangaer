/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic configuration for Vercel deployment
  experimental: {
    // turbo: false // This option is not valid in Next.js 15
  },
  // Set the correct workspace root to avoid lockfile conflicts
  outputFileTracingRoot: '/Users/nc/Desktop/joyapps',
  // Add cache busting for development
  generateEtags: false,
  poweredByHeader: false,
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules/**', '**/.next/**']
      }
      
      // Add chunk loading error handling
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: {
              minChunks: 1,
              priority: -20,
              reuseExistingChunk: true
            }
          }
        }
      }
    }
    return config
  }
};

export default nextConfig;
