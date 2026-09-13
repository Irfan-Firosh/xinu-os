import type { NextConfig } from "next";

/**
 * Static export keeps the site portable: the same build runs on Vercel,
 * GitHub Pages, Cloudflare Pages or any static host. BASE_PATH is only
 * needed when serving from a subdirectory (github.io/<repo>); a custom
 * domain or subdomain serves from the root and needs nothing.
 */
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
