<script setup lang="ts">
import { useTheme } from "~/composables/useTheme";

const { theme, toggle } = useTheme();
</script>

<template>
  <button @click="toggle"
    class="cursor-pointer w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
    aria-label="Toggle theme">
    <Icon v-if="theme === 'dark'" name="lucide:sun" class="w-4 h-4 text-slate-500 dark:text-slate-400" />
    <Icon v-else name="lucide:moon" class="w-4 h-4 text-slate-500 dark:text-slate-400" />
  </button>
</template>
