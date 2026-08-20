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
const searchQuery = ref("");
const selectedProject = ref<Project | null>(null);
const isDialogOpen = ref(false);

const categories = ["All", "Web App", "Mobile App", "Open Source"];

const getCategoryCount = (cat: string) => {
  if (cat === "All") return props.projects.length;
  return props.projects.filter(
    (p) => p.project_type.toLowerCase() === cat.toLowerCase()
  ).length;
};

const filteredProjects = computed(() => {
  return props.projects
    .filter((p) => {
      const matchesCategory =
        selectedCategory.value === "All" ||
        p.project_type.toLowerCase() === selectedCategory.value.toLowerCase();

      const q = searchQuery.value.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.technologies.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      // 1. Featured projects first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;

      // 2. By display_order (ascending)
      if (a.display_order !== b.display_order) {
        return a.display_order - b.display_order;
      }

      // 3. By created_at (descending)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
});

const openProjectDialog = (project: Project) => {
  selectedProject.value = project;
  isDialogOpen.value = true;
};
</script>

<template>
  <div class="w-full flex flex-col gap-4 md:gap-5 animate-slide-up">
    <!-- Top Filter & Search Bar -->
    <div
      class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-xl md:rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xs">
      
      <!-- Category Tabs Filter -->
      <div class="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-0.5 sm:pb-0">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="selectedCategory = cat"
          class="px-3 py-1.5 rounded-lg font-mono text-xs transition-all shrink-0 cursor-pointer flex items-center gap-2"
          :class="[
            selectedCategory === cat
              ? 'bg-teal-600 text-white font-semibold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
          ]">
          <span>{{ cat }}</span>
          <span
            class="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full text-[10px] font-mono leading-none text-center"
            :class="[
              selectedCategory === cat
                ? 'bg-white/20 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
            ]">
            {{ getCategoryCount(cat) }}
          </span>
        </button>
      </div>

      <!-- Quick Search Bar -->
      <div class="relative min-w-0 sm:w-64">
        <Icon
          name="lucide:search"
          class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
        />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Filter by name, tech..."
          class="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-teal-500 transition-all font-mono"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <Icon name="lucide:x" class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Projects Responsive Grid -->
    <div
      v-if="filteredProjects.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
      <ProjectCard
        v-for="(project, index) in filteredProjects"
        :key="project.id"
        :project="project"
        class="animate-slide-up"
        :style="{ animationDelay: `${index * 60}ms` }"
        @open="openProjectDialog(project)"
      />
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="w-full py-16 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-center">
      <div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3">
        <Icon name="lucide:folder-search" class="w-6 h-6" />
      </div>
      <h3 class="text-sm font-bold text-slate-900 dark:text-white">
        No projects match your filter
      </h3>
      <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
        Try selecting a different category or clearing the search query.
      </p>
      <button
        @click="selectedCategory = 'All'; searchQuery = ''"
        class="mt-4 px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-mono font-medium transition-colors cursor-pointer">
        Reset filters
      </button>
    </div>

    <!-- Project Detail Dialog -->
    <Teleport to="body">
      <ProjectDetailDialog
        v-if="selectedProject"
        :project="selectedProject"
        :is-open="isDialogOpen"
        @close="isDialogOpen = false"
      />
    </Teleport>
  </div>
</template>
