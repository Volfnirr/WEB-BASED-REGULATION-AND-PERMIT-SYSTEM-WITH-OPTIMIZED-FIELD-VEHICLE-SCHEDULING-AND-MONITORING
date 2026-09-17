/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // hostname: "whfmzqywnjcojotroaos.supabase.co", // Dev
        hostname: "iovpulxebuzrdihpzsrr.supabase.co", // prod
        pathname: "/storage/v1/object/sign/**",
      },
    ],
  },
};

export default nextConfig;
