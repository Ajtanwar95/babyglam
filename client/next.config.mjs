/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dzhrggbgx/**", // optional: restrict to your cloud name
      },
      {
        protocol: "https",
        hostname: "babyglam.onrender.com", // if you serve images from backend too
      },
      // Add more hosts if needed (e.g. placeholder.com, unsplash.com, etc.)
    ],
  },

  // Optional: other useful settings you might already have
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
