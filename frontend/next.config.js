/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Proxy /api/* to the Express backend so the browser stays same-origin (no CORS in dev).
  // Set BACKEND_URL if the API is not on http://127.0.0.1:5000
  async rewrites() {
    const backend = process.env.BACKEND_URL || 'http://127.0.0.1:5000';
    return [
      {
        source: '/api/:path*',
        destination: `${backend}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
