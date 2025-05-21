import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    exclude: ["@electric-sql/pglite"],
  },
  build: {
    rollupOptions: {
      output: {
        format: "es",
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  worker: {
    format: "es",
  },
  server: {
    port: 3000,
    open: true,
  },
});
