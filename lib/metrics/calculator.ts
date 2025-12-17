import type {
  GitHubContributionsResponse,
  WrappedData,
  WrappedStats,
  WrappedHighlights,
  WrappedRepositories,
  WrappedLanguages,
  TopRepository,
  LanguageStat,
  ContributionDay,
  MonthlyHighlight,
} from "@/lib/types";
import { calculatePersonality } from "./personality";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function calculateWrappedData(
  response: GitHubContributionsResponse,
  year: number
): WrappedData {
  const { user } = response;
  const { contributionsCollection, repositories } = user;

  // Flatten contribution calendar
  const calendar: ContributionDay[] = contributionsCollection.contributionCalendar.weeks.flatMap(
    (week) => week.contributionDays
  );

  // Calculate stats (now includes social, repos, and stars)
  const stats = calculateStats(contributionsCollection, calendar, user, repositories);

  // Calculate highlights
  const highlights = calculateHighlights(calendar);

  // Calculate top repositories
  const repos = calculateRepositories(
    contributionsCollection.commitContributionsByRepository
  );

  // Calculate languages (now includes code size)
  const languages = calculateLanguages(
    contributionsCollection.commitContributionsByRepository,
    repositories.nodes
  );

  // Calculate personality
  const personality = calculatePersonality(stats, highlights, languages, repos);

  // Calculate review stats
  const reviewStats = calculateReviewStats(
    contributionsCollection,
    contributionsCollection.commitContributionsByRepository
  );

  return {
    user: {
      username: user.login,
      name: user.name,
      avatarUrl: user.avatarUrl,
      memberSince: new Date(user.createdAt).getFullYear().toString(),
      bio: user.bio,
    },
    year,
    stats,
    highlights,
    repositories: repos,
    languages,
    personality,
    calendar,
    reviewStats,
    generatedAt: new Date().toISOString(),
  };
}

function calculateStats(
  contributions: GitHubContributionsResponse["user"]["contributionsCollection"],
  calendar: ContributionDay[],
  user: GitHubContributionsResponse["user"],
  repositories: GitHubContributionsResponse["user"]["repositories"]
): WrappedStats {
  const activeDays = calendar.filter((day) => day.contributionCount > 0).length;
  const totalDays = calendar.length;
  const idleDays = totalDays - activeDays;

  // Calculate streaks
  const { longestStreak, currentStreak } = calculateStreaks(calendar);

  // Public vs Private commits
  const publicCommits = contributions.totalCommitContributions;
  const privateCommits = contributions.restrictedContributionsCount;

  // Social stats
  const followers = user.followers?.totalCount || 0;
  const following = user.following?.totalCount || 0;

  // Repository stats
  const totalReposOwned = repositories.totalCount || 0;
  const publicReposOwned = repositories.nodes.filter((repo) => !repo.isPrivate).length;
  const privateReposOwned = totalReposOwned - publicReposOwned;

  // Stars stats
  const allRepos = [
    ...contributions.commitContributionsByRepository.map((c) => c.repository),
    ...repositories.nodes,
  ];
  
  // Remove duplicates by full name
  const uniqueRepos = new Map<string, typeof allRepos[0]>();
  for (const repo of allRepos) {
    const key = `${repo.owner?.login || 'unknown'}/${repo.name}`;
    if (!uniqueRepos.has(key)) {
      uniqueRepos.set(key, repo);
    }
  }

  const reposArray = Array.from(uniqueRepos.values());
  const totalStars = reposArray.reduce(
    (sum, repo) => sum + (repo.stargazerCount || 0),
    0
  );
  const averageStarsPerRepo = reposArray.length > 0 ? Math.round((totalStars / reposArray.length) * 10) / 10 : 0;

  // Find most starred repo
  let mostStarredRepo: { name: string; owner: string; stars: number } | null = null;
  let maxStars = 0;
  for (const repo of reposArray) {
    const stars = repo.stargazerCount || 0;
    if (stars > maxStars) {
      maxStars = stars;
      mostStarredRepo = {
        name: repo.name,
        owner: repo.owner?.login || 'unknown',
        stars,
      };
    }
  }

  return {
    totalCommits: publicCommits + privateCommits,
    publicCommits,
    privateCommits,
    totalPRs: contributions.totalPullRequestContributions,
    totalIssues: contributions.totalIssueContributions,
    totalReviews: contributions.totalPullRequestReviewContributions,
    activeDays,
    idleDays,
    longestStreak,
    currentStreak,
    totalReposContributed: contributions.totalRepositoriesWithContributedCommits,
    // Social stats
    followers,
    following,
    // Repository stats
    totalReposOwned,
    publicReposOwned,
    privateReposOwned,
    // Stars stats
    totalStars,
    averageStarsPerRepo,
    mostStarredRepo,
  };
}

function calculateStreaks(
  calendar: ContributionDay[]
): { longestStreak: number; currentStreak: number } {
  let longestStreak = 0;
  let currentStreak = 0;
  let tempStreak = 0;

  // Sort by date to ensure correct order
  const sortedCalendar = [...calendar].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  for (let i = 0; i < sortedCalendar.length; i++) {
    const day = sortedCalendar[i];

    if (day.contributionCount > 0) {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }

  // Calculate current streak (from most recent day backwards)
  for (let i = sortedCalendar.length - 1; i >= 0; i--) {
    const day = sortedCalendar[i];
    // Skip future dates
    if (new Date(day.date) > new Date()) continue;

    if (day.contributionCount > 0) {
      currentStreak++;
    } else {
      // Allow one day gap for "today not yet committed"
      const today = new Date().toISOString().split("T")[0];
      if (day.date === today) continue;
      break;
    }
  }

  return { longestStreak, currentStreak };
}

function calculateHighlights(calendar: ContributionDay[]): WrappedHighlights {
  // Group commits by month
  const commitsByMonth: Record<number, number> = {};
  const commitsByDayOfWeek: Record<string, number> = {};

  for (const day of calendar) {
    const date = new Date(day.date);
    const monthIndex = date.getMonth();
    const dayOfWeek = DAYS[date.getDay()];

    commitsByMonth[monthIndex] = (commitsByMonth[monthIndex] || 0) + day.contributionCount;
    commitsByDayOfWeek[dayOfWeek] = (commitsByDayOfWeek[dayOfWeek] || 0) + day.contributionCount;
  }

  // Find most productive month
  let mostProductiveMonth: MonthlyHighlight = {
    month: MONTHS[0],
    monthIndex: 0,
    commits: 0,
  };

  for (const [monthIndex, commits] of Object.entries(commitsByMonth)) {
    if (commits > mostProductiveMonth.commits) {
      mostProductiveMonth = {
        month: MONTHS[parseInt(monthIndex)],
        monthIndex: parseInt(monthIndex),
        commits,
      };
    }
  }

  // Find most productive day of week
  let mostProductiveDay = "Monday";
  let maxDayCommits = 0;

  for (const [day, commits] of Object.entries(commitsByDayOfWeek)) {
    if (commits > maxDayCommits) {
      maxDayCommits = commits;
      mostProductiveDay = day;
    }
  }

  // Calculate average commits per active day
  const activeDays = calendar.filter((day) => day.contributionCount > 0).length;
  const totalCommits = calendar.reduce((sum, day) => sum + day.contributionCount, 0);
  const averageCommitsPerActiveDay = activeDays > 0 ? Math.round((totalCommits / activeDays) * 10) / 10 : 0;

  return {
    mostProductiveMonth,
    mostProductiveDay,
    averageCommitsPerActiveDay,
    commitsByDayOfWeek,
  };
}

function calculateRepositories(
  commitContributions: GitHubContributionsResponse["user"]["contributionsCollection"]["commitContributionsByRepository"]
): WrappedRepositories {
  const topRepos: TopRepository[] = commitContributions
    .map((contrib) => ({
      name: contrib.repository.name,
      owner: contrib.repository.owner.login,
      fullName: `${contrib.repository.owner.login}/${contrib.repository.name}`,
      commits: contrib.contributions.totalCount,
      language: contrib.repository.primaryLanguage?.name || null,
      languageColor: contrib.repository.primaryLanguage?.color || null,
      stars: contrib.repository.stargazerCount,
      isPrivate: contrib.repository.isPrivate,
    }))
    .sort((a, b) => b.commits - a.commits)
    .slice(0, 5);

  return {
    top: topRepos,
    totalContributed: commitContributions.length,
  };
}

function calculateLanguages(
  commitContributions: GitHubContributionsResponse["user"]["contributionsCollection"]["commitContributionsByRepository"],
  repositories: GitHubContributionsResponse["user"]["repositories"]["nodes"]
): WrappedLanguages {
  // Weight languages by commits and track code size
  const languageCommits: Record<string, { commits: number; color: string; codeSize: number }> = {};

  for (const contrib of commitContributions) {
    const lang = contrib.repository.primaryLanguage;
    if (lang) {
      if (!languageCommits[lang.name]) {
        languageCommits[lang.name] = { commits: 0, color: lang.color || "#8b949e", codeSize: 0 };
      }
      languageCommits[lang.name].commits += contrib.contributions.totalCount;
    }
  }

  // Also consider repository languages for more diversity and code size
  for (const repo of repositories) {
    if (repo.primaryLanguage) {
      const langName = repo.primaryLanguage.name;
      if (!languageCommits[langName]) {
        languageCommits[langName] = {
          commits: 1, // Minimal weight for repos without commits in timeframe
          color: repo.primaryLanguage.color || "#8b949e",
          codeSize: 0,
        };
      }
      
      // Add code size from languages edges if available
      if (repo.languages?.edges) {
        for (const edge of repo.languages.edges) {
          if (edge.node.name === langName) {
            languageCommits[langName].codeSize += edge.size || 0;
          }
        }
      }
    }
  }

  // Calculate percentages
  const totalCommits = Object.values(languageCommits).reduce(
    (sum, lang) => sum + lang.commits,
    0
  );

  const languageStats: LanguageStat[] = Object.entries(languageCommits)
    .map(([name, data]) => ({
      name,
      percentage: totalCommits > 0 ? Math.round((data.commits / totalCommits) * 100) : 0,
      color: data.color,
      commits: data.commits,
      codeSize: data.codeSize > 0 ? data.codeSize : undefined,
    }))
    .sort((a, b) => b.commits - a.commits)
    .slice(0, 6);

  // Ensure percentages add up to ~100
  const totalPercentage = languageStats.reduce((sum, lang) => sum + lang.percentage, 0);
  if (totalPercentage > 0 && languageStats.length > 0) {
    const diff = 100 - totalPercentage;
    languageStats[0].percentage += diff;
  }

  return {
    top: languageStats,
    total: Object.keys(languageCommits).length,
    primary: languageStats[0]?.name || "Unknown",
  };
}

function calculateReviewStats(
  contributions: GitHubContributionsResponse["user"]["contributionsCollection"],
  commitContributions: GitHubContributionsResponse["user"]["contributionsCollection"]["commitContributionsByRepository"]
): { totalReviews: number; reviewsPerPR: number; mostReviewedRepo: string | null } {
  const totalReviews = contributions.totalPullRequestReviewContributions;
  const totalPRs = contributions.totalPullRequestContributions;
  const reviewsPerPR = totalPRs > 0 ? Math.round((totalReviews / totalPRs) * 10) / 10 : 0;

  // Find most reviewed repo (we'll use the repo with most PRs as a proxy)
  // In a real implementation, we'd need PR review data per repo
  const repoPRCounts: Record<string, number> = {};
  for (const contrib of commitContributions) {
    const repoName = `${contrib.repository.owner.login}/${contrib.repository.name}`;
    repoPRCounts[repoName] = (repoPRCounts[repoName] || 0) + contrib.contributions.totalCount;
  }

  let mostReviewedRepo: string | null = null;
  let maxCount = 0;
  for (const [repoName, count] of Object.entries(repoPRCounts)) {
    if (count > maxCount) {
      maxCount = count;
      mostReviewedRepo = repoName;
    }
  }

  return {
    totalReviews,
    reviewsPerPR,
    mostReviewedRepo,
  };
}

