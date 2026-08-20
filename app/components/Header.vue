<script setup lang="ts">
import ThemeToggle from "./ThemeToggle.vue";
import SocialLinks from "./SocialLinks.vue";
import Logo from "./Logo.vue";

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

const activeTab = defineModel<string>("activeTab", { default: "overview" });

defineProps<{
  profile: Profile;
  socialLinks: SocialLink[];
}>();

const navItems = [
  { id: "overview", label: "Overview", icon: "lucide:layout-dashboard" },
  { id: "projects", label: "Projects", icon: "lucide:code-2" },
  { id: "experience", label: "Experience", icon: "lucide:briefcase" },
  { id: "skills", label: "Skills", icon: "lucide:terminal" },
] as const;
</script>

<template>
  <header
    class="hidden lg:flex items-center justify-between px-6 py-3.5 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-black/80 backdrop-blur-xl sticky top-0 z-50">
    <div class="flex items-center gap-8">
      <Logo class="h-7 w-auto text-slate-900 dark:text-white" />

      <!-- Center navigation pill bar -->
      <nav class="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800">
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="activeTab = item.id"
          class="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all"
          :class="[
            activeTab === item.id
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          ]">
          <Icon :name="item.icon" class="w-3.5 h-3.5" />
          <span>{{ item.label }}</span>
        </button>
      </nav>
    </div>

    <div class="flex items-center gap-4">
      <SocialLinks :links="socialLinks.slice(0, 4)" />
      <div class="w-px h-6 bg-slate-200 dark:bg-slate-800"></div>
      <ThemeToggle />
    </div>
  </header>
</template>
