import type { NextConfig } from "next";
import path from "node:path"

const nextConfig: NextConfig = {
  transpilePackages: ["@flow/shared", "@flow/ui"],
  turbopack: {
    root: path.resolve(__dirname, "../../"),
  }
};

export default nextConfig;
