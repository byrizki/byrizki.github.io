<script setup lang="ts">
import type { LanguageStat } from "~/types/github";
import { calculateDonutSegments } from "~/utils/chartHelpers";

const props = defineProps<{
  languages: LanguageStat[];
}>();

const radius = 40;
const segments = computed(() => calculateDonutSegments(props.languages, radius));

const activeLang = ref<LanguageStat | null>(null);

function setActive(name: string) {
  const found = props.languages.find((l) => l.name === name);
  activeLang.value = found || null;
}

function clearActive() {
  activeLang.value = null;
}
</script>

<template>
  <div
    class="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-3.5 sm:p-4 flex flex-col justify-between shadow-xs">
    <!-- Header -->
    <div class="flex items-center justify-between mb-2">
      <h2 class="font-bold text-slate-900 dark:text-white text-sm tracking-tight">
        Top Languages
      </h2>
      <span v-if="activeLang" class="text-[11px] font-mono font-semibold" :style="{ color: activeLang.color }">
        {{ activeLang.name }}: {{ activeLang.percentage }}%
      </span>
    </div>

    <div class="flex items-center justify-between gap-3 py-1">
      <!-- Interactive Donut Chart -->
      <div class="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90">
          <circle
            v-for="segment in segments"
            :key="segment.name"
            cx="50"
            cy="50"
            :r="radius"
            fill="none"
            :stroke="segment.color"
            :stroke-width="activeLang?.name === segment.name ? 16 : 13"
            :stroke-dasharray="segment.dashArray"
            :stroke-dashoffset="segment.dashOffset"
            class="transition-all duration-300 cursor-pointer"
            :class="[
              activeLang && activeLang.name !== segment.name ? 'opacity-35' : 'opacity-100'
            ]"
            @mouseenter="setActive(segment.name)"
            @mouseleave="clearActive"
          />
        </svg>

        <!-- Dynamic Center Display -->
        <div class="absolute flex flex-col items-center justify-center text-center pointer-events-none px-1">
          <Transition name="fade" mode="out-in">
            <div v-if="activeLang" :key="activeLang.name" class="flex flex-col items-center">
              <span
                class="text-[11px] sm:text-xs font-bold leading-tight truncate max-w-[64px]"
                :style="{ color: activeLang.color }">
                {{ activeLang.name }}
              </span>
              <span class="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-semibold">
                {{ activeLang.percentage }}%
              </span>
            </div>
            <div v-else key="default" class="text-slate-700 dark:text-slate-300">
              <Icon name="lucide:code-2" class="w-4 h-4 text-slate-400 dark:text-slate-500" />
            </div>
          </Transition>
        </div>
      </div>

      <!-- Interactive Languages Legend -->
      <div class="flex-1 flex flex-col gap-1 min-w-0 pr-1">
        <div
          v-for="lang in languages"
          :key="lang.name"
          class="flex flex-col gap-0.5 p-1 rounded-md transition-all cursor-pointer select-none"
          :class="[
            activeLang?.name === lang.name
              ? 'bg-slate-100 dark:bg-slate-800/80 shadow-xs'
              : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
          ]"
          @mouseenter="setActive(lang.name)"
          @mouseleave="clearActive">
          <div class="flex items-center justify-between text-xs">
            <div class="flex items-center gap-1.5 min-w-0 truncate">
              <span
                class="w-2 h-2 rounded-full shrink-0 transition-transform"
                :class="[activeLang?.name === lang.name ? 'scale-125 ring-2 ring-white dark:ring-slate-900' : '']"
                :style="{ backgroundColor: lang.color }"
              />
              <span
                class="font-medium truncate text-[11px] sm:text-xs transition-colors"
                :class="[activeLang?.name === lang.name ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-700 dark:text-slate-300']">
                {{ lang.name }}
              </span>
            </div>

            <span class="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 shrink-0 ml-2">
              {{ lang.percentage }}%
            </span>
          </div>

          <!-- Included Languages subtitle for 'Other' -->
          <div
            v-if="lang.otherLanguages && lang.otherLanguages.length > 0"
            class="text-[9.5px] font-mono text-slate-400 dark:text-slate-500 pl-3.5 truncate"
            :title="lang.otherLanguages.join(', ')">
            ({{ lang.otherLanguages.slice(0, 5).join(', ') }}{{ lang.otherLanguages.length > 5 ? '...' : '' }})
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
