/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "older.yesmore.workers.dev",
      "replicate.delivery",
      "i.postimg.cc",
    ],
  },
  async redirects() {
    return [
      {
        source: "/launch",
        destination: "https://yesmore.cc",
        permanent: false,
      },
      {
        source: "/github",
        destination: "https://github.com/gcloudlab/older",
        permanent: false,
      },
      {
        source: "/p",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
