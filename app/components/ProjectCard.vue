<script setup lang="ts">
interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  project_type: string;
  technologies: string[];
  demo_url: string | null;
  github_url: string | null;
  playstore_url: string | null;
  appstore_url: string | null;
  featured: boolean;
  display_order: number;
  created_at: string;
}

defineProps<{
  project: Project;
}>();
</script>

<template>
  <div
    class="border border-slate-200 dark:border-slate-800 hover:border-emerald-500/30 dark:hover:border-emerald-400/30 rounded-lg overflow-hidden transition-all group bg-white dark:bg-transparent cursor-pointer hover:shadow-lg hover:shadow-emerald-500/5">
    <div v-if="project.image_url" class="relative h-32 bg-slate-200 dark:bg-slate-800">
      <img :src="project.image_url" :alt="project.title"
        class="w-full h-full object-cover object-top opacity-70 group-hover:opacity-100 transition-opacity" />
      <div
        class="absolute inset-0 bg-linear-to-t from-white/90 dark:from-slate-900 via-white/40 dark:via-slate-900/40 to-transparent">
      </div>
      <div class="absolute top-2 left-2">
        <span
          class="px-2 py-0.5 bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-emerald-500/30 dark:border-emerald-400/30 text-emerald-500 dark:text-emerald-400 text-xs font-mono rounded">
          {{ project.project_type }}
        </span>
      </div>
    </div>
    <div class="p-4">
      <h3
        class="font-bold mb-2 text-sm text-slate-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
        {{ project.title }}
      </h3>
      <p class="text-slate-500 dark:text-slate-400 text-xs mb-3 line-clamp-2">
        {{ project.description }}
      </p>
      <div class="flex flex-wrap gap-1.5">
        <span v-for="tech in project.technologies.slice(0, 3)" :key="tech"
          class="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono rounded border border-slate-300 dark:border-slate-700">
          {{ tech }}
        </span>
        <span v-if="project.technologies.length > 3"
          class="px-2 py-0.5 text-slate-400 dark:text-slate-500 text-xs font-mono">
          +{{ project.technologies.length - 3 }}
        </span>
      </div>
    </div>
  </div>
</template>
