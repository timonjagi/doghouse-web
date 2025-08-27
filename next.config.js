/** @type {import('next').NextConfig} */
const { withNextVideo } = require("next-video/process");

const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  eslint: {
    dirs: ["src"],
  },
};

module.exports = withNextVideo(nextConfig);