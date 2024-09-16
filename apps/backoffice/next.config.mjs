import path from "path";
import { fileURLToPath } from "url";
import createJiti from "jiti";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds and Linting.
 */
console.log("process.env.SKIP_ENV_VALIDATION", process.env.SKIP_ENV_VALIDATION);
console.log("process.env.NODE_ENV", process.env.NODE_ENV);
console.log("pwd", process.cwd());

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
!process.env.SKIP_ENV_VALIDATION &&
  createJiti(fileURLToPath(import.meta.url))("./src/env");
/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        os: false,
        path: false,
      };
    }
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },

  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@app/platform-api",
    "@app/backoffice-api",
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

    esmExternals: true,
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

  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // output: "standalone",
};

// export default withTm(config);
export default config;
