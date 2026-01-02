import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Docker + Windows でのホットリロード対応（Turbopack）
  // 空のturbopack設定で警告を抑制し、環境変数で制御
  turbopack: {},
};

export default nextConfig;
