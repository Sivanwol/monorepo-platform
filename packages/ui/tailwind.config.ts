/*
 * This file is not used for any compilation purpose, it is only used
 * for Tailwind Intellisense & Autocompletion in the source files
 */
import type { Config } from "tailwindcss";

import baseConfig from "@app/tailwind-config/web";

const flowbite = require("flowbite-react/tailwind");

export default {
  content: ["./src/**/*.tsx", flowbite.content()],
  presets: [baseConfig],
  plugins: [
    // ...
    flowbite.plugin(),
  ],
} satisfies Config;
