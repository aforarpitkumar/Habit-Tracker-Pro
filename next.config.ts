import type { NextConfig } from "next";
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  experimental: {
    webpackBuildWorker: true,
  },
};

const withPWAConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https?.*/, 
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
        networkTimeoutSeconds: 10,
      },
    },
  ],
  buildExcludes: [/middleware-manifest\.json$/],
  fallbacks: {
    document: '/offline',
  },
});

export default withPWAConfig(nextConfig);
