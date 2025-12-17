import { NextRequest, NextResponse } from "next/server";
import { fetchUserContributions } from "@/lib/github/client";
import { calculateWrappedData } from "@/lib/metrics/calculator";
import { isValidGitHubUsername, isValidYear, getCurrentYear } from "@/lib/utils";

export async function POST(request: NextRequest) {
  let username = "";
  
  try {
    const body = await request.json();
    username = body.username;
    const { year = getCurrentYear(), token } = body;

    // Validate username
    if (!username || typeof username !== "string") {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    if (!isValidGitHubUsername(username)) {
      return NextResponse.json(
        { error: "Invalid GitHub username format" },
        { status: 400 }
      );
    }

    // Validate year
    if (!isValidYear(year)) {
      return NextResponse.json(
        { error: "Invalid year. Must be between 2008 and current year." },
        { status: 400 }
      );
    }

    // Fetch contributions from GitHub
    // Note: Token is used here but NEVER logged or stored
    console.log(`Fetching contributions for ${username}, year ${year}, token provided: ${!!token}`);
    const response = await fetchUserContributions(
      username,
      year,
      token || undefined
    );

    console.log("Successfully fetched contributions");
    console.log("Response structure:", {
      hasUser: !!response.user,
      hasContributionsCollection: !!response.user?.contributionsCollection,
      totalCommits: response.user?.contributionsCollection?.totalCommitContributions,
      totalPRs: response.user?.contributionsCollection?.totalPullRequestContributions,
    });

    // Calculate wrapped data
    let wrappedData;
    try {
      console.log("Calculating wrapped data...");
      wrappedData = calculateWrappedData(response, year);
      console.log("Wrapped data calculated:", {
        totalCommits: wrappedData.stats.totalCommits,
        totalPRs: wrappedData.stats.totalPRs,
        totalIssues: wrappedData.stats.totalIssues,
      });
    } catch (calcError) {
      console.error("Error in calculateWrappedData:", calcError);
      throw calcError;
    }

    return NextResponse.json(wrappedData);
  } catch (error) {
    console.error("Error fetching contributions:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    // Handle specific error types
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      
      if (errorMessage.includes("not found")) {
        return NextResponse.json(
          { error: "User not found", message: `GitHub user "${username || "unknown"}" was not found.` },
          { status: 404 }
        );
      }

      if (errorMessage.includes("rate limit")) {
        return NextResponse.json(
          {
            error: "Rate limited",
            message: "GitHub API rate limit exceeded. Please try again later or provide a personal access token.",
          },
          { status: 429 }
        );
      }

      // Authentication errors (shouldn't happen with REST fallback, but handle gracefully)
      if (errorMessage.includes("bad credentials") || errorMessage.includes("401")) {
        return NextResponse.json(
          {
            error: "Authentication failed",
            message: "Invalid personal access token. Please check your token or try without one for public data only.",
          },
          { status: 401 }
        );
      }
    }

    // Include error details in development
    const errorDetails = process.env.NODE_ENV === 'development' 
      ? { 
          errorMessage: error instanceof Error ? error.message : String(error),
          errorType: error instanceof Error ? error.constructor.name : typeof error,
        }
      : {};

    return NextResponse.json(
      {
        error: "Failed to fetch contributions",
        message: "An unexpected error occurred. Please try again.",
        ...errorDetails,
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ status: "ok", message: "GitHub Wrapped API" });
}

