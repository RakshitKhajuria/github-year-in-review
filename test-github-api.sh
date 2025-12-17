#!/bin/bash

# Test GitHub API for RakshitKhajuria account for 2025 data

USERNAME="RakshitKhajuria"
YEAR=2025

echo "=========================================="
echo "Testing GitHub API for: $USERNAME"
echo "Year: $YEAR"
echo "=========================================="
echo ""

# Calculate date range for 2025
FROM_DATE="2025-01-01T00:00:00Z"
TO_DATE="2025-12-31T23:59:59Z"

echo "1. Testing User Info Endpoint:"
echo "--------------------------------"
curl -s -H "Accept: application/vnd.github.v3+json" \
     -H "User-Agent: GitHubWrapped/1.0" \
     "https://api.github.com/users/$USERNAME" | jq '{login, name, public_repos, created_at}'
echo ""

echo "2. Testing Public Events (Last 10 events):"
echo "--------------------------------"
EVENTS=$(curl -s -H "Accept: application/vnd.github.v3+json" \
              -H "User-Agent: GitHubWrapped/1.0" \
              "https://api.github.com/users/$USERNAME/events/public?per_page=10")

echo "$EVENTS" | jq -r '.[] | "\(.type) - \(.created_at) - Repo: \(.repo.name // "N/A")"' | head -10
echo ""

echo "3. Counting events in 2025 date range:"
echo "--------------------------------"
PUSH_EVENTS=$(echo "$EVENTS" | jq "[.[] | select(.type == \"PushEvent\" and .created_at >= \"$FROM_DATE\" and .created_at <= \"$TO_DATE\")] | length")
PR_EVENTS=$(echo "$EVENTS" | jq "[.[] | select(.type == \"PullRequestEvent\" and .created_at >= \"$FROM_DATE\" and .created_at <= \"$TO_DATE\")] | length")
ISSUE_EVENTS=$(echo "$EVENTS" | jq "[.[] | select(.type == \"IssuesEvent\" and .created_at >= \"$FROM_DATE\" and .created_at <= \"$TO_DATE\")] | length")

echo "PushEvents in 2025 (from first 10 events): $PUSH_EVENTS"
echo "PullRequestEvents in 2025 (from first 10 events): $PR_EVENTS"
echo "IssuesEvents in 2025 (from first 10 events): $ISSUE_EVENTS"
echo ""

echo "4. Testing Repositories Endpoint:"
echo "--------------------------------"
REPOS=$(curl -s -H "Accept: application/vnd.github.v3+json" \
             -H "User-Agent: GitHubWrapped/1.0" \
             "https://api.github.com/users/$USERNAME/repos?per_page=5&sort=pushed")

echo "First 5 repos (sorted by last push):"
echo "$REPOS" | jq -r '.[] | "\(.name) - Pushed: \(.pushed_at) - Language: \(.language // "N/A")"'
echo ""

echo "5. Checking oldest event date available:"
echo "--------------------------------"
OLDEST_DATE=$(echo "$EVENTS" | jq -r '[.[].created_at] | sort | .[0]')
echo "Oldest event in public events API: $OLDEST_DATE"
echo ""
echo "NOTE: GitHub's /users/{username}/events/public endpoint only returns"
echo "      events from the last 90 days. Events older than that won't appear!"
echo ""

echo "6. Rate Limit Status:"
echo "--------------------------------"
curl -s -I -H "Accept: application/vnd.github.v3+json" \
     -H "User-Agent: GitHubWrapped/1.0" \
     "https://api.github.com/users/$USERNAME" | grep -i "x-ratelimit" | sed 's/x-ratelimit-/  /'

