<script setup lang="ts">
import { generateSparklinePath } from "~/utils/chartHelpers";

const props = defineProps<{
  icon: string;
  value: string | number;
  label: string;
  trendPercent: number;
  themeColor: "emerald" | "blue" | "purple" | "amber";
  sparkline: number[];
}>();

const sparklinePath = computed(() => generateSparklinePath(props.sparkline, 64, 20));

const colorClasses = computed(() => {
  switch (props.themeColor) {
    case "blue":
      return {
        iconBg: "bg-blue-50 dark:bg-blue-950/60",
        iconColor: "text-blue-600 dark:text-blue-400",
        trendColor: "text-blue-600 dark:text-blue-400",
        stroke: "#3b82f6",
      };
    case "purple":
      return {
        iconBg: "bg-purple-50 dark:bg-purple-950/60",
        iconColor: "text-purple-600 dark:text-purple-400",
        trendColor: "text-purple-600 dark:text-purple-400",
        stroke: "#a855f7",
      };
    case "amber":
      return {
        iconBg: "bg-amber-50 dark:bg-amber-950/60",
        iconColor: "text-amber-600 dark:text-amber-400",
        trendColor: "text-amber-600 dark:text-amber-400",
        stroke: "#f59e0b",
      };
    case "emerald":
    default:
      return {
        iconBg: "bg-emerald-50 dark:bg-emerald-950/60",
        iconColor: "text-emerald-600 dark:text-emerald-400",
        trendColor: "text-emerald-600 dark:text-emerald-400",
        stroke: "#10b981",
      };
  }
});
</script>

<template>
  <div
    class="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-3 sm:p-3.5 flex flex-col justify-between shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200">
    <!-- Top row: Icon + Number & Label -->
    <div class="flex items-center gap-2.5">
      <div
        class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        :class="[colorClasses.iconBg, colorClasses.iconColor]">
        <Icon :name="icon" class="w-4 h-4" />
      </div>

      <div class="min-w-0">
        <div class="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
          {{ value }}
        </div>
        <div class="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
          {{ label }}
        </div>
      </div>
    </div>

    <!-- Bottom row: Trend indicator + Sparkline SVG -->
    <div class="flex items-center justify-between mt-2.5 pt-1.5 border-t border-slate-100 dark:border-slate-800/60">
      <div class="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold" :class="colorClasses.trendColor">
        <Icon name="lucide:arrow-up" class="w-3 h-3" />
        <span>{{ trendPercent }}% <span class="font-normal text-slate-400 dark:text-slate-500 hidden sm:inline">vs last year</span></span>
      </div>

      <!-- Sparkline curve -->
      <div class="w-16 h-5 shrink-0 flex items-center justify-end">
        <svg viewBox="0 0 64 20" class="w-full h-full overflow-visible">
          <path
            :d="sparklinePath"
            fill="none"
            :stroke="colorClasses.stroke"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
  </div>
</template>
