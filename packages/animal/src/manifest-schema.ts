export const ANIMAL_MANIFEST_SCHEMA = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "AnimalManifest",
  type: "object",
  required: ["schemaVersion", "name", "reactEntry", "tokens", "presets"],
  properties: {
    schemaVersion: { type: "integer", const: 1 },
    name: { type: "string" },
    reactEntry: { type: "string" },
    tokens: {
      type: "array",
      items: {
        type: "object",
        required: ["token", "description", "examples"],
        properties: {
          token: { type: "string" },
          description: { type: "string" },
          examples: { type: "array", items: { type: "string" } },
        },
      },
    },
    presets: {
      type: "array",
      items: {
        type: "object",
        required: ["phase", "name", "description", "tokens", "params", "defaults", "affects", "codeExample"],
        properties: {
          phase: { type: "string", enum: ["enter", "exit", "hover", "press", "focus"] },
          name: { type: "string" },
          description: { type: "string" },
          tokens: { type: "array", items: { type: "string" } },
          params: { type: "object" },
          defaults: {
            type: "object",
            properties: {
              durationMs: { type: "number" },
              delayMs: { type: "number" },
              easing: { type: "string" },
            },
          },
          affects: { type: "array", items: { type: "string", enum: ["transform", "opacity"] } },
          codeExample: { type: "string" },
        },
      },
    },
  },
} as const;
