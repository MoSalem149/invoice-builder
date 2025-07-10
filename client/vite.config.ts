import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  // Example additions:
  server: {
    port: 3000, // Custom dev server port
    // open: true, // Auto-open browser
  },
});
