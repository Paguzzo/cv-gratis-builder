import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import removeConsole from "vite-plugin-remove-console";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        configure: (proxy, options) => {
          // Middleware para simular API endpoint
          proxy.on('error', (err, req, res) => {
            console.log('proxy error', err);
            if (req.url === '/api/send-email') {
              // Fallback para quando não tiver servidor backend
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                success: false,
                error: 'Endpoint não implementado ainda. Use MCP Email Sending.'
              }));
            }
          });
        }
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    mode === 'production' && removeConsole(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Source maps para debug em produção
    sourcemap: false,
    // Target moderno para otimizações
    target: 'es2020',
    // Minificação otimizada
    minify: 'esbuild',
    // CSS code splitting
    cssCodeSplit: true,
    // Limite de warning para chunks
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Nomes de arquivo com hash para cache busting
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  // Otimizações de dependências
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['lovable-tagger']
  }
}));
