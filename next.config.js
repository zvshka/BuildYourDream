const production = process.env.NODE_ENV === 'production';

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: !production,
});
module.exports = {
  ...withPWA(),
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
};
