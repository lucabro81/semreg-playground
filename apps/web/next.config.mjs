/** @type {import('next').NextConfig} */

const isProduction = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  transpilePackages: ["@workspace/ui"],
  assetPrefix: isProduction ? "/semreg-playground/" : undefined,
  basePath: isProduction ? "/semreg-playground" : undefined,
};

export default nextConfig;
