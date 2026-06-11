import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    // Destructuring a prop out so it is NOT spread onto a DOM element
    // (e.g. react-markdown's `({ node, ...props })`) is intentional
    // omission, not an unused variable.
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { ignoreRestSiblings: true, argsIgnorePattern: "^_" },
      ],
    },
  },
  {
    // react-three-fiber's documented idiom is mutating three.js objects
    // (camera position, material uniforms, canvas style) inside
    // useFrame/effects. The immutability rule assumes hook-returned values
    // are React-managed state and misfires on every scene component.
    files: [
      "src/components/demos/**",
      "src/components/HeroScene.tsx",
      "src/components/ShaderBanner.tsx",
      "src/components/Background.tsx",
    ],
    rules: {
      "react-hooks/immutability": "off",
    },
  },
];

export default eslintConfig;
