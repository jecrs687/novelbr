import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "saikaiscan.com.br",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "images.alphacoders.com",
      },
      {
        protocol: "https",
        hostname: "images3.alphacoders.com",
      },
      {
        protocol: "https",
        hostname: "images4.alphacoders.com",
      },
      {
        protocol: "https",
        hostname: "images6.alphacoders.com",
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
      {
        protocol: "http",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "meuprojetoparalelo.com.br",
      },
    ],
  },
};

export default nextConfig;
