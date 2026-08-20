<script setup lang="ts">
interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_year: string;
  end_year: string;
  grade?: string | null;
  logo?: string | null;
  location?: string;
}

defineProps<{
  education: Education[];
}>();
</script>

<template>
  <div
    class="w-full rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-3.5 sm:p-4 shadow-xs flex flex-col justify-between">
    <!-- Header -->
    <div class="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100 dark:border-slate-800/80">
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <Icon name="lucide:graduation-cap" class="w-3.5 h-3.5" />
        </div>
        <div>
          <h2 class="font-bold text-sm text-slate-900 dark:text-white tracking-tight leading-tight">
            Education
          </h2>
        </div>
      </div>

      <span class="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400 font-medium">
        {{ education.length }} degrees
      </span>
    </div>

    <!-- Education Items -->
    <div class="space-y-2.5">
      <div
        v-for="item in education"
        :key="item.id"
        class="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-lg bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 hover:border-slate-200 dark:hover:border-slate-700 transition-all">
        
        <!-- Institution Logo -->
        <div class="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center shrink-0 p-0.5 mt-0.5 overflow-hidden shadow-2xs">
          <img
            v-if="item.logo"
            :src="item.logo"
            :alt="item.institution"
            class="w-full h-full object-contain"
          />
          <div
            v-else
            class="w-full h-full rounded-md bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs font-sans">
            {{ item.institution.charAt(0) }}
          </div>
        </div>

        <div class="flex-1 min-w-0">
          <h3 class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
            {{ item.institution }}
          </h3>
          <p class="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5 leading-snug">
            {{ item.degree }}, {{ item.field_of_study }}
          </p>
          <div class="flex flex-wrap items-center gap-1.5 mt-1 text-[10px] font-mono text-slate-400 dark:text-slate-500">
            <span>{{ item.start_year }} &ndash; {{ item.end_year }}</span>
            <span v-if="item.grade">&bull; {{ item.grade }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
