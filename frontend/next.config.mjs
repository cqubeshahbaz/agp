/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🔧 FIX: Cross-origin warning (DEV only)
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://192.168.1.7:3000', // tumhara LAN IP
  ],

  images: {
    unoptimized: true,
    minimumCacheTTL: 16070400, // 6 months

    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '1337',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig