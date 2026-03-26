import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isProd = mode === "production";

  return {
    base: "/",

    // ─── Dev Server ───────────────────────────────────────────────
    server: {
      host: "::",
      port: 8080,
      hmr: { overlay: false },
      proxy: {
        "/api": {
          target:
            env.VITE_API_URL ||
            "https://sipalaya-lms-professional-learning.onrender.com",
          changeOrigin: true,
          secure: false,
        },
      },
    },

    // ─── Preview Server ───────────────────────────────────────────
    preview: {
      port: 4173,
      host: true,
      strictPort: true,
    },

    // ─── Plugins ──────────────────────────────────────────────────
    plugins: [react()],

    // ─── Path Aliases ─────────────────────────────────────────────
    resolve: {
      alias: { "@": path.resolve(__dirname, "./src") },
    },

    // ─── Build ────────────────────────────────────────────────────
    build: {
      outDir: "dist",
      target: "es2020",
      sourcemap: !isProd,
      cssCodeSplit: true,
      chunkSizeWarningLimit: 2000,
      minify: isProd ? "terser" : false,

      terserOptions: isProd
        ? {
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ["console.log", "console.warn", "console.error"],
              passes: 2,           // extra compression pass
            },
            format: { comments: false },
          }
        : undefined,

      rollupOptions: {
        output: {
          chunkFileNames: "assets/[name]-[hash].js",
          entryFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash].[ext]",
          manualChunks: (id) => {
            // ── Granular vendor splitting via function form ──────
            if (id.includes("node_modules")) {
              if (id.includes("three") || id.includes("@react-three"))
                return "vendor-three";
              if (id.includes("framer-motion"))
                return "vendor-framer";
              if (id.includes("@reduxjs") || id.includes("react-redux"))
                return "vendor-redux";
              if (id.includes("@tanstack"))
                return "vendor-query";
              if (id.includes("react-hook-form") || id.includes("@hookform") || id.includes("zod"))
                return "vendor-forms";
              if (id.includes("@radix-ui"))
                return "vendor-radix";
              if (id.includes("react-dom") || id.includes("react-router"))
                return "vendor-react";
              if (id.includes("react"))
                return "vendor-react-core";
              return "vendor-misc";
            }
          },
        },
      },

      commonjsOptions: {
        transformMixedEsModules: true,
        include: [/node_modules/],
      },
    },

    // ─── CSS ──────────────────────────────────────────────────────
    css: {
      devSourcemap: !isProd,
    },

    // ─── Dep Optimization ─────────────────────────────────────────
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-router-dom",
        "@reduxjs/toolkit",
        "react-redux",
        "@tanstack/react-query",
        "framer-motion",
        "lucide-react",
        "three",
        "@react-three/fiber",
        "@react-three/drei",
      ],
      esbuildOptions: { target: "es2020" },
    },

    // ─── ESBuild ──────────────────────────────────────────────────
    esbuild: {
      drop: isProd ? ["console", "debugger"] : [],
      jsx: "automatic",
      target: "es2020",
    },

    // ─── Constants ────────────────────────────────────────────────
    define: {
      __APP_VERSION__: JSON.stringify(env.npm_package_version ?? "0.0.0"),
      __DEV__: !isProd,
    },

    // ─── Workers (Three.js) ───────────────────────────────────────
    worker: { format: "es" },

    envPrefix: "VITE_",
  };
});