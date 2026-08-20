<script setup lang="ts">
import type { GithubFooterData } from "~/types/github";

defineProps<{
  footer: GithubFooterData;
}>();
</script>

<template>
  <div
    class="rounded-xl md:rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-4 sm:p-5 flex items-center justify-between gap-4 shadow-sm">
    <div class="flex items-center gap-3 w-full">
      <div class="text-2xl text-teal-600 dark:text-teal-400 font-serif leading-none shrink-0">
        “
      </div>
      <div class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic">
        <span>{{ footer.quote }}</span>
        <span class="text-slate-400 dark:text-slate-500 ml-1.5 not-italic font-sans text-xs">— {{ footer.quoteAuthor }}</span>
      </div>
    </div>
  </div>
</template>
