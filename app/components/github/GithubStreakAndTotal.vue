<script setup lang="ts">
import type { StreakAndTotal } from "~/types/github";

const props = defineProps<{
  streakAndTotal: StreakAndTotal;
}>();

const weekdays = [
  { short: "M", name: "Monday" },
  { short: "T", name: "Tuesday" },
  { short: "W", name: "Wednesday" },
  { short: "T", name: "Thursday" },
  { short: "F", name: "Friday" },
  { short: "S", name: "Saturday" },
  { short: "S", name: "Sunday" },
];

const hoveredWeekday = ref<number | null>(null);
const hoveredBar = ref<{ index: number; value: number } | null>(null);
const flameBouncing = ref(false);

function triggerFlameBounce() {
  flameBouncing.value = true;
  setTimeout(() => {
    flameBouncing.value = false;
  }, 600);
}
</script>

<template>
  <div
    class="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-3.5 sm:p-4 flex flex-col justify-between shadow-xs">
    <!-- Top Section: Longest Streak -->
    <div>
      <div class="flex items-center justify-between mb-1.5">
        <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Longest Streak
        </span>
        <span
          v-if="hoveredWeekday !== null"
          class="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold animate-fade-in">
          {{ weekdays[hoveredWeekday].name }}: {{ streakAndTotal.activeDaysOfWeek[hoveredWeekday] ? 'Active' : 'Rest' }}
        </span>
      </div>

      <div class="flex items-center justify-between">
        <div
          class="flex items-baseline gap-1.5 cursor-pointer select-none group"
          title="Click for streak boost!"
          @click="triggerFlameBounce"
          @mouseenter="triggerFlameBounce">
          <span
            class="text-xl transition-transform duration-300"
            :class="{ 'animate-bounce scale-125': flameBouncing }">
            🔥
          </span>
          <span class="text-2xl sm:text-3xl font-extrabold text-amber-500 tracking-tight group-hover:text-amber-400 transition-colors">
            {{ streakAndTotal.longestStreakDays }}
          </span>
          <span class="text-xs font-semibold text-slate-600 dark:text-slate-300">
            days
          </span>
        </div>

        <!-- Interactive Days of Week Indicators -->
        <div class="flex items-center gap-2">
          <div
            v-for="(day, idx) in weekdays"
            :key="idx"
            class="flex flex-col items-center gap-0.5 cursor-pointer p-0.5 rounded transition-transform hover:scale-110"
            @mouseenter="hoveredWeekday = idx"
            @mouseleave="hoveredWeekday = null">
            <span
              class="text-[9px] font-mono transition-colors"
              :class="hoveredWeekday === idx ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400 dark:text-slate-500'">
              {{ day.short }}
            </span>
            <div
              class="w-1.5 h-1.5 rounded-full transition-all"
              :class="[
                streakAndTotal.activeDaysOfWeek[idx]
                  ? 'bg-emerald-500 shadow-xs'
                  : 'bg-slate-200 dark:bg-slate-700',
                hoveredWeekday === idx ? 'ring-2 ring-emerald-400 scale-125' : ''
              ]"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Divider -->
    <div class="my-2.5 border-t border-slate-100 dark:border-slate-800/60"></div>

    <!-- Bottom Section: Total Contributions & Bars -->
    <div class="flex items-end justify-between gap-4">
      <div>
        <div class="flex items-center gap-1.5">
          <span class="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Total Contributions
          </span>
          <span
            v-if="hoveredBar !== null"
            class="text-[9.5px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold animate-fade-in">
            (Intensity: {{ hoveredBar.value }}%)
          </span>
        </div>

        <div class="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
          {{ streakAndTotal.totalContributionsYear.toLocaleString() }}
        </div>
        <div class="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
          this year
        </div>
      </div>

      <!-- Interactive Monthly Bar Chart -->
      <div class="flex items-end gap-1 h-9 pb-0.5">
        <div
          v-for="(barHeight, idx) in streakAndTotal.monthlyBars"
          :key="idx"
          class="w-1.5 sm:w-2 rounded-t-xs transition-all duration-200 cursor-pointer"
          :class="[
            hoveredBar?.index === idx
              ? 'bg-emerald-400 scale-y-110 shadow-xs ring-1 ring-emerald-300'
              : 'bg-emerald-500 hover:bg-emerald-400'
          ]"
          :style="{ height: `${barHeight}%` }"
          @mouseenter="hoveredBar = { index: idx, value: barHeight }"
          @mouseleave="hoveredBar = null"
        />
      </div>
    </div>
  </div>
</template>
