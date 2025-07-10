import baseConfig, { restrictEnvAccess } from "@squishmeist/eslint-config/base";
import nextjsConfig from "@squishmeist/eslint-config/nextjs";
import reactConfig from "@squishmeist/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
