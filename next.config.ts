import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Default is 1MB, too small for a resume PDF/DOCX upload.
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
