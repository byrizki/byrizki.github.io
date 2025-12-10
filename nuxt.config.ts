// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  srcDir: "app",
  css: ["~/assets/css/main.css"],
  modules: ["@vite-pwa/nuxt", "@nuxt/icon"],
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: [".refind.id"],
    },
  },
  nitro: {
    prerender: {
      autoSubfolderIndex: false,
    },
  },
  app: {
    head: {
      title: "Muhamad Rizki - Experienced Software Engineer",
      viewport:
        "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
      charset: "utf-8",
      htmlAttrs: {
        lang: "en",
        class: "dark",
      },
    },
  },
  pwa: {
    manifest: {
      name: "Rizki - Experienced Software Engineer",
      short_name: "Rizki",
      description:
        "Personal portfolio of Rizki, an Experienced Software Engineer.",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#ffffff",
      orientation: "portrait-primary",
      icons: [
        {
          src: "/favicon.svg",
          sizes: "any",
          type: "image/svg+xml",
          purpose: "any",
        },
        {
          src: "/icon-192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "/icon-512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
      categories: ["productivity", "portfolio", "development"],
      lang: "en",
      dir: "ltr",
    },
    workbox: {
      navigateFallback: "/",
      globPatterns: ["**/*.{js,css,html,ico,png,svg,json}"],
      globIgnores: ["**/node_modules/**/*", "_nuxt/builds/**/*.json"],
    },
    devOptions: {
      enabled: true,
      type: "module",
    },
  },
});
