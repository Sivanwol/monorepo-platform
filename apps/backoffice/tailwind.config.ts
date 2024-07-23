import type { Config } from "tailwindcss";
import flowbite from "flowbite-react/tailwind";
import { fontFamily } from "tailwindcss/defaultTheme";

import baseConfig from "@app/tailwind-config/web";

export default {
  // We need to append the path to the UI package to the content array so that
  // those classes are included correctly.
  content: [
    ...baseConfig.content,
    flowbite.content(),
    "../../packages/ui/**/*.{ts,tsx}",
  ],
  presets: [baseConfig],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        mono: ["var(--font-geist-mono)", ...fontFamily.mono],
      },
    },
  },
  plugins: [
    flowbite.plugin(),
    require("tailwindcss-animate"),
    // require("./plugins/tailwind/softShadow"),
  ],
} satisfies Config;
