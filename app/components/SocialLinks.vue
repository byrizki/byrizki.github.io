<script setup lang="ts">


/* Define Types locally or import if shared */
interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  display_order: number;
  created_at: string;
}

const props = withDefaults(
  defineProps<{
    links: SocialLink[];
    mode?: "row" | "grid";
  }>(),
  {
    mode: "row",
  }
);

const iconMap: Record<string, string> = {
  github: "lucide:github",
  linkedin: "lucide:linkedin",
  twitter: "simple-icons:x",
  x: "simple-icons:x",
  mail: "lucide:mail",
  link: "lucide:link",
  discord: "simple-icons:discord",
  telegram: "simple-icons:telegram",
  whatsapp: "simple-icons:whatsapp",
};
</script>

<template>
  <div v-if="mode === 'row'" class="flex items-center gap-1.5 sm:gap-2 shrink-0">
    <a v-for="link in links" :key="link.id" :href="link.url" target="_blank" rel="noopener noreferrer"
      class="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-400/50 flex items-center justify-center transition-all bg-white dark:bg-slate-900 hover:bg-emerald-500/5 dark:hover:bg-emerald-400/5 group"
      :title="link.platform">
      <Icon :name="iconMap[link.icon] || 'lucide:link'"
        class="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors" />
    </a>
  </div>

  <div v-else class="grid grid-cols-2 gap-3">
    <a v-for="link in links" :key="link.id" :href="link.url" target="_blank" rel="noopener noreferrer"
      class="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-400/50 rounded-lg bg-slate-100 dark:bg-black/30 hover:bg-emerald-500/5 dark:hover:bg-emerald-400/5 transition-all group">
      <Icon :name="iconMap[link.icon] || 'lucide:link'"
        class="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors" />
      <div class="flex-1 min-w-0">
        <span
          class="text-xs font-mono text-slate-700 dark:text-slate-300 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors truncate block">
          {{ link.platform }}
        </span>
      </div>
      <Icon name="lucide:external-link"
        class="w-3 h-3 text-slate-400 dark:text-slate-600 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors" />
    </a>
  </div>
</template>
