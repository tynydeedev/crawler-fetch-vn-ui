import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  logLevel: "info",
  server: {
    port: Number(process.env.PORT) || 8080,
    host: true
  },
});
