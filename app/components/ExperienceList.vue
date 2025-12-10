<script setup lang="ts">


interface Experience {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  description: string;
  [key: string]: any;
}

defineProps<{
  experience: Experience[];
}>();

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
</script>

<template>
  <div
    class="lg:border lg:border-slate-200 lg:dark:border-slate-800 lg:rounded-2xl p-0 lg:p-4 lg:bg-white lg:dark:bg-slate-900/50 lg:backdrop-blur-sm flex flex-col h-auto">
    <div class="hidden lg:flex items-center gap-2 mb-4 shrink-0 px-4 lg:px-0">
      <Icon name="lucide:briefcase" class="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
      <h2 class="font-mono text-sm text-slate-900 dark:text-white">
        experience
      </h2>
      <div class="ml-auto text-slate-500 dark:text-slate-500 font-mono text-xs">
        {{ experience.length }} roles
      </div>
    </div>

    <div class="mt-2 lg:mt-0 px-4 lg:px-0 lg:pr-2 lg:-mr-2">
      <div class="space-y-12 relative pl-2">
        <!-- Timeline Line -->
        <div class="absolute left-[3px] top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-800"></div>

        <div v-for="(exp, index) in experience" :key="exp.id" class="relative pl-6 group animate-slide-up"
          :style="{ animationDelay: `${index * 100}ms` }">
          <!-- Timeline Dot -->
          <div
            class="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 ring-4 ring-white dark:ring-slate-900 group-hover:bg-emerald-500 dark:group-hover:bg-emerald-400 transition-colors">
          </div>

          <div class="flex flex-col gap-1">
            <div class="flex items-baseline justify-between gap-2">
              <h3
                class="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                {{ exp.role }}
              </h3>
              <span class="text-[10px] font-mono text-slate-400 dark:text-slate-500 shrink-0">
                {{ formatDate(exp.start_date) }} -
                {{ exp.end_date ? formatDate(exp.end_date) : "Present" }}
              </span>
            </div>

            <div class="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400">
              <img v-if="exp.logo" :src="exp.logo" :alt="exp.company"
                class="w-6 h-6 object-contain rounded-full bg-white p-0.5" />
              <span>{{ exp.company }}</span>
            </div>

            <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
              {{ exp.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
