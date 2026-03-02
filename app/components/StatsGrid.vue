<script setup lang="ts">
defineProps<{
  projectCount: number;
  skillCount: number;
  roleCount: number;
}>();
</script>

<template>
  <div class="grid grid-cols-3 gap-3 animate-slide-up" style="animation-delay: 400ms">
    <div
      class="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm text-center flex flex-col items-center justify-center gap-1 group hover:border-emerald-500/30 dark:hover:border-emerald-400/30 transition-colors">
      <Icon name="lucide:code-2" class="w-4 h-4 text-emerald-500 dark:text-emerald-400 mb-1" />
      <div class="text-xl font-bold text-slate-900 dark:text-white">{{ projectCount }}</div>
      <div class="text-[10px] font-mono text-slate-500 uppercase tracking-wide">Projects</div>
    </div>

    <div
      class="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm text-center flex flex-col items-center justify-center gap-1 group hover:border-emerald-500/30 dark:hover:border-emerald-400/30 transition-colors">
      <Icon name="lucide:terminal" class="w-4 h-4 text-emerald-500 dark:text-emerald-400 mb-1" />
      <div class="text-xl font-bold text-slate-900 dark:text-white">{{ skillCount }}</div>
      <div class="text-[10px] font-mono text-slate-500 uppercase tracking-wide">Skills</div>
    </div>

    <div
      class="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm text-center flex flex-col items-center justify-center gap-1 group hover:border-emerald-500/30 dark:hover:border-emerald-400/30 transition-colors">
      <Icon name="lucide:briefcase" class="w-4 h-4 text-emerald-500 dark:text-emerald-400 mb-1" />
      <div class="text-xl font-bold text-slate-900 dark:text-white">{{ roleCount }}</div>
      <div class="text-[10px] font-mono text-slate-500 uppercase tracking-wide">Roles</div>
    </div>
  </div>
</template>
