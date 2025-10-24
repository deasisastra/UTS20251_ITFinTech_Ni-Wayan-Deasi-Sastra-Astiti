/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["res.cloudinary.com"],
  },
  serverOptions: {
    port: parseInt(process.env.PORT, 10) || 3001
  },
};

module.exports = nextConfig;
