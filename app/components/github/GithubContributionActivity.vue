<script setup lang="ts">
import type { ContributionActivity, ContributionDay } from "~/types/github";
import { formatDisplayDate } from "~/utils/chartHelpers";

defineProps<{
  activity: ContributionActivity;
}>();

const hoveredDay = ref<{ day: ContributionDay; x: number; y: number } | null>(null);

function handleMouseEnter(day: ContributionDay, event: MouseEvent) {
  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  hoveredDay.value = {
    day,
    x: rect.left + rect.width / 2,
    y: rect.top - 8,
  };
}

function handleMouseLeave() {
  hoveredDay.value = null;
}

function getLevelClass(level: number): string {
  switch (level) {
    case 1:
      return "bg-emerald-200 dark:bg-emerald-900/70 hover:ring-1 hover:ring-emerald-400";
    case 2:
      return "bg-emerald-400 dark:bg-emerald-700 hover:ring-1 hover:ring-emerald-300";
    case 3:
      return "bg-emerald-500 dark:bg-emerald-500 hover:ring-1 hover:ring-emerald-200";
    case 4:
      return "bg-emerald-700 dark:bg-emerald-400 hover:ring-1 hover:ring-emerald-100";
    case 0:
    default:
      return "bg-slate-100 dark:bg-slate-800/80 hover:ring-1 hover:ring-slate-300 dark:hover:ring-slate-600";
  }
}
</script>

<template>
  <div
    class="w-full rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-3 sm:p-3.5 flex flex-col justify-between shadow-xs">
    <!-- Header -->
    <div class="flex items-center justify-between mb-2">
      <h2 class="font-bold text-slate-900 dark:text-white text-sm tracking-tight">
        Contribution Activity
      </h2>
    </div>

    <!-- Calendar Grid with compact distribution -->
    <div class="overflow-x-auto scrollbar-hide py-0.5 w-full">
      <div class="min-w-[680px] lg:min-w-0 w-full">
        <!-- Months row -->
        <div class="flex text-[10px] text-slate-400 dark:text-slate-500 font-mono mb-1 pl-5 sm:pl-6">
          <div class="flex-1 flex justify-between pr-1">
            <span
              v-for="month in activity.months"
              :key="month.name + month.startWeekIndex"
              class="inline-block text-left">
              {{ month.name }}
            </span>
          </div>
        </div>

        <!-- Heatmap + Weekday labels -->
        <div class="flex items-start gap-1.5 w-full">
          <!-- Weekday Labels (Mon, Wed, Fri) -->
          <div class="flex flex-col justify-between text-[9px] text-slate-400 dark:text-slate-500 font-mono h-[72px] sm:h-[76px] shrink-0 py-0.5 select-none">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          <!-- Grid of Weeks -->
          <div class="flex justify-between flex-1 gap-[2px]">
            <div
              v-for="(week, wIdx) in activity.weeks"
              :key="wIdx"
              class="flex flex-col gap-[2px] flex-1 max-w-[12px]">
              <div
                v-for="day in week.days"
                :key="day.date"
                class="w-full aspect-square rounded-[1.5px] transition-all cursor-pointer"
                :class="getLevelClass(day.level)"
                @mouseenter="handleMouseEnter(day, $event)"
                @mouseleave="handleMouseLeave"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Legend Footer -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 pt-2 mt-2 border-t border-slate-100 dark:border-slate-800/60 text-[10.5px] text-slate-400 dark:text-slate-500 font-mono">
      <div class="flex items-center gap-2">
        <span class="text-[10.5px] text-slate-700 dark:text-slate-300 font-sans font-medium">
          {{ activity.totalLastYear.toLocaleString() }} total contributions
        </span>
        <span
          v-if="activity.githubContributions && activity.gitlabContributions"
          class="text-[9.5px] font-mono text-slate-400 dark:text-slate-500 hidden md:inline">
          (GitHub: {{ activity.githubContributions.toLocaleString() }} · GitLab: {{ activity.gitlabContributions.toLocaleString() }})
        </span>
      </div>

      <div class="flex items-center gap-1 text-[10px] self-end sm:self-auto">
        <span>Less</span>
        <div class="flex items-center gap-[2px]">
          <div class="w-2 h-2 rounded-[1.5px] bg-slate-100 dark:bg-slate-800"></div>
          <div class="w-2 h-2 rounded-[1.5px] bg-emerald-200 dark:bg-emerald-900/70"></div>
          <div class="w-2 h-2 rounded-[1.5px] bg-emerald-400 dark:bg-emerald-700"></div>
          <div class="w-2 h-2 rounded-[1.5px] bg-emerald-500 dark:bg-emerald-500"></div>
          <div class="w-2 h-2 rounded-[1.5px] bg-emerald-700 dark:bg-emerald-400"></div>
        </div>
        <span>More</span>
      </div>
    </div>

    <!-- Floating Tooltip -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="hoveredDay"
          class="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-[11px] font-mono shadow-xl border border-slate-700 whitespace-nowrap"
          :style="{ left: `${hoveredDay.x}px`, top: `${hoveredDay.y}px` }">
          <div class="font-bold text-emerald-400">
            {{ hoveredDay.day.count }} contributions
          </div>
          <div class="text-[10px] text-slate-400">
            {{ formatDisplayDate(hoveredDay.day.date) }}
          </div>
          <div
            v-if="hoveredDay.day.githubCount !== undefined && hoveredDay.day.gitlabCount !== undefined && (hoveredDay.day.githubCount > 0 || hoveredDay.day.gitlabCount > 0)"
            class="text-[10px] text-slate-300 pt-1 mt-1 border-t border-slate-800 flex items-center gap-2.5">
            <span v-if="hoveredDay.day.githubCount > 0" class="flex items-center gap-1">
              <Icon name="lucide:github" class="w-3 h-3 text-slate-400" />
              <span>{{ hoveredDay.day.githubCount }}</span>
            </span>
            <span v-if="hoveredDay.day.gitlabCount > 0" class="flex items-center gap-1">
              <Icon name="simple-icons:gitlab" class="w-3 h-3 text-orange-400" />
              <span>{{ hoveredDay.day.gitlabCount }}</span>
            </span>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
