import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // REACT CORE - SIEMPRE CARGA PRIMERO
          'react-vendor': ['react', 'react-dom'],
          // UI Components - se cargan cuando se necesitan
          'ui-components': [
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
            '@radix-ui/react-tooltip',
            'vaul',
            'sonner'
          ],
          // Forms - se cargan en páginas con formularios
          'forms': [
            'react-hook-form',
            '@hookform/resolvers',
            'zod',
            'react-number-format'
          ],
          // Tables - se cargan en páginas con tablas
          'tables': ['@tanstack/react-table'],
          // Routing - siempre necesario
          'routing': ['react-router'],
          // Utilities - siempre necesarias
          'utils': [
            'clsx',
            'class-variance-authority',
            'tailwind-merge',
            'lucide-react',
            'next-themes'
          ]
        }
      }
    },
    // CONFIGURACIONES ADICIONALES DE BUILD
    chunkSizeWarningLimit: 1000, // 1MB
    sourcemap: false, // Desactivar en produccion
    minify: 'terser', // Mejorar Minificacion
    terserOptions: {
      compress: {
        drop_console: true, // Eliminar console.log en produccion
        drop_debugger: true,
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
