<script setup lang="ts">
import { ref, computed } from "vue";
import ProjectCard from "./ProjectCard.vue";
import ProjectDetailDialog from "./ProjectDetailDialog.vue";


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
  projects: Project[];
}>();

const selectedCategory = ref("All");
const selectedProject = ref<Project | null>(null);
const isDialogOpen = ref(false);

const filteredProjects = computed(() =>
  selectedCategory.value === "All"
    ? props.projects
    : props.projects.filter((p) => p.project_type.toLowerCase() === selectedCategory.value.toLowerCase())
);

const openProjectDialog = (project: Project) => {
  selectedProject.value = project;
  isDialogOpen.value = true;
};
</script>

<template>
  <div
    class="lg:border lg:border-slate-200 lg:dark:border-slate-800 lg:rounded-2xl p-0 lg:p-4 lg:bg-white lg:dark:bg-slate-900/50 lg:backdrop-blur-sm flex-1 flex flex-col lg:overflow-hidden lg:min-h-0 lg:h-full">
    <div
      class="mb-4 shrink-0 mt-4 lg:mt-0 sticky top-16 z-30 pointer-events-none lg:static lg:pointer-events-auto flex justify-center lg:block px-4 lg:px-0">
      <div class="flex items-center justify-center lg:justify-between mb-3 lg:mb-0 w-full max-w-sm lg:max-w-none">
        <h2 class="font-mono text-sm text-slate-900 dark:text-white items-center gap-2 hidden lg:flex">
          <Icon name="lucide:code-2" class="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          projects
          <span class="px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500">{{
            filteredProjects.length }}</span>
        </h2>

        <div
          class="flex gap-1 p-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full border border-slate-200/50 dark:border-slate-700/50 shadow-lg pointer-events-auto lg:bg-slate-100 lg:dark:bg-slate-800/50 lg:rounded-lg lg:border-none lg:shadow-none lg:backdrop-filter-none transition-all">
          <button v-for="cat in ['All', 'Web App', 'Mobile App', 'Open Source']" :key="cat"
            @click="selectedCategory = cat"
            class="px-3 py-1.5 lg:px-2.5 lg:py-1 rounded-full lg:rounded-md font-mono text-[10px] sm:text-xs lg:text-[10px] transition-all cursor-pointer"
            :class="selectedCategory === cat
              ? 'bg-emerald-500 text-white shadow-sm lg:bg-white lg:dark:bg-slate-700 lg:text-emerald-600 lg:dark:text-emerald-400'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              ">
            {{ cat }}
          </button>
        </div>
      </div>
    </div>

    <div
      class="lg:flex-1 lg:overflow-y-auto lg:pr-2 lg:-mr-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 px-4 lg:px-0">
      <div class="space-y-3 pb-2">
        <ProjectCard v-for="(project, index) in filteredProjects" :key="project.id" :project="project"
          class="animate-slide-up" :style="{ animationDelay: `${index * 100}ms` }"
          @click="openProjectDialog(project)" />
        <div v-if="filteredProjects.length === 0"
          class="flex flex-col items-center justify-center h-48 text-slate-400 dark:text-slate-500 font-mono text-xs gap-2">
          <div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
            <span class="text-2xl">🔍</span>
          </div>
          No projects found for '{{ selectedCategory }}'
        </div>
      </div>
    </div>

    <!-- Project Detail Dialog -->
    <Teleport to="body">
      <ProjectDetailDialog v-if="selectedProject" :project="selectedProject" :is-open="isDialogOpen"
        @close="isDialogOpen = false" />
    </Teleport>
  </div>
</template>
