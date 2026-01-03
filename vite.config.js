import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",

      // Cache core assets
      includeAssets: [
        "favicon.svg",
        "pwa-192.png",
        "pwa-512.png"
      ],

      manifest: {
        name: "SoundNest",
        short_name: "SoundNest",
        description: "Modern music streaming experience",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#000000",
        theme_color: "#22c55e",

        icons: [
          {
            src: "/pwa-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/pwa-512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "/pwa-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      }
    })
  ],

  build: {
    sourcemap: false, // 🔒 production safe
    outDir: "dist"
  }
});
