/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "avatar.tobi.sh",
      "older.yesmore.workers.dev",
      "cloudflare-ipfs.com",
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
        destination: "https://github.com/gcloudlab/aging",
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
