const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const withPWA = require('next-pwa');
const path = require('path');

module.exports = withPWA(
  withBundleAnalyzer({
    reactStrictMode: false,
    eslint: {
      ignoreDuringBuilds: true,
    },
    pwa: {
      dest: 'public',
      register: true,
      skipWaiting: true,
    },
    webpack(config, { dev, isServer }) {
      if (dev && !isServer) {
        const originalEntry = config.entry;
        config.entry = async () => {
          const wdrPath = path.resolve(__dirname, './scripts/wdyr.js');
          const entries = await originalEntry();

          if (entries['main.js'] && !entries['main.js'].includes(wdrPath)) {
            entries['main.js'].push(wdrPath);
          }
          return entries;
        };
      }

      return config;
    },
  })
);
