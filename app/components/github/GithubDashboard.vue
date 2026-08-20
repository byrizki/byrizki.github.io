<script setup lang="ts">
import { useGithubData } from "~/composables/useGithubData";
import GithubStatCards from "./GithubStatCards.vue";
import GithubContributionActivity from "./GithubContributionActivity.vue";
import GithubTopLanguages from "./GithubTopLanguages.vue";
import GithubStreakAndTotal from "./GithubStreakAndTotal.vue";
import GithubFooterBar from "./GithubFooterBar.vue";

const { stats, contributions, topLanguages, streakAndTotal, footer } = useGithubData();
</script>

<template>
  <div class="w-full flex flex-col gap-4 md:gap-6 animate-slide-up">
    <!-- 5 Stat Cards Row -->
    <GithubStatCards :stats="stats" />

    <!-- Contribution Activity (Full width so all 52 weeks fit without truncation) -->
    <GithubContributionActivity :activity="contributions" />

    <!-- Bottom Row: Top Languages & Longest Streak (2 equal columns) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <GithubTopLanguages :languages="topLanguages" class="h-full" />
      <GithubStreakAndTotal :streak-and-total="streakAndTotal" class="h-full" />
    </div>

    <!-- Footer Quote (Only shown on Overview) -->
    <GithubFooterBar :footer="footer" />
  </div>
</template>
