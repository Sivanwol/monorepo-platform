import { fileURLToPath } from "url";
import createJiti from "jiti";

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
createJiti(fileURLToPath(import.meta.url))("./src/env");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@app/api",
    "@app/auth",
    "@app/db",
    "@app/ui",
    "@app/validators",
    "@app/utils",
  ],
  experimental: {
    // turbo: {
    //   resolveAlias: {
    //     'next-intl/config': './src/i18n.ts',
    //   },
    // },
    instrumentationHook: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default config;
