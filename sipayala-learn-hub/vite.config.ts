import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// import { componentTagger } from "sipalaya-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Base path for deployment
  base: '/',
  
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false, // Disable error overlay to avoid console spam
    },
    // Add proxy for API requests in development
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'https://sipalaya-lms-professional-learning.onrender.com',
        changeOrigin: true,
        secure: false,
        // Remove double slashes
        rewrite: (path) => path.replace(/^\/api/, '/api'),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to:', req.url);
          });
        },
      },
    },
  },
  
  // Plugins configuration
  plugins: [
    react({
      // Enable Fast Refresh for better development experience
      fastRefresh: true,
    }),
    // Uncomment if you need the component tagger in development
    // mode === "development" && componentTagger()
  ].filter(Boolean),
  
  // Path resolution
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: mode === 'development', // Only generate sourcemaps in development
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
        pure_funcs: mode === 'production' ? ['console.log', 'console.error', 'console.warn'] : [],
      },
    },
    // Rollup options for better chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            'framer-motion'
          ],
          'chart-vendor': ['recharts', 'three', '@react-three/fiber', '@react-three/drei'],
          'state-vendor': ['@reduxjs/toolkit', 'react-redux', '@tanstack/react-query'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
        },
        // Ensure consistent chunk naming
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Target modern browsers
    target: 'es2020',
    // Enable CSS code splitting
    cssCodeSplit: true,
  },
  
  // CSS configuration
  css: {
    devSourcemap: mode === 'development',
    preprocessorOptions: {
      // Add any CSS preprocessor options if needed
    },
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@reduxjs/toolkit',
      'react-redux',
      '@tanstack/react-query',
      'framer-motion',
      'lucide-react',
    ],
    exclude: [],
  },
  
  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __DEV__: mode === 'development',
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
  
  // Environment variables prefix
  envPrefix: 'VITE_',
  
  // Preview server configuration (for production preview)
  preview: {
    port: 4173,
    host: true,
    strictPort: true,
  },
  
  // Enable experimental features if needed
  esbuild: {
    // Remove console logs in production
    drop: mode === 'production' ? ['console', 'debugger'] : [],
    // Enable JSX improvements
    jsx: 'automatic',
  },
}));