/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['localhost'], // Add your Django server domain here
    },
    // Optional: Add environmental optimizations
    experimental: {
      optimizeCss: true, // Enable CSS optimization
      optimizeServerReact: true, // Optimize React server components
    },
    // Enable compression (helps reduce energy usage)
    compress: true,
    // Enable production profiling for optimization
    productionBrowserSourceMaps: false, // Disable in production for better performance
}
  
export default nextConfig