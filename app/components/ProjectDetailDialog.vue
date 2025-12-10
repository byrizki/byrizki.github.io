<script setup lang="ts">
import { useScrollLock } from "@vueuse/core";

const props = defineProps<{
  project: any;
  isOpen: boolean;
}>();

const emit = defineEmits(["close"]);

// Lock scroll when dialog is open
const isLocked = useScrollLock(document.body);
watch(
  () => props.isOpen,
  (val) => {
    isLocked.value = val;
  }
);
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="emit('close')"></div>

      <!-- Dialog Panel -->
      <div
        class="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up border border-slate-200 dark:border-slate-800">
        <!-- Header Image -->
        <div v-if="project.image_url" class="relative h-48 sm:h-64 bg-slate-200 dark:bg-slate-800 shrink-0">
          <img :src="project.image_url" :alt="project.title" class="w-full h-full object-cover object-top" />
          <div class="absolute inset-0 bg-linear-to-t from-slate-900/80 to-transparent"></div>
          <button @click="emit('close')"
            class="cursor-pointer absolute top-4 right-4 w-7 h-7 items-center justify-center flex rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-colors">
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </div>

        <!-- Header without Image -->
        <div v-else
          class="relative p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
          <div class="flex flex-col gap-2">
            <div
              class="self-start px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono rounded border border-emerald-100 dark:border-emerald-500/20">
              {{ project.project_type }}
            </div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white">
              {{ project.title }}
            </h2>
          </div>
          <button @click="emit('close')"
            class="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors">
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 overflow-y-auto custom-scrollbar">
          <div v-if="project.image_url" class="flex flex-col gap-2 mb-6">
            <div
              class="self-start px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono rounded border border-emerald-100 dark:border-emerald-500/20">
              {{ project.project_type }}
            </div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white">
              {{ project.title }}
            </h2>
          </div>

          <div
            class="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
            <p>{{ project.description }}</p>
          </div>

          <!-- Technologies -->
          <div class="mb-8">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 font-mono">
              Technologies
            </h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="tech in project.technologies" :key="tech"
                class="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono rounded-md border border-slate-200 dark:border-slate-700">
                {{ tech }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div v-if="project.demo_url || project.playstore_url || project.appstore_url || project.github_url"
            class="flex flex-wrap gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            <a v-if="project.demo_url" :href="project.demo_url" target="_blank" rel="noopener noreferrer"
              class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors">
              <Icon name="lucide:globe" class="w-4 h-4" />
              <span>Website</span>
            </a>

            <a v-if="project.playstore_url" :href="project.playstore_url" target="_blank" rel="noopener noreferrer"
              class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-black rounded-lg font-medium transition-colors">
              <Icon name="logos:google-play-icon" class="w-4 h-4" />
              <span>Play Store</span>
            </a>

            <a v-if="project.appstore_url" :href="project.appstore_url" target="_blank" rel="noopener noreferrer"
              class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              <Icon name="logos:apple-app-store" class="w-4 h-4 invert text-white" />
              <span>App Store</span>
            </a>

            <a v-if="project.github_url" :href="project.github_url" target="_blank" rel="noopener noreferrer"
              class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors">
              <Icon name="lucide:github" class="w-4 h-4" />
              <span>View Code</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.5);
}
</style>
