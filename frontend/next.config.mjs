// next.config.mjs
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: 'backend',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'soften-solar.onrender.com',
        pathname: '/media/**',
      },
    ],
  },
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true,
  },
  compress: true,
  productionBrowserSourceMaps: false,
};

export default nextConfig;
