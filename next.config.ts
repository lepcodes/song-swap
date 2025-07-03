// import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        pathname: '/image/**', // Match all Spotify image paths
      },
      {
        protocol: 'https',
        hostname: 'mosaic.scdn.co',
        pathname: '/**', // Match all Spotify image paths
      },
      {
        protocol: 'https',
        hostname: 'image-cdn-fa.spotifycdn.com',
        pathname: '/**', // Match all Spotify image paths
      },
      {
        protocol: 'https',
        hostname: 'image-cdn-ak.spotifycdn.com',
        pathname: '/**', // Match all Spotify image paths
      },
    ],
  },
};

module.exports = nextConfig;
