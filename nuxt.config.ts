// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

const SUB_PROJECTS = ["jsoneval-rs", "rusto-rs"];

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },
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
      title: "Muhamad Rizki - Tech Geek, Open Source Enthusiasts",
      viewport:
        "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
      charset: "utf-8",
      htmlAttrs: {
        lang: "en",
      },
      script: [
        {
          innerHTML: `(function(){try{const s=localStorage.getItem('theme');if(s==='light'||(!s&&window.matchMedia('(prefers-color-scheme: light)').matches)){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){}})()`,
        },
      ],
    },
  },
  pwa: {
    manifest: {
      name: "Rizki - Tech Geek, Open Source Enthusiasts",
      short_name: "Rizki",
      description:
        "Personal portfolio of Rizki, Tech Geek, Open Source Enthusiasts.",
      scope: "/",
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
      navigateFallbackDenylist: SUB_PROJECTS.map(
        (slug) => new RegExp(`^/${slug}($|/)`),
      ),
      runtimeCaching: [
        {
          urlPattern: new RegExp(`^/(${SUB_PROJECTS.join("|")})/.*`),
          handler: "NetworkOnly",
        },
      ],
      globPatterns: ["**/*.{js,css,html,ico,png,svg,json}"],
      globIgnores: ["**/node_modules/**/*", "_nuxt/builds/**/*.json"],
    },
    devOptions: {
      enabled: false,
      type: "module",
    },
  },
});
