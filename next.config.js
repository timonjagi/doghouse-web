/** @type {import('next').NextConfig} */
const { withNextVideo } = require("next-video/process");

const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  eslint: {
    dirs: ["src"],
    ignoreDuringBuilds: true,
  },
  output: "standalone",
  experimental: {
    serverActions: true,
  },
};

module.exports = withNextVideo(nextConfig);