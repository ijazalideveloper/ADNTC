import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "no-var": "off",
      "@typescript-eslint/no-explicit-any": "off", // Turn off the no-explicit-any rule
      "prefer-const": "off", // Turn off the prefer-const rule
      "@typescript-eslint/no-unused-vars": "off",
      "react/no-unescaped-entities": [
        "error",
        {
          forbid: [">", "}"], // Only forbid > and }, allow "
        },
      ],
    },
  },
];

export default eslintConfig;
