import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    "process.env": {}, // Prevents other process.env errors
    "process": { env: {} }, // Prevents process is not defined
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/main.tsx"),
      name: "SnowplowWidget",
      fileName: "vite-widget",
      formats: ["iife"],
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});