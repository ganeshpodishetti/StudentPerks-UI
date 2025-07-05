import tailwindcss from "@tailwindcss/vite";
import react from '@vitejs/plugin-react';
import path from 'path';
import process from "process";
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiUrl =
    env.VITE_API_URL;

  return {
    plugins: [react(), tailwindcss()],
    
    // Security and build optimizations
    build: {
      // Remove console statements in production
      minify: mode === 'production' ? 'terser' : false,
      terserOptions: mode === 'production' ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      } : undefined,
      
      // Security - hide source maps in production
      sourcemap: mode !== 'production',
      
      // Optimize chunk splitting
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-popover', 'lucide-react'],
          },
        },
      },
    },
    
    server: {
      proxy: {
        "/api": {
          target: apiUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    
    // Prevent exposing sensitive environment variables
    define: {
      // Only expose VITE_ prefixed variables
      __DEV__: mode === 'development',
    },
  };
});
