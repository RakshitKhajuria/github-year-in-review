# 🎉 GitHub Year in Review - Your Coding Journey Visualized

A beautiful, Spotify Wrapped-style visualization of your GitHub year. See your coding journey through an immersive, story-based experience. Discover your commits, pull requests, streaks, languages, and more in a stunning slideshow format.

**🔍 SEO Keywords**: GitHub Wrapped, GitHub Year in Review, GitHub Stats, Developer Analytics, Coding Year Summary, GitHub Contributions, Developer Wrapped, Code Statistics, GitHub Annual Report

<img width="1792" height="2810" alt="github-wrapped-RakshitKhajuria-2025" src="https://github.com/user-attachments/assets/0e70443b-6022-4cae-9262-35891b9b13fa" />


## ✨ Features

- **Story-Based Experience**: Navigate through slides that reveal your year in code
- **Beautiful Animations**: Smooth transitions and engaging visual effects
- **Comprehensive Stats**: Commits, PRs, issues, streaks, and more
- **Language Breakdown**: See your coding DNA with language statistics
- **Personality Labels**: Fun insights like "Night Owl 🦉" or "Weekend Warrior ⚔️"
- **Shareable Cards**: Download or share your wrapped summary
- **Private Repo Support**: Optionally include private repositories with a PAT

## 🌟 Why GitHub Year in Review?

- **Beautiful Visualizations**: See your coding journey in a stunning slideshow
- **Comprehensive Analytics**: Commits, PRs, languages, streaks, and more
- **Share Your Story**: Download or share your wrapped summary
- **Privacy First**: All processing happens client-side, no data stored
- **Open Source**: Free and transparent

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/RakshitKhajuria/github-year-in-review.git
cd github-year-in-review

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Start the development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 GitHub Personal Access Token

To include private repository data, you'll need a GitHub Personal Access Token:

1. Go to [GitHub Settings > Developer Settings > Personal Access Tokens](https://github.com/settings/tokens/new)
2. Create a new token with the following scopes:
   - `repo` - For private repository access
   - `read:user` - For user profile data
3. Copy the token and use it in the app

**Security Note**: Your token is never stored. It's only used once to fetch your data and is immediately discarded.

## 📊 Metrics Computed

| Metric | Description |
|--------|-------------|
| Total Commits | All commits made in the year |
| Active Days | Days with at least one contribution |
| Longest Streak | Consecutive days of contributions |
| Pull Requests | PRs opened, merged, and reviewed |
| Issues | Issues opened and closed |
| Top Languages | Programming languages used |
| Top Repositories | Most contributed repositories |
| Personality | Fun labels based on your patterns |

## 🎨 Personality Labels

Based on your coding patterns, you might earn:

- 🦉 **Night Owl** - Commits predominantly at night
- 🐦 **Early Bird** - Commits before 9 AM
- ⚔️ **Weekend Warrior** - High weekend activity
- 🔥 **Streak Master** - Long contribution streaks
- 🌍 **Polyglot** - Uses 5+ languages
- 🤖 **PR Machine** - Opens many pull requests
- 👀 **Code Reviewer** - Reviews lots of PRs
- 📅 **Consistent Coder** - Active 150+ days/year

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **GitHub API**: [GraphQL API](https://docs.github.com/en/graphql)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📁 Project Structure

```
github-wrapped/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles
│   ├── wrapped/[username]/
│   │   └── page.tsx                # Wrapped experience
│   └── api/github/
│       └── contributions/
│           └── route.ts            # API endpoint
├── components/
│   ├── slides/                     # All slide components
│   │   ├── WelcomeSlide.tsx
│   │   ├── OverviewSlide.tsx
│   │   ├── CommitsSlide.tsx
│   │   ├── MonthSlide.tsx
│   │   ├── LanguagesSlide.tsx
│   │   ├── ReposSlide.tsx
│   │   ├── StreakSlide.tsx
│   │   ├── PersonalitySlide.tsx
│   │   └── SummarySlide.tsx
│   └── ui/                         # Reusable UI components
│       ├── AnimatedCounter.tsx
│       └── ProgressBar.tsx
├── lib/
│   ├── github/                     # GitHub API client
│   │   ├── client.ts
│   │   └── queries.ts
│   ├── metrics/                    # Data processing
│   │   ├── calculator.ts
│   │   └── personality.ts
│   ├── types.ts                    # TypeScript types
│   └── utils.ts                    # Utility functions
└── ...config files
```

## 🔒 Privacy & Security

- **No Data Storage**: We don't store any user data or tokens
- **Ephemeral Tokens**: PATs are used once and immediately discarded
- **HTTPS Only**: All API calls are encrypted
- **Client-Side Processing**: Stats are computed in your browser
- **Open Source**: Full transparency in how your data is used

## 🚀 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/RakshitKhajuria/github-year-in-review)

### One-Click Deploy

Click the button above to deploy instantly to Vercel. No configuration needed!

### Environment Variables

No environment variables are required for basic functionality. The app uses GitHub's public API for public repositories.

## 📝 API Reference

### POST /api/github/contributions

Fetches and calculates wrapped data for a user.

**Request Body:**
```json
{
  "username": "octocat",
  "year": 2024,
  "token": "ghp_xxxx"  // Optional, for private repos
}
```

**Response:**
```json
{
  "user": { "username": "octocat", "avatarUrl": "...", ... },
  "year": 2024,
  "stats": { "totalCommits": 1523, ... },
  "highlights": { "mostProductiveMonth": { ... }, ... },
  "repositories": { "top": [...], ... },
  "languages": { "top": [...], ... },
  "personality": { "primary": { ... }, "badges": [...] }
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [Spotify Wrapped](https://spotify.com/wrapped)
- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Animated with [Framer Motion](https://www.framer.com/motion/)

---

**Made with 💚 for the developer community**

