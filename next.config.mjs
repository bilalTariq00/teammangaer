/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable turbopack explicitly
  experimental: {
    turbo: false
  },
  outputFileTracingRoot: '/Users/nc/Desktop/joyapps',
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  }
};

export default nextConfig;
