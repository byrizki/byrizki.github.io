import githubDataRaw from "~/assets/github-data.json";
import type { GithubDashboardData } from "~/types/github";

export const useGithubData = () => {
  const data = ref<GithubDashboardData>(githubDataRaw as unknown as GithubDashboardData);

  const getRepoStars = (urlOrId: string | null): number | null => {
    if (!urlOrId) return null;
    const starsMap = data.value.repoStars;
    if (!starsMap) return null;
    if (typeof starsMap[urlOrId] === "number") {
      return starsMap[urlOrId];
    }
    // Also match by owner/repo extracted from URL
    const match = urlOrId.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (match && match[1] && match[2]) {
      const path = `${match[1]}/${match[2]}`;
      if (typeof starsMap[path] === "number") {
        return starsMap[path];
      }
    }
    return null;
  };

  const getRepoForks = (urlOrId: string | null): number | null => {
    if (!urlOrId) return null;
    const forksMap = data.value.repoForks;
    if (!forksMap) return null;
    if (typeof forksMap[urlOrId] === "number") {
      return forksMap[urlOrId];
    }
    // Also match by owner/repo extracted from URL
    const match = urlOrId.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (match && match[1] && match[2]) {
      const path = `${match[1]}/${match[2]}`;
      if (typeof forksMap[path] === "number") {
        return forksMap[path];
      }
    }
    return null;
  };

  return {
    data,
    profile: computed(() => data.value.profile),
    stats: computed(() => data.value.stats),
    contributions: computed(() => data.value.contributions),
    topLanguages: computed(() => data.value.topLanguages),
    repoStars: computed(() => data.value.repoStars || {}),
    repoForks: computed(() => data.value.repoForks || {}),
    streakAndTotal: computed(() => data.value.streakAndTotal),
    footer: computed(() => data.value.footer),
    getRepoStars,
    getRepoForks,
  };
};
