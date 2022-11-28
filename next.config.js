const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const production = process.env.NODE_ENV === 'production';

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: !production,
});

module.exports = async (phase, { defaultConfig }) => {
  return withPWA(
    withBundleAnalyzer({
      ...defaultConfig,
      reactStrictMode: false,
      eslint: {
        ignoreDuringBuilds: true,
      },
    })
  );
};
