import { docs } from "fumadocs-mdx:collections";
import { loader } from "fumadocs-core/source";

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
});
