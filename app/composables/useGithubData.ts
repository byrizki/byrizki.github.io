import githubDataRaw from "~/assets/github-data.json";
import type { GithubDashboardData } from "~/types/github";

export const useGithubData = () => {
  const data = ref<GithubDashboardData>(githubDataRaw as unknown as GithubDashboardData);

  return {
    data,
    profile: computed(() => data.value.profile),
    stats: computed(() => data.value.stats),
    contributions: computed(() => data.value.contributions),
    topLanguages: computed(() => data.value.topLanguages),
    streakAndTotal: computed(() => data.value.streakAndTotal),
    footer: computed(() => data.value.footer),
  };
};
