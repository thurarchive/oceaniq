import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    qualities: [75, 85],
  },
  outputFileTracingIncludes: {
    "/api/predict": ["./node_modules/onnxruntime-web/dist/*.wasm"],
  },
};

export default nextConfig;