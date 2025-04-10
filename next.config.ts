import type { NextConfig } from "next";
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

// Setup dev platform when in development mode
if (process.env.NODE_ENV === 'development') {
  try {
    setupDevPlatform();
  } catch (e) {
    console.error("Failed to setup dev platform:", e);
  }
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
