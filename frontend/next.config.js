/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },
  // 环境变量
  env: {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api/v1',
  },
}

module.exports = nextConfig
