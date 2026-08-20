export interface GithubProfile {
  name: string;
  firstName: string;
  lastName: string;
  login: string;
  avatarUrl: string;
  location: string;
  bio: string;
  tagline?: string;
  url: string;
  tags?: string[];
  lastUpdated: string;
}

export interface SparklineStat {
  value: number;
  display: string;
  trendPercent: number;
  label: string;
  sparkline: number[];
}

export interface CommitQualityStat {
  grade: string;
  ratingLabel: string;
  scoreDots: number;
  maxDots: number;
}

export interface GithubStats {
  contributions: SparklineStat;
  repositories: SparklineStat;
  starsEarned: SparklineStat;
  followers: SparklineStat;
  commitQuality: CommitQualityStat;
}

export interface ContributionDay {
  date: string;
  count: number;
  githubCount?: number;
  gitlabCount?: number;
  level: number;
  weekday: number;
}

export interface ContributionWeek {
  days: ContributionDay[];
}

export interface ContributionMonth {
  name: string;
  startWeekIndex: number;
}

export interface ContributionActivity {
  totalLastYear: number;
  githubContributions?: number;
  gitlabContributions?: number;
  weeks: ContributionWeek[];
  months: ContributionMonth[];
}

export interface LanguageStat {
  name: string;
  percentage: number;
  color: string;
  otherLanguages?: string[];
}

export interface StreakAndTotal {
  longestStreakDays: number;
  currentStreakDays: number;
  activeDaysOfWeek: boolean[];
  totalContributionsYear: number;
  monthlyBars: number[];
}

export interface AchievementBadge {
  label: string;
  icon: string;
}

export interface GithubFooterData {
  quote: string;
  quoteAuthor: string;
  badges?: AchievementBadge[];
  lastUpdated: string;
}

export interface GithubDashboardData {
  profile: GithubProfile;
  stats: GithubStats;
  contributions: ContributionActivity;
  topLanguages: LanguageStat[];
  streakAndTotal: StreakAndTotal;
  footer: GithubFooterData;
}
