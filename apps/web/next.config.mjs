/** @type {import('next').NextConfig} */

const repoName = "semreg-playground";
const isProd = process.env.NODE_ENV === "production";

const actualBasePath = `/${repoName}`;

console.log(
  `Build Info: ${process.env.NODE_ENV}, Applying Prefixes=${isProd}, BasePath=${isProd ? actualBasePath : "none"}`
);

console.log(
  "Build Config - NEXT_PUBLIC_BASE_PATH:",
  process.env.NEXT_PUBLIC_BASE_PATH
);

const nextConfig = {
  output: "export",
  transpilePackages: ["@workspace/ui"],
  basePath: isProd ? actualBasePath : undefined,
  assetPrefix: isProd ? `${actualBasePath}/` : undefined,
};

export default nextConfig;
