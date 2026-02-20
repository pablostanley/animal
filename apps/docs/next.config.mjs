import { createMDX } from "fumadocs-mdx/next";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const animalPkg = path.resolve(__dirname, "../../packages/animal");

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  transpilePackages: ["@vercel/animal"],
  webpack(config) {
    config.resolve.alias["@vercel/animal"] = path.join(
      animalPkg,
      "dist/index.js"
    );
    config.resolve.alias["@vercel/animal/react"] = path.join(
      animalPkg,
      "dist/react/index.js"
    );
    return config;
  },
  experimental: {
    turbo: {
      resolveAlias: {
        "@vercel/animal": path.join(animalPkg, "dist/index.js"),
        "@vercel/animal/react": path.join(animalPkg, "dist/react/index.js"),
      },
    },
  },
};

export default withMDX(config);
