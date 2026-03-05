import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Redirige peticiones /api al servidor PHP local (puerto 8080)
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
