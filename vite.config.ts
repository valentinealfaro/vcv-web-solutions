import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const isProd = mode === 'production';

  return {
    plugins: [react(), tailwindcss()],

    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },

    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },

    // Strip console/debugger in production builds
    esbuild: isProd ? { drop: ['console', 'debugger'] } : {},

    build: {
      target: 'esnext',
      cssCodeSplit: true,
      // Inline assets smaller than 4 KB as base64 (fewer requests)
      assetsInlineLimit: 4096,
      // Skip the gzip size report to make builds faster
      reportCompressedSize: false,

      rollupOptions: {
        output: {
          manualChunks(id) {
            // Core React runtime — tiny, loads first
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router-dom/')) {
              return 'vendor-react';
            }
            // Animation library
            if (id.includes('node_modules/motion')) {
              return 'vendor-motion';
            }
            // Firebase — only needed when user interacts with forms
            if (id.includes('node_modules/firebase/')) {
              return 'vendor-firebase';
            }
            // Lucide icons are large; split them so they can be cached separately
            if (id.includes('node_modules/lucide-react')) {
              return 'vendor-lucide';
            }
            // Radix UI primitives
            if (id.includes('node_modules/@radix-ui')) {
              return 'vendor-radix';
            }
            // Stripe — only loaded on checkout pages
            if (id.includes('node_modules/@stripe') || id.includes('node_modules/stripe')) {
              return 'vendor-stripe';
            }
          },
        },
      },
    },
  };
});
