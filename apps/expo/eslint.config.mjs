import baseConfig from "@squishmeist/eslint-config/base";
import reactConfig from "@squishmeist/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".expo/**", "expo-plugins/**"],
  },
  ...baseConfig,
  ...reactConfig,
];
