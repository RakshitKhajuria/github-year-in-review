import type {
  WrappedStats,
  WrappedHighlights,
  WrappedLanguages,
  WrappedRepositories,
  WrappedPersonality,
  PersonalityLabel,
} from "@/lib/types";

// All possible personality labels
const PERSONALITY_LABELS: Record<string, PersonalityLabel> = {
  nightOwl: {
    id: "nightOwl",
    label: "Night Owl",
    emoji: "🦉",
    description: "You do your best work when the world sleeps",
    color: "#6366f1",
  },
  earlyBird: {
    id: "earlyBird",
    label: "Early Bird",
    emoji: "🐦",
    description: "You catch the worm with pre-dawn commits",
    color: "#f59e0b",
  },
  weekendWarrior: {
    id: "weekendWarrior",
    label: "Weekend Warrior",
    emoji: "⚔️",
    description: "Weekends are for coding, not resting",
    color: "#ef4444",
  },
  streakMaster: {
    id: "streakMaster",
    label: "Streak Master",
    emoji: "🔥",
    description: "Consistency is your superpower",
    color: "#f97316",
  },
  polyglot: {
    id: "polyglot",
    label: "Polyglot",
    emoji: "🌍",
    description: "You speak many programming languages fluently",
    color: "#10b981",
  },
  openSourceHero: {
    id: "openSourceHero",
    label: "Open Source Hero",
    emoji: "🦸",
    description: "Contributing to the community, one commit at a time",
    color: "#8b5cf6",
  },
  issueHunter: {
    id: "issueHunter",
    label: "Issue Hunter",
    emoji: "🎯",
    description: "Finding and fixing bugs is your calling",
    color: "#ec4899",
  },
  prMachine: {
    id: "prMachine",
    label: "PR Machine",
    emoji: "🤖",
    description: "Pull requests flow through your keyboard",
    color: "#06b6d4",
  },
  codeReviewer: {
    id: "codeReviewer",
    label: "Code Reviewer",
    emoji: "👀",
    description: "Your keen eye makes every PR better",
    color: "#84cc16",
  },
  consistentCoder: {
    id: "consistentCoder",
    label: "Consistent Coder",
    emoji: "📅",
    description: "You show up day after day, commit after commit",
    color: "#3b82f6",
  },
  prolificPusher: {
    id: "prolificPusher",
    label: "Prolific Pusher",
    emoji: "🚀",
    description: "Your commit count is legendary",
    color: "#a855f7",
  },
  mondayMotivator: {
    id: "mondayMotivator",
    label: "Monday Motivator",
    emoji: "💪",
    description: "You start the week strong",
    color: "#14b8a6",
  },
  fridayFinisher: {
    id: "fridayFinisher",
    label: "Friday Finisher",
    emoji: "🎉",
    description: "You wrap up the week with a bang",
    color: "#f43f5e",
  },
  soloArtist: {
    id: "soloArtist",
    label: "Solo Artist",
    emoji: "🎸",
    description: "Your repos are your masterpieces",
    color: "#6366f1",
  },
  collaborator: {
    id: "collaborator",
    label: "Team Player",
    emoji: "🤝",
    description: "You thrive when working with others",
    color: "#22c55e",
  },
};

export function calculatePersonality(
  stats: WrappedStats,
  highlights: WrappedHighlights,
  languages: WrappedLanguages,
  repos: WrappedRepositories
): WrappedPersonality {
  const badges: PersonalityLabel[] = [];

  // Weekend Warrior: >30% commits on weekend
  const weekendCommits =
    (highlights.commitsByDayOfWeek["Saturday"] || 0) +
    (highlights.commitsByDayOfWeek["Sunday"] || 0);
  const totalDayCommits = Object.values(highlights.commitsByDayOfWeek).reduce(
    (a, b) => a + b,
    0
  );

  if (totalDayCommits > 0 && weekendCommits / totalDayCommits > 0.3) {
    badges.push(PERSONALITY_LABELS.weekendWarrior);
  }

  // Streak Master: Longest streak > 14 days
  if (stats.longestStreak > 14) {
    badges.push(PERSONALITY_LABELS.streakMaster);
  }

  // Polyglot: Used 5+ languages
  if (languages.total >= 5) {
    badges.push(PERSONALITY_LABELS.polyglot);
  }

  // PR Machine: Opened 30+ PRs
  if (stats.totalPRs >= 30) {
    badges.push(PERSONALITY_LABELS.prMachine);
  }

  // Code Reviewer: 20+ reviews
  if (stats.totalReviews >= 20) {
    badges.push(PERSONALITY_LABELS.codeReviewer);
  }

  // Issue Hunter: 20+ issues
  if (stats.totalIssues >= 20) {
    badges.push(PERSONALITY_LABELS.issueHunter);
  }

  // Consistent Coder: Active 150+ days
  if (stats.activeDays >= 150) {
    badges.push(PERSONALITY_LABELS.consistentCoder);
  }

  // Prolific Pusher: 500+ commits
  if (stats.totalCommits >= 500) {
    badges.push(PERSONALITY_LABELS.prolificPusher);
  }

  // Open Source Hero: Contributed to 10+ repos
  if (stats.totalReposContributed >= 10) {
    badges.push(PERSONALITY_LABELS.openSourceHero);
  }

  // Monday Motivator
  const mondayCommits = highlights.commitsByDayOfWeek["Monday"] || 0;
  if (
    totalDayCommits > 0 &&
    mondayCommits / totalDayCommits > 0.2 &&
    highlights.mostProductiveDay === "Monday"
  ) {
    badges.push(PERSONALITY_LABELS.mondayMotivator);
  }

  // Friday Finisher
  const fridayCommits = highlights.commitsByDayOfWeek["Friday"] || 0;
  if (
    totalDayCommits > 0 &&
    fridayCommits / totalDayCommits > 0.2 &&
    highlights.mostProductiveDay === "Friday"
  ) {
    badges.push(PERSONALITY_LABELS.fridayFinisher);
  }

  // Determine primary personality
  let primary: PersonalityLabel;

  if (badges.length === 0) {
    // Default personalities based on stats
    if (stats.totalCommits >= 100) {
      primary = PERSONALITY_LABELS.consistentCoder;
    } else if (stats.totalPRs >= 10) {
      primary = PERSONALITY_LABELS.collaborator;
    } else {
      primary = PERSONALITY_LABELS.soloArtist;
    }
  } else {
    // Priority order for primary personality
    const priorityOrder = [
      "weekendWarrior",
      "streakMaster",
      "prolificPusher",
      "polyglot",
      "prMachine",
      "openSourceHero",
      "codeReviewer",
      "consistentCoder",
      "issueHunter",
      "mondayMotivator",
      "fridayFinisher",
    ];

    const primaryBadge = priorityOrder.find((id) =>
      badges.some((b) => b.id === id)
    );

    primary = primaryBadge
      ? PERSONALITY_LABELS[primaryBadge]
      : badges[0];
  }

  // Remove primary from badges list
  const filteredBadges = badges.filter((b) => b.id !== primary.id).slice(0, 4);

  return {
    primary,
    badges: filteredBadges,
  };
}

// Helper to get personality label by ID
export function getPersonalityLabel(id: string): PersonalityLabel | undefined {
  return PERSONALITY_LABELS[id];
}

// Get all personality labels
export function getAllPersonalityLabels(): PersonalityLabel[] {
  return Object.values(PERSONALITY_LABELS);
}

