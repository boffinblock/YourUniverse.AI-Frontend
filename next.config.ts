/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "youruniverse-assets-prod.s3.us-east-1.amazonaws.com",
        pathname: "/**",
      },
      // Allow other S3 buckets/regions (e.g. CDN, different regions)
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
        pathname: "/**",
      },
    ],
    // Fallback for Next.js < 14
    domains: [
      "github.com",
      "avatars.githubusercontent.com",
      "youruniverse-assets-prod.s3.us-east-1.amazonaws.com",
    ],
  },

  // Enable MDX using MDX-RS (native compiler)
  experimental: {
    mdxRs: true,
  },

  // Allow MDX as a page/module import
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
};

export default nextConfig;
