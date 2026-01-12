/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    domains: ["github.com", "avatars.githubusercontent.com"], 
  },

  // Enable MDX using MDX-RS (native compiler)
  experimental: {
    mdxRs: true,
  },

  // Allow MDX as a page/module import
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
};

export default nextConfig;
