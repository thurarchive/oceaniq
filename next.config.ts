import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    qualities: [75, 85],
  },
  outputFileTracingIncludes: {
    "/api/predict": ["./src/data/xgboost_tuned_model.json"],
  },
};

export default nextConfig;