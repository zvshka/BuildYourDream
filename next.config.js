const production = process.env.NODE_ENV === 'production';

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: false,
});
module.exports = {
  ...withPWA(),
  // distDir: './build',
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
};
