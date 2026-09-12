/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [{ source: "/discover", destination: "/Discover" }];
  },
};

export default nextConfig;
