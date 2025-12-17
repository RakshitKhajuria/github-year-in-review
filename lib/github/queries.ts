export const USER_CONTRIBUTIONS_QUERY = `
query GetUserContributions($username: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $username) {
    login
    name
    avatarUrl
    bio
    createdAt
    followers {
      totalCount
    }
    following {
      totalCount
    }
    
    contributionsCollection(from: $from, to: $to) {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      totalPullRequestReviewContributions
      totalRepositoriesWithContributedCommits
      restrictedContributionsCount
      
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            weekday
          }
        }
      }
      
      commitContributionsByRepository(maxRepositories: 100) {
        repository {
          name
          owner {
            login
          }
          primaryLanguage {
            name
            color
          }
          stargazerCount
          isPrivate
        }
        contributions {
          totalCount
        }
      }
    }
    
    repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: PUSHED_AT, direction: DESC}) {
      totalCount
      nodes {
        name
        primaryLanguage {
          name
          color
        }
        isPrivate
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
  }
}
`;

export const USER_BASIC_QUERY = `
query GetUser($username: String!) {
  user(login: $username) {
    login
    name
    avatarUrl
    bio
    createdAt
    followers {
      totalCount
    }
    following {
      totalCount
    }
    repositories(ownerAffiliations: OWNER) {
      totalCount
    }
  }
}
`;

export const buildDateRange = (year: number): { from: string; to: string } => {
  const from = new Date(Date.UTC(year, 0, 1, 0, 0, 0)).toISOString();
  const to = new Date(Date.UTC(year, 11, 31, 23, 59, 59)).toISOString();
  return { from, to };
};

