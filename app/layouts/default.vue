<script setup lang="ts">
import { useTheme } from "~/composables/useTheme";

const { isReady, init } = useTheme();

onMounted(() => {
  init();
  document.documentElement.style.scrollBehavior = "smooth";
});

onUnmounted(() => {
  document.documentElement.style.scrollBehavior = "auto";
});
</script>

<template>
  <div
    class="h-dvh flex flex-col bg-white dark:bg-black text-slate-900 dark:text-white overflow-hidden transition-colors duration-200">
    <!-- Grid Background -->
    <div
      class="fixed inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] pointer-events-none">
    </div>

    <!-- Loading State while theme is initializing -->
    <div
      v-if="!isReady"
      class="flex-1 flex items-center justify-center bg-white dark:bg-black">
      <div class="flex flex-col items-center gap-3">
        <div class="w-7 h-7 rounded-full border-2 border-slate-200 dark:border-slate-800 border-t-emerald-500 animate-spin"></div>
      </div>
    </div>

    <!-- Content -->
    <main v-else class="flex-1 min-h-0 w-full animate-fade-in">
      <slot />
    </main>
  </div>
</template>

<style>
.bg-size-\[64px_64px\] {
  background-size: 64px 64px;
}

.mask-\[radial-gradient\(ellipse_80\%_50\%_at_50\%_50\%2cblack2ctransparent\)\] {
  mask-image: radial-gradient(ellipse 80% 50% at 50% 50%, black, transparent);
  -webkit-mask-image: radial-gradient(ellipse 80% 50% at 50% 50%,
      black,
      transparent);
}
</style>
