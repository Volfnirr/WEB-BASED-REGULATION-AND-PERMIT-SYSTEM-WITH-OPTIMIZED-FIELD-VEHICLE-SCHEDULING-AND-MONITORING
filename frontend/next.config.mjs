/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ["192.168.100.210"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "whfmzqywnjcojotroaos.supabase.co",
        pathname: "/storage/v1/object/sign/**",
      },
    ],
  },
};

export default nextConfig;
