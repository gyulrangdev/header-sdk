import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "JKHeaderSDK",
      formats: ["es", "iife"],
      fileName: (format) => {
        const suffix = format === "es" ? "es" : "iife";
        return `header-sdk.${suffix}.js`;
      },
    },
    rollupOptions: {
      // Bundle all deps (no externals) for simpler CDN usage
      external: [],
      output: {
        inlineDynamicImports: false,
      },
    },
    target: "es2020",
    sourcemap: true,
  },
  server: {
    port: 5173,
    open: true,
  },
});
