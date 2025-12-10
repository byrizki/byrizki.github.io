<script setup lang="ts">
interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  location: string;
  [key: string]: any;
}

defineProps<{
  profile: Profile;
}>();
</script>

<template>
  <div
    class="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/50 backdrop-blur-sm p-4 lg:p-5 flex flex-col gap-4 group">
    <!-- Header: Avatar + Info + Status -->
    <div class="flex items-start justify-between gap-4 animate-slide-up" style="animation-delay: 0ms">
      <div class="flex items-center gap-3">
        <!-- Avatar -->
        <div class="relative shrink-0">
          <div
            class="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
            <span class="text-xl font-bold text-slate-400 dark:text-slate-500 font-mono">
              {{ profile.name.charAt(0) }}
            </span>
          </div>
        </div>

        <!-- Name & Title -->
        <div>
          <h1 class="font-bold text-slate-900 dark:text-white text-base leading-tight">
            {{ profile.name }}
          </h1>
          <p class="text-xs font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
            {{ profile.title }}
          </p>
        </div>
      </div>

      <!-- Status Pill -->
      <div
        class="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/5 dark:bg-emerald-400/5 border border-emerald-500/20 dark:border-emerald-400/20">
        <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></div>
        <span class="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">OPEN</span>
      </div>
    </div>

    <!-- Bio -->
    <div class="relative pl-3 border-l-2 border-slate-200 dark:border-slate-800 animate-slide-up"
      style="animation-delay: 100ms">
      <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
        {{ profile.bio }}
      </p>
    </div>

    <!-- Details Grid -->
    <div class="grid grid-cols-1 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/50 animate-slide-up"
      style="animation-delay: 200ms">
      <div v-if="profile.location" class="flex items-center gap-2 group/item">
        <div
          class="py-1 px-2 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover/item:text-emerald-500 dark:group-hover/item:text-emerald-400 transition-colors">
          <Icon name="lucide:map-pin" class="w-3.5 h-3.5" />
        </div>
        <span class="text-xs font-mono text-slate-600 dark:text-slate-400">{{ profile.location }}</span>
      </div>

      <a v-if="profile.email" :href="`mailto:${profile.email}`" class="flex items-center gap-2 group/item">
        <div
          class="py-1 px-2 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover/item:text-emerald-500 dark:group-hover/item:text-emerald-400 transition-colors">
          <Icon name="lucide:mail" class="w-3.5 h-3.5" />
        </div>
        <span
          class="text-xs font-mono text-slate-600 dark:text-slate-400 group-hover/item:text-slate-900 dark:group-hover/item:text-white transition-colors">
          {{ profile.email }}
        </span>
      </a>
      <div class="mt-6 flex flex-col items-end justify-end gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
        <span>built with Nuxt + ❤️</span>
      </div>
    </div>
  </div>
</template>
