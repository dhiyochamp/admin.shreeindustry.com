/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com", "lzfofbgtvwpefsjvgysj.supabase.co"], // Add Supabase storage domain
    minimumCacheTTL: 2592000,
    unoptimized: true,
  },
};

export default nextConfig;
