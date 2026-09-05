import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080,
    proxy: {
      '/api-sarvam': {
        target: 'https://api.sarvam.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-sarvam/, ''),
        secure: true,
      },
      '/api-bhashini': {
        target: 'https://dhruva-api.bhashini.gov.in',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-bhashini/, ''),
        secure: false,
      },
      '/api-translate': {
        target: 'https://libretranslate.de',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-translate/, ''),
        secure: true,
      },
      '/api-translate-mirror': {
        target: 'https://translate.terraprint.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-translate-mirror/, ''),
        secure: true,
      }
    }
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  optimizeDeps: {
    exclude: ['lucide-react'], // Force exclusion to avoid "file does not exist" errors in Vites's optimize directory
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
