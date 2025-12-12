import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    serverExternalPackages: [
    '@walletconnect/logger',
    '@lit-protocol/lit-node-client',
    '@lit-protocol/auth-browser',
    'pino',
    'thread-stream',
  ],
};

export default nextConfig;
