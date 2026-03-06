import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    chunkSizeWarningLimit: 1500,

    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          mui: ["@mui/material", "@mui/icons-material"],
          aggrid: ["ag-grid-react", "ag-grid-community"],
          utils: ["html2canvas", "dompurify"]
        }
      }
    }
  }
});