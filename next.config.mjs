/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "free4kwallpapers.com",
      },
      {
        protocol: "https",
        hostname: "caliskanari.com",
      },
    ],
  },
};

export default nextConfig;
