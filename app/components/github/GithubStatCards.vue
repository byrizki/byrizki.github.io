<script setup lang="ts">
import type { GithubStats } from "~/types/github";
import GithubStatCard from "./GithubStatCard.vue";

defineProps<{
  stats: GithubStats;
}>();
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
    <!-- Card 1: Contributions -->
    <GithubStatCard
      icon="lucide:git-commit"
      :value="stats.contributions.display"
      :label="stats.contributions.label"
      :trend-percent="stats.contributions.trendPercent"
      theme-color="emerald"
      :sparkline="stats.contributions.sparkline"
    />

    <!-- Card 2: Repositories -->
    <GithubStatCard
      icon="lucide:folder-git-2"
      :value="stats.repositories.display"
      :label="stats.repositories.label"
      :trend-percent="stats.repositories.trendPercent"
      theme-color="blue"
      :sparkline="stats.repositories.sparkline"
    />

    <!-- Card 3: Stars Earned -->
    <GithubStatCard
      icon="lucide:star"
      :value="stats.starsEarned.display"
      :label="stats.starsEarned.label"
      :trend-percent="stats.starsEarned.trendPercent"
      theme-color="purple"
      :sparkline="stats.starsEarned.sparkline"
    />

    <!-- Card 4: Followers -->
    <GithubStatCard
      icon="lucide:users"
      :value="stats.followers.display"
      :label="stats.followers.label"
      :trend-percent="stats.followers.trendPercent"
      theme-color="amber"
      :sparkline="stats.followers.sparkline"
    />

    <!-- Card 5: Commit Quality -->
    <div
      class="col-span-2 sm:col-span-2 md:col-span-1 lg:col-span-1 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-3 sm:p-3.5 flex flex-col justify-between shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200">
      <div class="flex items-center gap-2.5">
        <!-- Circular Progress Ring with A+ -->
        <div class="relative w-8 h-8 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 36 36" class="w-full h-full -rotate-90">
            <!-- Background track -->
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              class="stroke-slate-100 dark:stroke-slate-800"
              stroke-width="3.5"
            />
            <!-- Progress stroke -->
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              class="stroke-emerald-500"
              stroke-width="3.5"
              stroke-dasharray="92, 100"
              stroke-linecap="round"
            />
          </svg>
          <span class="absolute font-extrabold text-xs text-emerald-600 dark:text-emerald-400">
            {{ stats.commitQuality.grade }}
          </span>
        </div>

        <div class="min-w-0">
          <div class="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate">
            Commit Quality
          </div>
          <div class="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            {{ stats.commitQuality.ratingLabel }}
          </div>
        </div>
      </div>

      <!-- Rating Indicator Dots -->
      <div class="flex items-center gap-1 mt-2.5 pt-1.5 border-t border-slate-100 dark:border-slate-800/60">
        <div
          v-for="idx in stats.commitQuality.maxDots"
          :key="idx"
          class="w-1.5 h-1.5 rounded-full transition-colors"
          :class="idx <= stats.commitQuality.scoreDots ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'"
        />
      </div>
    </div>
  </div>
</template>
