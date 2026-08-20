<script setup lang="ts">
import { useGithubData } from "~/composables/useGithubData";

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

const props = defineProps<{
  project: Project;
}>();

const emit = defineEmits<{
  (e: "open"): void;
}>();

const { getRepoStars, getRepoForks } = useGithubData();
const starCount = computed(() => getRepoStars(props.project.github_url));
const forkCount = computed(() => getRepoForks(props.project.github_url));

const categoryColor = computed(() => {
  const type = props.project.project_type.toLowerCase();
  if (type.includes("mobile")) {
    return {
      bg: "bg-purple-50 dark:bg-purple-950/80",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-200/80 dark:border-purple-800/60",
    };
  }
  if (type.includes("web")) {
    return {
      bg: "bg-blue-50 dark:bg-blue-950/80",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200/80 dark:border-blue-800/60",
    };
  }
  return {
    bg: "bg-emerald-50 dark:bg-emerald-950/80",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200/80 dark:border-emerald-800/60",
  };
});
</script>

<template>
  <div
    class="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 cursor-pointer"
    @click="emit('open')">
    
    <!-- Card Image Header -->
    <div class="relative w-full aspect-video sm:h-44 bg-slate-100 dark:bg-slate-800/80 overflow-hidden shrink-0">
      <img
        v-if="project.image_url"
        :src="project.image_url"
        :alt="project.title"
        class="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-600">
        <Icon name="lucide:image" class="w-8 h-8 opacity-40" />
      </div>

      <!-- Linear Gradient Overlay -->
      <div
        class="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20 pointer-events-none"
      />

      <!-- Top Badges Row -->
      <div class="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 pointer-events-none">
        <!-- Category Pill -->
        <span
          class="px-2.5 py-1 rounded-md text-[10.5px] font-mono font-medium backdrop-blur-md border shadow-xs"
          :class="[categoryColor.bg, categoryColor.text, categoryColor.border]">
          {{ project.project_type }}
        </span>

        <div class="flex items-center gap-1.5">
          <!-- GitHub Stars & Forks Badge -->
          <span
            v-if="project.github_url && (starCount !== null || forkCount !== null)"
            class="px-2 py-0.5 rounded-md text-[10.5px] font-mono font-semibold bg-black/60 text-amber-300 border border-amber-500/40 backdrop-blur-md flex items-center gap-1.5 shadow-xs"
            title="GitHub Stars & Forks">
            <span v-if="starCount !== null" class="flex items-center gap-0.5">
              <Icon name="lucide:star" class="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{{ starCount }}</span>
            </span>
            <span v-if="forkCount !== null && forkCount > 0" class="flex items-center gap-0.5 text-slate-300">
              <Icon name="lucide:git-fork" class="w-3 h-3 text-slate-400" />
              <span>{{ forkCount }}</span>
            </span>
          </span>

          <!-- Featured Badge -->
          <span
            v-if="project.featured"
            class="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-amber-500/90 text-white backdrop-blur-md flex items-center gap-1 shadow-xs">
            <Icon name="lucide:star" class="w-3 h-3 fill-white" />
            <span>Featured</span>
          </span>
        </div>
      </div>

      <!-- Quick External Links (clickable without opening dialog) -->
      <div
        class="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity"
        @click.stop>
        <a
          v-if="project.demo_url"
          :href="project.demo_url"
          target="_blank"
          rel="noopener noreferrer"
          class="w-7 h-7 rounded-lg bg-black/60 hover:bg-emerald-600 text-white backdrop-blur-md flex items-center justify-center transition-colors shadow-xs"
          title="Live Demo">
          <Icon name="lucide:globe" class="w-3.5 h-3.5" />
        </a>
        <a
          v-if="project.github_url"
          :href="project.github_url"
          target="_blank"
          rel="noopener noreferrer"
          class="w-7 h-7 rounded-lg bg-black/60 hover:bg-slate-800 text-white backdrop-blur-md flex items-center justify-center transition-colors shadow-xs"
          :title="`GitHub Repository (${starCount ?? 0} stars, ${forkCount ?? 0} forks)`">
          <Icon name="lucide:github" class="w-3.5 h-3.5" />
        </a>
        <a
          v-if="project.playstore_url"
          :href="project.playstore_url"
          target="_blank"
          rel="noopener noreferrer"
          class="w-7 h-7 rounded-lg bg-black/60 hover:bg-emerald-600 text-white backdrop-blur-md flex items-center justify-center transition-colors shadow-xs"
          title="Google Play Store">
          <Icon name="logos:google-play-icon" class="w-3.5 h-3.5" />
        </a>
        <a
          v-if="project.appstore_url"
          :href="project.appstore_url"
          target="_blank"
          rel="noopener noreferrer"
          class="w-7 h-7 rounded-lg bg-black/60 hover:bg-blue-600 text-white backdrop-blur-md flex items-center justify-center transition-colors shadow-xs"
          title="Apple App Store">
          <Icon name="logos:apple-app-store" class="w-3.5 h-3.5 invert" />
        </a>
      </div>
    </div>

    <!-- Card Body -->
    <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
      <div>
        <div class="flex items-start justify-between gap-2">
          <h3
            class="font-bold text-base text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-snug line-clamp-1">
            {{ project.title }}
          </h3>
          <Icon
            name="lucide:arrow-up-right"
            class="w-4 h-4 text-slate-400 group-hover:text-teal-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-0.5"
          />
        </div>

        <p class="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
          {{ project.description }}
        </p>
      </div>

      <!-- Tech Stack Pills & Footer -->
      <div class="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2">
        <div class="flex flex-wrap items-center gap-1.5 min-w-0">
          <span
            v-for="tech in project.technologies.slice(0, 3)"
            :key="tech"
            class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-[11px] font-mono text-slate-600 dark:text-slate-300 truncate">
            {{ tech }}
          </span>
          <span
            v-if="project.technologies.length > 3"
            class="text-[10px] font-mono text-slate-400 dark:text-slate-500">
            +{{ project.technologies.length - 3 }}
          </span>
        </div>

        <span class="text-xs font-semibold text-teal-600 dark:text-teal-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">
          Details &rarr;
        </span>
      </div>
    </div>
  </div>
</template>
