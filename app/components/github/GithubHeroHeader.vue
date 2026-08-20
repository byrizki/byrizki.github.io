<script setup lang="ts">
import type { GithubProfile } from "~/types/github";
import { formatDisplayDate } from "~/utils/chartHelpers";

defineProps<{
  profile: GithubProfile;
}>();

const avatarError = ref(false);
const clickRotation = ref(0);
const isSpinning = ref(false);

function spinAvatar() {
  if (isSpinning.value) return;
  isSpinning.value = true;
  clickRotation.value += 360;
  setTimeout(() => {
    isSpinning.value = false;
  }, 750);
}

function onAnimationEnd() {
  isSpinning.value = false;
}
</script>

<template>
  <div
    class="relative overflow-hidden rounded-2xl md:rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm transition-all duration-300">
    
    <!-- Mobile Banner Header (only on mobile) -->
    <div class="sm:hidden relative w-full h-32 overflow-hidden bg-slate-100 dark:bg-slate-800/50">
      <img
        src="/light.webp"
        alt="Mountain workspace background light"
        class="w-full h-full object-cover object-right block dark:hidden"
      />
      <img
        src="/dark.webp"
        alt="Mountain workspace background dark"
        class="w-full h-full object-cover object-right hidden dark:block"
      />
    </div>

    <!-- Desktop Background Illustration on the Right -->
    <div
      class="hidden sm:flex absolute right-0 top-0 bottom-0 w-2/3 lg:w-3/5 pointer-events-none select-none overflow-hidden items-center justify-end">
      <!-- Light theme illustration -->
      <img
        src="/light.webp"
        alt="Mountain workspace background light"
        class="h-full w-auto max-w-none object-contain object-right opacity-95 block dark:hidden transition-opacity duration-300"
      />
      <!-- Dark theme illustration -->
      <img
        src="/dark.webp"
        alt="Mountain workspace background dark"
        class="h-full w-auto max-w-none object-contain object-right opacity-95 hidden dark:block transition-opacity duration-300"
      />
    </div>

    <!-- Header Content Area -->
    <div class="relative z-10 px-4 pb-5 pt-0 sm:p-7 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-7">
      <!-- Avatar with 3D Coin-Flip Animation on Hover and Click -->
      <div class="relative shrink-0 -mt-10 sm:mt-0 [perspective:1000px] select-none">
        <div
          class="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-4 border-white dark:border-slate-900 shadow-md overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center transition-transform duration-700 ease-out [transform-style:preserve-3d] cursor-pointer hover:scale-105 active:scale-95"
          :style="{ transform: `rotateY(${clickRotation}deg)` }"
          title="Click or hover to flip!"
          @mouseenter="spinAvatar"
          @click="spinAvatar"
          @transitionend="onAnimationEnd">
          <img
            v-if="!avatarError && profile.avatarUrl"
            :src="profile.avatarUrl"
            :alt="profile.name"
            class="w-full h-full object-cover select-none pointer-events-none"
            @error="avatarError = true"
          />
          <div
            v-else
            class="text-2xl sm:text-3xl font-bold font-mono text-slate-500 dark:text-slate-400">
            {{ profile.name.charAt(0) }}
          </div>
        </div>
      </div>

      <!-- Info Column -->
      <div class="flex-1 min-w-0 w-full sm:w-auto">
        <!-- Name (Two-tone effect) -->
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
          <span class="text-slate-900 dark:text-white">{{ profile.firstName }}</span>
          <span v-if="profile.lastName" class="text-teal-600 dark:text-teal-400 ml-2">{{ profile.lastName }}</span>
        </h1>

        <!-- Bio from GitHub -->
        <p v-if="profile.bio" class="text-xs sm:text-sm md:text-base font-medium text-slate-500 dark:text-slate-400 mt-1">
          {{ profile.bio }}
        </p>

        <!-- Location, Email, GitHub Link, and Last Updated -->
        <div class="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <div v-if="profile.location" class="flex items-center gap-1.5">
            <Icon name="lucide:map-pin" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 dark:text-slate-500" />
            <span>{{ profile.location }}</span>
          </div>

          <a
            href="mailto:work@byrizki.com"
            class="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-mono">
            <Icon name="lucide:mail" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 dark:text-slate-500" />
            <span>work@byrizki.com</span>
          </a>

          <a
            :href="profile.url"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors font-mono">
            <Icon name="lucide:link-2" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{{ profile.url.replace(/^https?:\/\//, "") }}</span>
          </a>

          <!-- Last Updated Time (Replacing badges) -->
          <div class="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-mono">
            <Icon name="lucide:clock" class="w-3.5 h-3.5" />
            <span>{{ formatDisplayDate(profile.lastUpdated) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
