import { resolve } from "node:path";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [reactRouter(), tailwindcss()],
  resolve: {
    tsconfigPaths: true,
    alias: {
      "@/": `${resolve(__dirname, "src")}/`,
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/trpc": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
      "/upload": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
});
