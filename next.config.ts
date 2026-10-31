import type { NextConfig } from "next";

// Next.js 16 blocks dev-only JavaScript/HMR resources on LAN origins unless
// explicitly permitted. Opt in only for our isolated iPhone minigolf lab.
// Never loosen the production origin policy or allow arbitrary LAN clients.
const minigolfLanHost = process.env.SYSSELCRAFT_MINIGOLF_LAN_HOST?.trim();
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  ...(process.env.NODE_ENV === "development" && minigolfLanHost
    ? { allowedDevOrigins: ["localhost", "127.0.0.1", minigolfLanHost] } : {}),
};

export default nextConfig;
