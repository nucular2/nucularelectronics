import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import obfuscator from "vite-plugin-javascript-obfuscator";

export default defineConfig({
  plugins: [
    react(),
    obfuscator({
      options: {
        compact: true,
        controlFlowFlattening: true,
        deadCodeInjection: true,
        stringArray: true,
        stringArrayThreshold: 0.75
      }
    })
  ],
  build: {
    minify: "esbuild",
    sourcemap: false,
    cssMinify: true
  }
});
