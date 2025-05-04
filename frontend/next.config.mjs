/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true,
  },
  compress: true,
  productionBrowserSourceMaps: false,
};

export default nextConfig;
