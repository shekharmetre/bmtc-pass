import type { NextConfig } from "next";
import withPWA from '@ducanh2912/next-pwa';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // Add your existing Next.js config options here
};

const pwaConfig = withPWA({
  dest: 'public', // Destination directory for service worker and other PWA files
  register : true,
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development
  // // Other next-pwa options
  // // disable : false
})(nextConfig);

export default pwaConfig;