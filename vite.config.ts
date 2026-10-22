import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        'html2canvas': 'html2canvas-pro',
      },
    },
    build: {
      target: 'es2020',
      minify: 'esbuild',
      sourcemap: false,
      cssCodeSplit: true,
      modulePreload: {
        resolveDependencies(url, deps) {
          return deps.filter(
            (dep) =>
              !dep.includes('vendor-firebase') &&
              !dep.includes('vendor-jspdf') &&
              !dep.includes('vendor-html2canvas')
          );
        }
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('jspdf')) {
                return 'vendor-jspdf';
              }
              if (id.includes('html2canvas') || id.includes('canvg')) {
                return 'vendor-html2canvas';
              }
              if (id.includes('firebase')) {
                return 'vendor-firebase';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              if (id.includes('react-router') || id.includes('react-dom') || id.includes('react/')) {
                return 'vendor-react-core';
              }
            }
            if (id.includes('/src/components/ui/')) {
              return 'vendor-ui';
            }
          }
        }
      },
      chunkSizeWarningLimit: 800,
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
