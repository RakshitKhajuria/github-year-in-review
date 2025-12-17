import type { GitHubContributionsResponse, ContributionDay } from "@/lib/types";

const GITHUB_REST_API = "https://api.github.com";

interface GitHubRestUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  created_at: string;
  followers: number;
  following: number;
  public_repos: number;
}

interface GitHubRestRepo {
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  language: string | null;
  stargazers_count: number;
  private: boolean;
  languages_url: string;
}

interface GitHubRestCommit {
  sha: string;
  commit: {
    author: {
      date: string;
    };
    message: string;
  };
}

/**
 * Fetch user data using REST API (no auth required for public data)
 */
export async function fetchUserRest(username: string): Promise<GitHubRestUser> {
  const response = await fetch(`${GITHUB_REST_API}/users/${username}`, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "GitHubWrapped/1.0",
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`User "${username}" not found`);
    }
    throw new Error(`Failed to fetch user: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch user repositories using REST API
 */
export async function fetchUserReposRest(
  username: string,
  token?: string
): Promise<GitHubRestRepo[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "GitHubWrapped/1.0",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const repos: GitHubRestRepo[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const response = await fetch(
      `${GITHUB_REST_API}/users/${username}/repos?per_page=${perPage}&page=${page}&sort=pushed&direction=desc`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch repos: ${response.statusText}`);
    }

    const pageRepos: GitHubRestRepo[] = await response.json();
    if (pageRepos.length === 0) break;

    repos.push(...pageRepos);
    if (pageRepos.length < perPage) break;
    page++;
  }

  return repos;
}

/**
 * Fetch user contributions using GitHub Search API
 * This is more reliable for historical data than events API
 */
async function fetchUserContributions(
  username: string,
  year: number
): Promise<{
  commitsByDate: Record<string, number>;
  commitsByRepo: Record<string, number>;
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
}> {
  const commitsByDate: Record<string, number> = {};
  const commitsByRepo: Record<string, number> = {};
  let totalCommits = 0;
  let totalPRs = 0;
  let totalIssues = 0;

  try {
    // Use GitHub Search API to find commits by the user in the specified year
    const commitsResponse = await fetch(
      `${GITHUB_REST_API}/search/commits?q=author:${username}+author-date:${year}-01-01..${year}-12-31&per_page=100`,
      {
        headers: {
          Accept: "application/vnd.github.cloak-preview",
          "User-Agent": "GitHubWrapped/1.0",
        },
      }
    );

    if (commitsResponse.ok) {
      const commitsData = await commitsResponse.json();
      totalCommits = commitsData.total_count;

      // Process commit details for date and repo breakdown
      for (const commit of commitsData.items || []) {
        const date = commit.commit.author.date.split('T')[0]; // Extract date part
        const repoName = commit.repository.full_name;

        commitsByDate[date] = (commitsByDate[date] || 0) + 1;
        commitsByRepo[repoName] = (commitsByRepo[repoName] || 0) + 1;
      }

      // If we have more than 100 commits, we need to paginate or estimate
      if (totalCommits > 100) {
        // For large numbers, we'll estimate the distribution
        // This is a limitation of the search API (max 1000 results)
        console.log(`User has ${totalCommits} commits in ${year}, showing sample of ${commitsData.items?.length || 0}`);
      }
    }

    // Search for Pull Requests
    const prsResponse = await fetch(
      `${GITHUB_REST_API}/search/issues?q=author:${username}+type:pr+created:${year}-01-01..${year}-12-31&per_page=100`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "GitHubWrapped/1.0",
        },
      }
    );

    if (prsResponse.ok) {
      const prsData = await prsResponse.json();
      totalPRs = prsData.total_count;
    }

    // Search for Issues
    const issuesResponse = await fetch(
      `${GITHUB_REST_API}/search/issues?q=author:${username}+type:issue+created:${year}-01-01..${year}-12-31&per_page=100`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "GitHubWrapped/1.0",
        },
      }
    );

    if (issuesResponse.ok) {
      const issuesData = await issuesResponse.json();
      totalIssues = issuesData.total_count;
    }

  } catch (error) {
    console.error("GitHub Search API failed:", error);
    
    // Fallback to events API for recent data
    try {
      const response = await fetch(
        `${GITHUB_REST_API}/users/${username}/events/public?per_page=100`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "GitHubWrapped/1.0",
          },
        }
      );

      if (response.ok) {
        const events: any[] = await response.json();
        const yearStart = new Date(year, 0, 1);
        const yearEnd = new Date(year, 11, 31, 23, 59, 59);

        for (const event of events) {
          const eventDate = new Date(event.created_at);
          
          if (eventDate >= yearStart && eventDate <= yearEnd) {
            const dateStr = eventDate.toISOString().split("T")[0];

            if (event.type === "PushEvent") {
              const commitCount = event.payload.commits?.length || 0;
              totalCommits += commitCount;
              commitsByDate[dateStr] = (commitsByDate[dateStr] || 0) + commitCount;
              const repoName = event.repo.name;
              commitsByRepo[repoName] = (commitsByRepo[repoName] || 0) + commitCount;
            } else if (event.type === "PullRequestEvent") {
              totalPRs++;
            } else if (event.type === "IssuesEvent") {
              totalIssues++;
            }
          }
        }
      }
    } catch (fallbackError) {
      console.warn("Fallback events API also failed:", fallbackError);
    }
  }

  return { commitsByDate, commitsByRepo, totalCommits, totalPRs, totalIssues };
}

/**
 * Build contribution calendar from commits
 */
function buildContributionCalendar(
  commitsByDate: Record<string, number>,
  year: number
): ContributionDay[] {
  const calendar: ContributionDay[] = [];
  const startDate = new Date(Date.UTC(year, 0, 1));
  const endDate = new Date(Date.UTC(year, 11, 31, 23, 59, 59));

  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split("T")[0];
    calendar.push({
      date: dateStr,
      contributionCount: commitsByDate[dateStr] || 0,
      weekday: currentDate.getUTCDay(),
    });
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  return calendar;
}

/**
 * Fetch contributions using REST API (works without auth for public repos)
 */
export async function fetchContributionsRest(
  username: string,
  year: number,
  token?: string
): Promise<Partial<GitHubContributionsResponse>> {
  const { from, to } = {
    from: new Date(Date.UTC(year, 0, 1)).toISOString(),
    to: new Date(Date.UTC(year, 11, 31, 23, 59, 59)).toISOString(),
  };

  // Fetch user
  const user = await fetchUserRest(username);

  // Fetch user contributions (commits, PRs, issues) - no auth needed for public
  const events = await fetchUserContributions(username, year);

  // Fetch repositories for language data
  const repos = await fetchUserReposRest(username, token);
  const accessibleRepos = token ? repos : repos.filter((repo) => !repo.private);

  // Build repo contributions from events
  const repoContributions: Array<{
    repository: {
      name: string;
      owner: { login: string };
      primaryLanguage: { name: string; color: string | null } | null;
      stargazerCount: number;
      isPrivate: boolean;
    };
    contributions: { totalCount: number };
  }> = [];

  // Map repo names to repo data
  const repoMap = new Map<string, GitHubRestRepo>();
  for (const repo of accessibleRepos) {
    repoMap.set(repo.full_name, repo);
  }

  // Build contributions by repo
  for (const [repoName, commitCount] of Object.entries(events.commitsByRepo)) {
    const repo = repoMap.get(repoName);
    if (repo && commitCount > 0) {
      repoContributions.push({
        repository: {
          name: repo.name,
          owner: { login: repo.owner.login },
          primaryLanguage: repo.language
            ? { name: repo.language, color: null }
            : null,
          stargazerCount: repo.stargazers_count,
          isPrivate: repo.private,
        },
        contributions: { totalCount: commitCount },
      });
    }
  }

  // Sort by commit count
  repoContributions.sort((a, b) => b.contributions.totalCount - a.contributions.totalCount);

  // Build calendar
  const calendar = buildContributionCalendar(events.commitsByDate, year);

  // Group calendar into weeks (simplified)
  const weeks: Array<{ contributionDays: ContributionDay[] }> = [];
  let currentWeek: ContributionDay[] = [];
  
  for (const day of calendar) {
    currentWeek.push(day);
    if (day.weekday === 6 || currentWeek.length === 7) {
      // Sunday or full week
      weeks.push({ contributionDays: currentWeek });
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    weeks.push({ contributionDays: currentWeek });
  }

  return {
    user: {
      login: user.login,
      name: user.name,
      avatarUrl: user.avatar_url,
      bio: user.bio,
      createdAt: user.created_at,
      followers: { totalCount: user.followers },
      following: { totalCount: user.following },
      contributionsCollection: {
        totalCommitContributions: events.totalCommits,
        totalPullRequestContributions: events.totalPRs,
        totalIssueContributions: events.totalIssues,
        totalPullRequestReviewContributions: 0,
        totalRepositoriesWithContributedCommits: repoContributions.length,
        restrictedContributionsCount: 0,
        contributionCalendar: {
          totalContributions: events.totalCommits,
          weeks,
        },
        commitContributionsByRepository: repoContributions.slice(0, 100),
      },
      repositories: {
        totalCount: accessibleRepos.length,
        nodes: accessibleRepos.slice(0, 100).map((repo) => ({
          name: repo.name,
          owner: { login: repo.owner.login },
          primaryLanguage: repo.language
            ? { name: repo.language, color: null }
            : null,
          stargazerCount: repo.stargazers_count,
          isPrivate: repo.private,
          languages: { edges: [] },
        })),
      },
    },
  };
}

