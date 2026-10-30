<script setup lang="ts">
interface Experience {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  description: string;
  logo?: string;
  location?: string;
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
    class="w-full rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-3.5 sm:p-4 shadow-xs flex flex-col justify-between">
    <!-- Header -->
    <div class="flex items-center justify-between pb-2.5 mb-3.5 border-b border-slate-100 dark:border-slate-800/80">
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
          <Icon name="lucide:briefcase" class="w-3.5 h-3.5" />
        </div>
        <h2 class="font-bold text-sm text-slate-900 dark:text-white tracking-tight leading-tight">
          Work Experience
        </h2>
      </div>

      <span class="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400 font-medium">
        {{ experience.length }} positions
      </span>
    </div>

    <!-- Timeline List -->
    <div class="relative pl-3 sm:pl-4 space-y-8">
      <!-- Vertical Timeline Line -->
      <div class="absolute left-[19px] sm:left-[23px] top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800"></div>

      <div
        v-for="(exp, index) in experience"
        :key="exp.id"
        class="relative flex items-start gap-4 group animate-slide-up"
        :style="{ animationDelay: `${index * 80}ms` }">
        
        <!-- Timeline Node / Logo -->
        <div class="relative z-10 shrink-0">
          <div
            v-if="exp.logo"
            class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-center p-1 overflow-hidden group-hover:scale-105 group-hover:border-teal-500 transition-all duration-300">
            <img :src="exp.logo" :alt="exp.company" class="w-full h-full object-contain" />
          </div>
          <div
            v-else
            class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xs">
            {{ exp.company.charAt(0) }}
          </div>
        </div>

        <!-- Role & Details Content -->
        <div class="flex-1 min-w-0 pt-0.5">
          <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-2">
            <div>
              <h3 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                {{ exp.role }}
              </h3>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-xs font-semibold text-teal-600 dark:text-teal-400 font-mono">
                  {{ exp.company }}
                </span>
                <span v-if="exp.location" class="text-[11px] text-slate-400 dark:text-slate-500 font-mono hidden sm:inline">
                  &bull; {{ exp.location }}
                </span>
              </div>
            </div>

            <!-- Date Range Badge -->
            <div class="flex items-center gap-1.5 shrink-0 mt-1 sm:mt-0">
              <span
                v-if="!exp.end_date"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-semibold">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Present
              </span>
              <span class="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                {{ formatDate(exp.start_date) }} &ndash; {{ exp.end_date ? formatDate(exp.end_date) : "Now" }}
              </span>
            </div>
          </div>

          <!-- Description -->
          <p class="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed mt-2.5 whitespace-pre-line">
            {{ exp.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
