import { defineConfig } from "tsup";

const shared = {
  format: ["esm", "cjs"],
  sourcemap: true,
  target: "es2022",
  treeshake: true,
  splitting: true,
  external: ["react", "react-dom"],
} as const;

export default [
  defineConfig({
    ...shared,
    clean: true,
    dts: true,
    entry: { index: "src/index.ts" },
    outDir: "dist",
  }),
  defineConfig({
    ...shared,
    clean: false,
    dts: true,
    entry: { index: "src/react/index.tsx" },
    outDir: "dist/react",
  }),
];
