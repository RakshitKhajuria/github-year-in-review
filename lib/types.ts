// GitHub API Types
export interface GitHubUser {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  createdAt: string;
  followers: {
    totalCount: number;
  };
  following: {
    totalCount: number;
  };
}

export interface ContributionDay {
  date: string;
  contributionCount: number;
  weekday: number;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export interface LanguageNode {
  name: string;
  color: string | null;
}

export interface LanguageEdge {
  size: number;
  node: LanguageNode;
}

export interface Repository {
  name: string;
  owner: {
    login: string;
  };
  primaryLanguage: LanguageNode | null;
  stargazerCount: number;
  isPrivate: boolean;
  languages?: {
    edges: LanguageEdge[];
  };
}

export interface CommitContribution {
  repository: Repository;
  contributions: {
    totalCount: number;
  };
}

export interface ContributionsCollection {
  totalCommitContributions: number;
  totalPullRequestContributions: number;
  totalIssueContributions: number;
  totalPullRequestReviewContributions: number;
  totalRepositoriesWithContributedCommits: number;
  restrictedContributionsCount: number;
  contributionCalendar: ContributionCalendar;
  commitContributionsByRepository: CommitContribution[];
}

export interface GitHubContributionsResponse {
  user: GitHubUser & {
    contributionsCollection: ContributionsCollection;
    repositories: {
      totalCount: number;
      nodes: Repository[];
    };
  };
}

// Wrapped Data Types
export interface WrappedUser {
  username: string;
  name: string | null;
  avatarUrl: string;
  memberSince: string;
  bio: string | null;
}

export interface WrappedStats {
  totalCommits: number;
  publicCommits: number;
  privateCommits: number;
  totalPRs: number;
  totalIssues: number;
  totalReviews: number;
  activeDays: number;
  idleDays: number;
  longestStreak: number;
  currentStreak: number;
  totalReposContributed: number;
  // Social stats
  followers: number;
  following: number;
  // Repository stats
  totalReposOwned: number;
  publicReposOwned: number;
  privateReposOwned: number;
  // Stars stats
  totalStars: number;
  averageStarsPerRepo: number;
  mostStarredRepo: {
    name: string;
    owner: string;
    stars: number;
  } | null;
}

export interface MonthlyHighlight {
  month: string;
  monthIndex: number;
  commits: number;
}

export interface WrappedHighlights {
  mostProductiveMonth: MonthlyHighlight;
  mostProductiveDay: string;
  averageCommitsPerActiveDay: number;
  commitsByDayOfWeek: Record<string, number>;
  commitsByHour?: Record<number, number>;
}

export interface TopRepository {
  name: string;
  owner: string;
  fullName: string;
  commits: number;
  language: string | null;
  languageColor: string | null;
  stars: number;
  isPrivate: boolean;
}

export interface WrappedRepositories {
  top: TopRepository[];
  totalContributed: number;
}

export interface LanguageStat {
  name: string;
  percentage: number;
  color: string;
  commits: number;
  codeSize?: number; // Bytes of code in this language
}

export interface WrappedLanguages {
  top: LanguageStat[];
  total: number;
  primary: string;
}

export interface PersonalityLabel {
  id: string;
  label: string;
  emoji: string;
  description: string;
  color: string;
}

export interface WrappedPersonality {
  primary: PersonalityLabel;
  badges: PersonalityLabel[];
}

export interface WrappedData {
  user: WrappedUser;
  year: number;
  stats: WrappedStats;
  highlights: WrappedHighlights;
  repositories: WrappedRepositories;
  languages: WrappedLanguages;
  personality: WrappedPersonality;
  calendar: ContributionDay[];
  generatedAt: string;
  // Review stats
  reviewStats?: {
    totalReviews: number;
    reviewsPerPR: number;
    mostReviewedRepo: string | null;
  };
}

// API Request/Response Types
export interface FetchContributionsRequest {
  username: string;
  year?: number;
  token?: string;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
  status: number;
}

export type ApiResponse<T> = T | ApiErrorResponse;

// Slide Types
export type SlideType =
  | "welcome"
  | "overview"
  | "commits"
  | "month"
  | "languages"
  | "repos"
  | "streak"
  | "personality"
  | "summary";

export interface Slide {
  id: SlideType;
  title: string;
  gradient: string;
}

// Form Types
export interface UsernameFormData {
  username: string;
  includePrivate: boolean;
  token?: string;
  year: number;
}

