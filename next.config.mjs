/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.jp' // この行を追加
      },
      { 
        protocol: 'https',
        hostname: 'images.microcms-assets.io'
      }, // これを追加
    ],
  },
};

export default nextConfig;
