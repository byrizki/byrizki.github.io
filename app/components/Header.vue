<script setup lang="ts">
import ThemeToggle from "./ThemeToggle.vue";
import SocialLinks from "./SocialLinks.vue";
import Logo from "./Logo.vue";

// Components are auto-imported in Nuxt, but good to be explicit or rely on auto-import.
// Relying on auto-imports for components in Nuxt is standard.

interface Profile {
  name: string;
  [key: string]: any;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  display_order: number;
  created_at: string;
}

defineProps<{
  profile: Profile;
  socialLinks: SocialLink[];
}>();
</script>

<template>
  <header
    class="hidden lg:flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-black/80 backdrop-blur-xl sticky top-0 z-50">
    <div class="flex items-center gap-12">
      <Logo class="h-8 w-auto text-slate-900 dark:text-white" />
    </div>

    <div class="flex items-center gap-4">
      <SocialLinks :links="socialLinks.slice(0, 4)" />
      <div class="w-px h-6 bg-slate-200 dark:bg-slate-800"></div>
      <ThemeToggle />
    </div>
  </header>
</template>
