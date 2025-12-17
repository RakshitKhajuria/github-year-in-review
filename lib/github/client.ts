import { GraphQLClient } from "graphql-request";
import {
  USER_CONTRIBUTIONS_QUERY,
  USER_BASIC_QUERY,
  buildDateRange,
} from "./queries";
import { fetchContributionsRest } from "./rest-client";
import type { GitHubUser, GitHubContributionsResponse } from "@/lib/types";

const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";

export function createGitHubClient(token?: string): GraphQLClient {
  // GitHub GraphQL API requires authentication
  // Without a token, we'll get a 401 error
  const headers: Record<string, string> = {
    "User-Agent": "GitHubWrapped/1.0",
  };
  
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }
  
  const client = new GraphQLClient(GITHUB_GRAPHQL_ENDPOINT, { headers });
  return client;
}

export async function fetchUserBasic(
  username: string,
  token?: string
): Promise<GitHubUser> {
  const client = createGitHubClient(token);

  const data = await client.request<{ user: GitHubUser }>(USER_BASIC_QUERY, {
    username,
  });

  if (!data.user) {
    throw new Error(`User "${username}" not found`);
  }

  return data.user;
}

export async function fetchUserContributions(
  username: string,
  year: number,
  token?: string
): Promise<GitHubContributionsResponse> {
  // If no token, use REST API (works for public data)
  if (!token) {
    const restData = await fetchContributionsRest(username, year);
    
    // Ensure the response matches the expected structure
    if (!restData.user) {
      throw new Error(`User "${username}" not found`);
    }

    return restData as GitHubContributionsResponse;
  }

  // If token provided, use GraphQL API (supports private repos)
  const client = createGitHubClient(token);
  const { from, to } = buildDateRange(year);

  try {
    const data = await client.request<GitHubContributionsResponse>(
      USER_CONTRIBUTIONS_QUERY,
      {
        username,
        from,
        to,
      }
    );

    if (!data || !data.user) {
      throw new Error(`User "${username}" not found`);
    }

    // Validate response structure
    if (!data.user.contributionsCollection) {
      throw new Error(`Invalid response structure: missing contributionsCollection`);
    }

    console.log("GraphQL response validated successfully");
    return data;
  } catch (error: any) {
    // Log the full error for debugging
    console.error("GraphQL request failed:", error);
    
    // graphql-request wraps errors, check for response errors
    if (error?.response?.errors) {
      const graphqlErrors = error.response.errors;
      console.error("GraphQL errors:", graphqlErrors);
      
      // Check for authentication errors
      const hasAuthError = graphqlErrors.some((e: any) => 
        e.message?.toLowerCase().includes("401") || 
        e.message?.toLowerCase().includes("bad credentials") ||
        e.message?.toLowerCase().includes("authentication")
      );
      
      if (hasAuthError) {
        console.warn("GraphQL auth failed, falling back to REST API for public data");
        const restData = await fetchContributionsRest(username, year);
        if (!restData.user) {
          throw new Error(`User "${username}" not found`);
        }
        return restData as GitHubContributionsResponse;
      }
      
      // Throw a more descriptive error
      throw new Error(graphqlErrors.map((e: any) => e.message).join(", "));
    }
    
    // If GraphQL fails with a regular error, check message
    if (error instanceof Error) {
      if (error.message.includes("401") || error.message.includes("Bad credentials")) {
        console.warn("GraphQL auth failed, falling back to REST API for public data");
        const restData = await fetchContributionsRest(username, year);
        if (!restData.user) {
          throw new Error(`User "${username}" not found`);
        }
        return restData as GitHubContributionsResponse;
      }
    }
    
    throw error;
  }
}

// Rate limit info from GitHub response headers
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
}

export async function checkRateLimit(
  token?: string
): Promise<RateLimitInfo | null> {
  try {
    const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({
        query: `query { rateLimit { limit remaining resetAt } }`,
      }),
    });

    const data = await response.json();

    if (data.data?.rateLimit) {
      return {
        limit: data.data.rateLimit.limit,
        remaining: data.data.rateLimit.remaining,
        reset: new Date(data.data.rateLimit.resetAt),
      };
    }

    return null;
  } catch {
    return null;
  }
}

