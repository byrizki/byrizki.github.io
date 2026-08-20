import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_PATH = path.resolve(__dirname, "../app/assets/github-data.json");

// Load .env file manually if exists
function loadEnv() {
  const envPath = path.resolve(__dirname, "../.env");
  if (fs.existsSync(envPath)) {
    try {
      const lines = fs.readFileSync(envPath, "utf-8").split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const idx = trimmed.indexOf("=");
        if (idx !== -1) {
          const key = trimmed.substring(0, idx).trim();
          const val = trimmed.substring(idx + 1).trim();
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    } catch {
      // Ignore env read errors
    }
  }
}
loadEnv();

const GITHUB_USERNAME = "byrizki";
const GITLAB_URL = process.env.GITLAB_URL || "https://oktapod.quadrant-si.id";
const GITLAB_PAT = process.env.GITLAB_PAT;

function getGithubToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  if (process.env.GH_TOKEN) return process.env.GH_TOKEN;
  try {
    const token = execSync("gh auth token", { encoding: "utf-8" }).trim();
    if (token) return token;
  } catch {
    // gh not available or not logged in
  }
  return null;
}

const GITHUB_VIEWER_QUERY = `
query {
  viewer {
    name
    login
    avatarUrl
    location
    bio
    url
    createdAt
    followers {
      totalCount
    }
    repositories(first: 100, ownerAffiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER], orderBy: {field: UPDATED_AT, direction: DESC}) {
      totalCount
      nodes {
        name
        stargazerCount
        isPrivate
        isFork
        primaryLanguage {
          name
          color
        }
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          edges {
            size
            node {
              name
              color
            }
          }
        }
      }
    }
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            color
            weekday
          }
        }
      }
    }
  }
}
`;

const GITHUB_USER_QUERY = `
query ($login: String!) {
  user(login: $login) {
    name
    login
    avatarUrl
    location
    bio
    url
    createdAt
    followers {
      totalCount
    }
    repositories(first: 100, ownerAffiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER], orderBy: {field: UPDATED_AT, direction: DESC}) {
      totalCount
      nodes {
        name
        stargazerCount
        isPrivate
        isFork
        primaryLanguage {
          name
          color
        }
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          edges {
            size
            node {
              name
              color
            }
          }
        }
      }
    }
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            color
            weekday
          }
        }
      }
    }
  }
}
`;

const LANGUAGE_COLOR_MAP = {
  TypeScript: "#3178c6",
  TSX: "#3178c6",
  "C#": "#178600",
  JavaScript: "#f7df1e",
  JSX: "#f7df1e",
  Vue: "#41b883",
  Kotlin: "#A97BFF",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  Swift: "#F05138",
  PHP: "#4F5D95",
  Ruby: "#701516",
  HTML: "#e34c26",
  "HTML+Razor": "#178600",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Shell: "#89e051",
  PowerShell: "#012456",
  Groovy: "#4298b8",
  Dart: "#00B4AB",
  Other: "#8b949e",
};

function normalizeLanguageName(name) {
  if (name === "TSX") return "TypeScript";
  if (name === "JSX") return "JavaScript";
  if (name === "HTML+Razor") return "C#";
  return name;
}

function calculateStreaks(allDays) {
  if (!allDays || allDays.length === 0) {
    return {
      longestStreak: 14,
      currentStreak: 1,
      activeDaysCount: 0,
      activeDaysOfWeek: [true, true, true, true, true, false, false],
    };
  }

  const sorted = [...allDays].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let activeDaysCount = 0;

  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].count > 0) {
      activeDaysCount++;
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }

  let i = sorted.length - 1;
  while (i >= 0 && sorted[i].count > 0) {
    currentStreak++;
    i--;
  }

  const weekdayTotals = [0, 0, 0, 0, 0, 0, 0];
  for (const day of sorted) {
    weekdayTotals[day.weekday] += day.count || 0;
  }

  const monToSunIndices = [1, 2, 3, 4, 5, 6, 0];
  const activeDaysOfWeek = monToSunIndices.map((idx) => weekdayTotals[idx] > 0);

  return {
    longestStreak: Math.max(longestStreak, 14),
    currentStreak: Math.max(currentStreak, 1),
    activeDaysCount,
    activeDaysOfWeek,
  };
}

function calculateCombinedLanguages(githubRepos, gitlabLangsList) {
  const langScoreMap = {};

  // 1. Process GitHub public + private repositories
  for (const repo of githubRepos || []) {
    if (!repo) continue;
    if (repo.languages && repo.languages.edges && repo.languages.edges.length > 0) {
      const repoTotalBytes = repo.languages.edges.reduce((s, e) => s + e.size, 0) || 1;
      for (const edge of repo.languages.edges) {
        const rawName = edge.node.name;
        const name = normalizeLanguageName(rawName);
        const ratio = edge.size / repoTotalBytes;
        // Each repo contributes up to 100 points
        langScoreMap[name] = (langScoreMap[name] || 0) + ratio * 100;
      }
    } else if (repo.primaryLanguage) {
      const rawName = repo.primaryLanguage.name;
      const name = normalizeLanguageName(rawName);
      langScoreMap[name] = (langScoreMap[name] || 0) + 100;
    }
  }

  // 2. Process GitLab enterprise projects languages (public + private)
  for (const projectLangs of gitlabLangsList || []) {
    if (!projectLangs || typeof projectLangs !== "object") continue;
    for (const [rawName, percentage] of Object.entries(projectLangs)) {
      const name = normalizeLanguageName(rawName);
      // Each GitLab project contributes its exact percentage in points
      langScoreMap[name] = (langScoreMap[name] || 0) + percentage;
    }
  }

  const sortedLangs = Object.entries(langScoreMap)
    .map(([name, score]) => ({ name, score, color: LANGUAGE_COLOR_MAP[name] || "#8b949e" }))
    .sort((a, b) => b.score - a.score);

  const totalScore = sortedLangs.reduce((acc, item) => acc + item.score, 0) || 1;

  // Take top 5 primary languages
  const top5 = sortedLangs.slice(0, 5);
  const others = sortedLangs.slice(5);
  const otherScore = others.reduce((acc, item) => acc + item.score, 0);
  const otherLangNames = others.map((o) => o.name);

  const result = top5.map((item) => ({
    name: item.name,
    percentage: Number(((item.score / totalScore) * 100).toFixed(1)),
    color: LANGUAGE_COLOR_MAP[item.name] || item.color || "#8b949e",
  }));

  if (otherScore > 0) {
    const otherPct = Number(((otherScore / totalScore) * 100).toFixed(1));
    result.push({
      name: "Other",
      percentage: otherPct,
      color: "#8b949e",
      otherLanguages: otherLangNames.slice(0, 8),
    });
  }

  const currentSum = result.reduce((acc, item) => acc + item.percentage, 0);
  if (result.length > 0 && Math.abs(currentSum - 100) > 0.01) {
    result[0].percentage = Number((result[0].percentage + (100 - currentSum)).toFixed(1));
  }

  return result;
}

function calculateMonthlyBars(allDays) {
  const monthsData = {};
  for (const day of allDays || []) {
    const ym = day.date.substring(0, 7);
    monthsData[ym] = (monthsData[ym] || 0) + (day.count || 0);
  }
  const keys = Object.keys(monthsData).sort();
  const recentMonths = keys.slice(-10);
  const values = recentMonths.map((k) => monthsData[k]);
  const maxVal = Math.max(...values, 1);
  return values.map((v) => Math.max(15, Math.round((v / maxVal) * 100)));
}

function getLevelFromCount(count) {
  if (count <= 0) return 0;
  if (count <= 3) return 1;
  if (count <= 8) return 2;
  if (count <= 18) return 3;
  return 4;
}

// Calculate Commit Quality dynamically from actual contribution data
function calculateCommitQuality(totalContributions, activeDaysCount, longestStreak) {
  // 1. Active days ratio (e.g. 145 / 365 = 0.40)
  const activeDaysRatio = Math.min(activeDaysCount / 365, 1.0);
  // 2. Streak factor (20 days streak / 30 = 0.67)
  const streakFactor = Math.min(longestStreak / 30, 1.0);
  // 3. Volume intensity (11.7k / 5000 = 1.0)
  const volumeFactor = Math.min(totalContributions / 5000, 1.0);

  // Composite Score out of 100
  const score = Math.round((activeDaysRatio * 40 + streakFactor * 30 + volumeFactor * 30));

  let grade = "A+";
  let ratingLabel = "High consistency";
  let scoreDots = 6;

  if (score >= 80) {
    grade = "A+";
    ratingLabel = "High consistency";
    scoreDots = 6;
  } else if (score >= 65) {
    grade = "A";
    ratingLabel = "Very consistent";
    scoreDots = 5;
  } else if (score >= 50) {
    grade = "B+";
    ratingLabel = "Consistent contributor";
    scoreDots = 4;
  } else {
    grade = "B";
    ratingLabel = "Active contributor";
    scoreDots = 3;
  }

  return {
    grade,
    ratingLabel,
    scoreDots,
    maxDots: 6,
  };
}

async function fetchGitlabData() {
  if (!GITLAB_PAT) {
    console.log("[build-data] Note: No GITLAB_PAT found, skipping GitLab.");
    return null;
  }

  try {
    const base = `${GITLAB_URL.replace(/\/$/, "")}/api/v4`;
    const headers = { "PRIVATE-TOKEN": GITLAB_PAT };

    console.log(`[build-data] Fetching GitLab data from ${GITLAB_URL}...`);

    // 1. Fetch User Profile
    const userRes = await fetch(`${base}/user`, {
      headers,
      signal: AbortSignal.timeout(10000),
    });

    if (userRes.status === 401 || userRes.status === 403) {
      console.warn(`[build-data] GitLab Unauthorized/Forbidden (HTTP ${userRes.status}). Check GITLAB_PAT.`);
      return null;
    }

    if (!userRes.ok) {
      console.warn(`[build-data] GitLab /user returned HTTP ${userRes.status}: ${userRes.statusText}`);
      return null;
    }

    const user = await userRes.json();
    if (!user || !user.id) return null;

    // 2. Fetch Projects (Public + Private Membership)
    let totalProjects = 0;
    let projectsList = [];
    try {
      const projectsRes = await fetch(`${base}/projects?membership=true&per_page=50&order_by=last_activity_at`, {
        headers,
        signal: AbortSignal.timeout(10000),
      });
      if (projectsRes.ok) {
        const headerTotal = projectsRes.headers.get("x-total");
        if (headerTotal) {
          totalProjects = parseInt(headerTotal, 10);
        }
        projectsList = await projectsRes.json();
        if (!totalProjects && Array.isArray(projectsList)) {
          totalProjects = projectsList.length;
        }
      }
    } catch (projErr) {
      console.warn("[build-data] Could not fetch GitLab projects:", projErr.message);
    }

    // 2b. Fetch Languages for top active GitLab projects (both public & private)
    const projectLanguages = [];
    if (Array.isArray(projectsList)) {
      for (const p of projectsList.slice(0, 30)) {
        try {
          const lRes = await fetch(`${base}/projects/${p.id}/languages`, {
            headers,
            signal: AbortSignal.timeout(5000),
          });
          if (lRes.ok) {
            const lJson = await lRes.json();
            if (lJson && Object.keys(lJson).length > 0) {
              projectLanguages.push(lJson);
            }
          }
        } catch {
          // ignore individual project language error
        }
      }
    }

    // 3. Fetch User Events in the past 1 year
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const afterDate = oneYearAgo.toISOString().split("T")[0];

    let page = 1;
    let allEvents = [];
    while (page <= 15) {
      try {
        const evRes = await fetch(`${base}/users/${user.id}/events?after=${afterDate}&per_page=100&page=${page}`, {
          headers,
          signal: AbortSignal.timeout(10000),
        });
        if (!evRes.ok) break;
        const events = await evRes.json();
        if (!Array.isArray(events) || events.length === 0) break;
        allEvents = allEvents.concat(events);
        const totalPages = parseInt(evRes.headers.get("x-total-pages") || "1", 10);
        if (page >= totalPages) break;
        page++;
      } catch {
        break;
      }
    }

    const dailyCounts = {};
    let totalCommits = 0;
    let totalMergeRequests = 0;

    for (const ev of allEvents) {
      const count = ev.push_data?.commit_count || 1;
      totalCommits += count;
      if (ev.action_name === "accepted" || ev.action_name === "opened") {
        totalMergeRequests++;
      }
      if (ev.created_at) {
        const d = ev.created_at.split("T")[0];
        dailyCounts[d] = (dailyCounts[d] || 0) + count;
      }
    }

    console.log(`[build-data] Successfully fetched GitLab: ${allEvents.length} events, ${totalCommits} commits, ${totalProjects} projects`);

    return {
      serverUrl: GITLAB_URL,
      username: user.username,
      name: user.name,
      totalProjects,
      totalContributions: totalCommits,
      totalMergeRequests,
      dailyCounts,
      projectLanguages,
    };
  } catch (err) {
    console.warn(`[build-data] GitLab fetch failed (${err.message}). Proceeding without GitLab.`);
    return null;
  }
}

async function fetchGithubData() {
  const token = getGithubToken();
  const headers = {
    "User-Agent": "portfolio-build-script",
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `bearer ${token}`;
  }

  console.log(`[build-data] Fetching GitHub data (public + private)...`);

  try {
    const query = token ? GITHUB_VIEWER_QUERY : GITHUB_USER_QUERY;
    const body = token ? { query } : { query, variables: { login: GITHUB_USERNAME } };

    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(12000),
    });

    if (res.status === 401 || res.status === 403) {
      console.warn(`[build-data] GitHub GraphQL Unauthorized/Rate Limited (HTTP ${res.status}). Attempting REST fallback...`);
      return await fetchGithubRestFallback();
    }

    if (!res.ok) {
      console.warn(`[build-data] GitHub GraphQL returned HTTP ${res.status}. Attempting REST fallback...`);
      return await fetchGithubRestFallback();
    }

    const json = await res.json();
    if (json.errors && json.errors.length > 0) {
      console.warn(`[build-data] GitHub GraphQL errors. Attempting REST fallback...`);
      return await fetchGithubRestFallback();
    }

    const user = json.data?.viewer || json.data?.user;
    if (!user) {
      console.warn(`[build-data] GitHub user data missing in GraphQL. Attempting REST fallback...`);
      return await fetchGithubRestFallback();
    }

    return user;
  } catch (err) {
    console.warn(`[build-data] GitHub GraphQL fetch error (${err.message}). Attempting REST fallback...`);
    return await fetchGithubRestFallback();
  }
}

async function fetchGithubRestFallback() {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
      headers: { "User-Agent": "portfolio-build-script" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const u = await res.json();
    return {
      name: u.name || "Muhamad Rizki",
      login: u.login || GITHUB_USERNAME,
      avatarUrl: u.avatar_url || "https://avatars.githubusercontent.com/u/15137312?v=4",
      location: u.location || "Jakarta",
      bio: u.bio || "A Tech Geek, Open Source Enthusiast's",
      url: u.html_url || `https://github.com/${GITHUB_USERNAME}`,
      followers: { totalCount: u.followers || 6 },
      repositories: {
        totalCount: u.public_repos || 128,
        nodes: [],
      },
      contributionsCollection: null,
    };
  } catch (err) {
    console.warn(`[build-data] GitHub REST fallback failed: ${err.message}`);
    return null;
  }
}

function generateDefaultWeeks() {
  const weeks = [];
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setDate(today.getDate() - 364);

  let cur = new Date(oneYearAgo);
  cur.setDate(cur.getDate() - cur.getDay());

  for (let w = 0; w < 53; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = cur.toISOString().split("T")[0];
      days.push({
        date: dateStr,
        count: 0,
        githubCount: 0,
        gitlabCount: 0,
        level: 0,
        weekday: cur.getDay(),
      });
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push({ days });
  }
  return weeks;
}

async function main() {
  let existingData = null;
  if (fs.existsSync(OUTPUT_PATH)) {
    try {
      existingData = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8"));
    } catch {
      // ignore
    }
  }

  const githubUser = await fetchGithubData();
  const gitlabData = await fetchGitlabData();

  if (!githubUser && !gitlabData && existingData) {
    console.log("[build-data] Both APIs failed. Preserving existing cached github-data.json.");
    return;
  }

  const calendar = githubUser?.contributionsCollection?.contributionCalendar;
  const rawWeeks = calendar?.weeks || (existingData?.contributions?.weeks ? null : generateDefaultWeeks());
  const repos = githubUser?.repositories?.nodes || [];

  const totalStars = repos.reduce((sum, r) => sum + (r.stargazerCount || 0), 0) || existingData?.stats?.starsEarned?.value || 32;
  const languages = calculateCombinedLanguages(repos, gitlabData?.projectLanguages);

  // Process Calendar days: combine GitHub and GitLab contributions
  const allDaysMerged = [];
  const baseWeeks = rawWeeks || existingData?.contributions?.weeks || generateDefaultWeeks();

  const weeksMerged = baseWeeks.map((w) => {
    const dayItems = w.contributionDays || w.days || [];
    return {
      days: dayItems.map((d) => {
        const ghCount = d.githubCount !== undefined ? d.githubCount : (d.contributionCount !== undefined ? d.contributionCount : (d.count || 0));
        const glCount = gitlabData?.dailyCounts?.[d.date] !== undefined
          ? gitlabData.dailyCounts[d.date]
          : (d.gitlabCount || 0);
        const totalCount = ghCount + glCount;
        const dayObj = {
          date: d.date,
          count: totalCount,
          githubCount: ghCount,
          gitlabCount: glCount,
          level: getLevelFromCount(totalCount),
          weekday: d.weekday,
        };
        allDaysMerged.push(dayObj);
        return dayObj;
      }),
    };
  });

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const months = [];
  let lastMonth = -1;

  weeksMerged.forEach((week, weekIndex) => {
    const firstDay = week.days[0];
    if (firstDay) {
      const monthNum = new Date(firstDay.date).getMonth();
      if (monthNum !== lastMonth) {
        months.push({
          name: monthNames[monthNum],
          startWeekIndex: weekIndex,
        });
        lastMonth = monthNum;
      }
    }
  });

  const streaks = calculateStreaks(allDaysMerged);
  const monthlyBars = calculateMonthlyBars(allDaysMerged);

  const ghTotalContributions = calendar?.totalContributions || existingData?.sources?.github?.contributions || 3204;
  const glTotalContributions = gitlabData?.totalContributions || existingData?.sources?.gitlab?.contributions || 0;
  const combinedContributions = ghTotalContributions + glTotalContributions;

  const ghTotalRepos = githubUser?.repositories?.totalCount || existingData?.sources?.github?.repositories || 128;
  const glTotalRepos = gitlabData?.totalProjects || existingData?.sources?.gitlab?.repositories || 0;
  const combinedRepos = ghTotalRepos + glTotalRepos;

  const rawName = githubUser?.name || existingData?.profile?.name || "Muhamad Rizki";
  const nameParts = rawName.trim().split(" ");
  const firstName = nameParts[0] || "Muhamad";
  const lastName = nameParts.slice(1).join(" ") || "Rizki";
  const nowIso = new Date().toISOString();

  const commitQuality = calculateCommitQuality(
    combinedContributions,
    streaks.activeDaysCount,
    streaks.longestStreak
  );

  const dashboardData = {
    profile: {
      name: rawName,
      firstName,
      lastName,
      login: githubUser?.login || existingData?.profile?.login || GITHUB_USERNAME,
      avatarUrl: githubUser?.avatarUrl || existingData?.profile?.avatarUrl || "https://avatars.githubusercontent.com/u/15137312?v=4",
      location: githubUser?.location || existingData?.profile?.location || "Jakarta",
      bio: githubUser?.bio || existingData?.profile?.bio || "A Tech Geek, Open Source Enthusiast's",
      url: githubUser?.url || existingData?.profile?.url || `https://github.com/${GITHUB_USERNAME}`,
      lastUpdated: nowIso,
    },
    sources: {
      github: {
        username: GITHUB_USERNAME,
        contributions: ghTotalContributions,
        repositories: ghTotalRepos,
        stars: totalStars,
        followers: githubUser?.followers?.totalCount || existingData?.sources?.github?.followers || 6,
      },
      gitlab: (gitlabData || existingData?.sources?.gitlab)
        ? {
            serverUrl: gitlabData?.serverUrl || existingData?.sources?.gitlab?.serverUrl || GITLAB_URL,
            username: gitlabData?.username || existingData?.sources?.gitlab?.username || "muhammad.rizky",
            contributions: glTotalContributions,
            repositories: glTotalRepos,
            mergeRequests: gitlabData?.totalMergeRequests || existingData?.sources?.gitlab?.mergeRequests || 0,
          }
        : null,
    },
    stats: {
      contributions: {
        value: combinedContributions,
        display: combinedContributions >= 1000 ? `${(combinedContributions / 1000).toFixed(1)}k` : combinedContributions.toString(),
        rawDisplay: combinedContributions.toLocaleString(),
        trendPercent: 24,
        label: "Contributions",
        subtitle: glTotalContributions > 0 ? `GitHub (${ghTotalContributions}) + GitLab (${glTotalContributions})` : "GitHub Total",
        sparkline: [10, 22, 35, 48, 65, 80, 95, 110],
      },
      repositories: {
        value: combinedRepos,
        display: combinedRepos.toString(),
        trendPercent: 18,
        label: "Repositories",
        subtitle: glTotalRepos > 0 ? `GitHub (${ghTotalRepos}) + GitLab (${glTotalRepos})` : "GitHub Public",
        sparkline: [40, 48, 60, 75, 90, 110, 130, combinedRepos],
      },
      starsEarned: {
        value: totalStars,
        display: totalStars >= 1000 ? `${(totalStars / 1000).toFixed(1)}k` : totalStars.toString(),
        trendPercent: 25,
        label: "Stars Earned",
        sparkline: [5, 8, 12, 15, 20, 25, 28, totalStars],
      },
      followers: {
        value: githubUser?.followers?.totalCount || existingData?.sources?.github?.followers || 6,
        display: (githubUser?.followers?.totalCount || existingData?.sources?.github?.followers || 6).toString(),
        trendPercent: 8,
        label: "Followers",
        sparkline: [1, 2, 2, 3, 4, 5, 5, githubUser?.followers?.totalCount || existingData?.sources?.github?.followers || 6],
      },
      commitQuality,
    },
    contributions: {
      totalLastYear: combinedContributions,
      githubContributions: ghTotalContributions,
      gitlabContributions: glTotalContributions,
      weeks: weeksMerged,
      months,
    },
    topLanguages: languages,
    streakAndTotal: {
      longestStreakDays: streaks.longestStreak,
      currentStreakDays: streaks.currentStreak,
      activeDaysOfWeek: streaks.activeDaysOfWeek,
      totalContributionsYear: combinedContributions,
      monthlyBars,
    },
    footer: {
      quote: "First, solve the problem. Then, write the code.",
      quoteAuthor: "John Johnson",
      lastUpdated: nowIso,
    },
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(dashboardData, null, 2), "utf-8");
  console.log(`[build-data] Successfully wrote combined dashboard data to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error("[build-data] Unexpected error during stats build:", err.message);
});
