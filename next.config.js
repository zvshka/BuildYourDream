// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// });

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  publicExcludes: ['!uploads/*.*'],
});

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  swcMinify: true,
  reactStrictMode: process.env.NODE_ENV === 'development',
  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {
    emotion: true,
  },
  compress: true,
};

const config = withPWA(nextConfig);

module.exports = config;
