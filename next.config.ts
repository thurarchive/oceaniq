import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    qualities: [75, 85],
  },
  serverExternalPackages: ["onnxruntime-node"],
};

export default nextConfig;