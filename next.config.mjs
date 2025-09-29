/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable turbopack explicitly
  experimental: {
    // turbo: false // This option is not valid in Next.js 15
  },
  outputFileTracingRoot: '/Users/nc/Desktop/joyapps',
  // Add cache busting for development
  generateEtags: false,
  poweredByHeader: false,
  // Ensure API routes work properly on Vercel
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  },
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
