import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/about", destination: "/" },
      { source: "/services", destination: "/" },
      { source: "/skills", destination: "/" },
      { source: "/contact", destination: "/" },
      { source: "/despre", destination: "/" },
      { source: "/servicii", destination: "/" },
      { source: "/abilitati", destination: "/" },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
