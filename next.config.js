const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

const withPWA = require('next-pwa');

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
    })
);
