const production = process.env.NODE_ENV === 'production';
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: !production,
});

module.exports = {
  ...withPWA(),
  ...withBundleAnalyzer(),
  swcMinify: true,
  reactStrictMode: !production,
  eslint: {
    ignoreDuringBuilds: true,
  },
};
