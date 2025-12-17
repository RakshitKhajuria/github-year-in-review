"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Download,
  Twitter,
  Linkedin,
  Share2,
  Github,
  GitCommit,
  GitPullRequest,
  Flame,
  Code2,
  GitBranch,
  Star,
  Users,
  Calendar,
  TrendingUp,
  Award,
  MessageSquare,
  FolderGit2,
  Sparkles,
} from "lucide-react";
import type { WrappedData } from "@/lib/types";
import { formatNumber, getLanguageColor, generateShareText, formatMonth } from "@/lib/utils";
import { toPng } from "html-to-image";
import { fadeInUp, scaleIn, staggerContainer } from "@/lib/animations";
import { orchestration, stagger } from "@/lib/motion";

interface SummarySlideProps {
  data: WrappedData;
}

export function SummarySlide({ data }: SummarySlideProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
      });
      
      const link = document.createElement("a");
      link.download = `github-wrapped-${data.user.username}-${data.year}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to generate image:", error);
    }
  };

  const handleShare = async (platform: "twitter" | "linkedin" | "native") => {
    const text = generateShareText(
      data.user.username,
      data.year,
      data.stats.totalCommits,
      data.stats.longestStreak
    );
    const url = window.location.href;
    const title = `My GitHub Wrapped ${data.year} - @${data.user.username}`;
    const linkedinText = `🎉 My GitHub Wrapped ${data.year}!\n\n` +
      `💻 ${data.stats.totalCommits.toLocaleString()} commits\n` +
      `🔥 ${data.stats.longestStreak} day longest streak\n` +
      `⭐ ${data.stats.totalStars} stars earned\n` +
      `📦 ${data.stats.totalRepos} repositories\n\n` +
      `Check out my year in code: ${url}`;

    if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        "_blank"
      );
    } else if (platform === "linkedin") {
      // LinkedIn share - copy formatted text to clipboard
      // LinkedIn's share API requires page metadata which doesn't work well with client-side apps
      try {
        await navigator.clipboard.writeText(linkedinText);
        // Open LinkedIn compose window with pre-filled text
        // LinkedIn doesn't support direct text in URL, so we copy to clipboard
        const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        window.open(linkedinShareUrl, "_blank");
        
        // Show notification (non-blocking)
        const notification = document.createElement("div");
        notification.textContent = "Share text copied! Paste it into your LinkedIn post.";
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          z-index: 10000;
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
          notification.remove();
        }, 3000);
      } catch (err) {
        // Fallback: show text in a prompt
        const userText = prompt("Copy this text to share on LinkedIn:", linkedinText);
        if (userText) {
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            "_blank"
          );
        }
      }
    } else if (platform === "native") {
      if (navigator.share) {
        try {
          await navigator.share({ 
            title, 
            text, 
            url 
          });
        } catch {
          // User cancelled or error
        }
      } else {
        // Fallback: copy to clipboard
        const shareText = `${text}\n\n${url}`;
        try {
          await navigator.clipboard.writeText(shareText);
          alert("Share text copied to clipboard!");
        } catch {
          console.error("Failed to copy to clipboard");
        }
      }
    }
  };

  const topRepo = data.repositories.top[0];
  const mostStarredRepo = data.stats.mostStarredRepo;

  return (
    <div className="h-full w-full flex items-center justify-start md:justify-center px-4 md:px-6 py-8 md:py-12 relative overflow-y-auto overflow-x-hidden slide-gradient-9">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Pulsing gradient orbs - enhanced opacity and faster */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.6, 0.4],
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Floating sparkles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${5 + (i % 4) * 30}%`,
              top: `${10 + Math.floor(i / 4) * 30}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0, 0.35, 0],
              rotate: [0, 20, -20, 0],
              scale: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 5 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="w-8 h-8 text-white/12" />
          </motion.div>
        ))}
      </div>

      {/* Content Container */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center my-auto"
      >
        {/* Hero Title */}
        <motion.div variants={fadeInUp} className="text-center mb-8 md:mb-10">
          <motion.h1
            variants={scaleIn}
            className="text-4xl md:text-6xl font-bold mb-3"
          >
            <span className="text-white">Your {data.year}</span>{" "}
            <span className="text-gradient gradient-primary">Wrapped</span>
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-github-muted text-lg md:text-xl"
        >
            A complete summary of your coding journey
          </motion.p>
        </motion.div>

        {/* Main Summary Card */}
        <motion.div
          ref={cardRef}
          variants={scaleIn}
          className="bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/10 w-full shadow-2xl mb-6"
        >
          {/* Header with Avatar */}
          <motion.div
            variants={fadeInUp}
            className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10"
          >
            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden ring-4 ring-github-green/30">
              <Image
                src={data.user.avatarUrl}
                alt={data.user.username}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
                @{data.user.username}
              </h3>
              {data.user.name && (
                <p className="text-github-muted text-sm md:text-base">{data.user.name}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <Github className="w-4 h-4 text-github-muted" />
                <span className="text-github-muted text-xs md:text-sm">
                  Member since {data.user.memberSince} • {data.year} Wrapped
                </span>
              </div>
            </div>
          </motion.div>

          {/* Key Stats Grid - 4 columns */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8"
          >
            {[
              {
                icon: GitCommit,
                label: "Commits",
                value: formatNumber(data.stats.totalCommits),
                color: "text-github-green",
                bg: "bg-github-green/10",
              },
              {
                icon: GitPullRequest,
                label: "Pull Requests",
                value: formatNumber(data.stats.totalPRs),
                color: "text-github-purple",
                bg: "bg-github-purple/10",
              },
              {
                icon: MessageSquare,
                label: "Issues",
                value: formatNumber(data.stats.totalIssues),
                color: "text-github-accent",
                bg: "bg-github-accent/10",
              },
              {
                icon: GitBranch,
                label: "Reviews",
                value: formatNumber(data.stats.totalReviews),
                color: "text-yellow-400",
                bg: "bg-yellow-400/10",
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                custom={0.1 + i * 0.05}
                className={`${stat.bg} rounded-xl p-4 border border-white/5`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-github-muted text-xs">{stat.label}</span>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Secondary Stats Grid */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8"
          >
            {[
              {
                icon: Flame,
                label: "Longest Streak",
                value: `${data.stats.longestStreak} days`,
                color: "text-orange-400",
                bg: "bg-orange-400/10",
              },
              {
                icon: Code2,
                label: "Active Days",
                value: `${data.stats.activeDays}`,
                color: "text-github-accent",
                bg: "bg-github-accent/10",
              },
              {
                icon: FolderGit2,
                label: "Repos Contributed",
                value: `${data.stats.totalReposContributed}`,
                color: "text-blue-400",
                bg: "bg-blue-400/10",
              },
              {
                icon: Star,
                label: "Total Stars",
                value: formatNumber(data.stats.totalStars),
                color: "text-yellow-400",
                bg: "bg-yellow-400/10",
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                custom={0.15 + i * 0.05}
                className={`${stat.bg} rounded-xl p-4 border border-white/5`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-github-muted text-xs">{stat.label}</span>
                </div>
                <p className="text-xl md:text-2xl font-bold text-white">{stat.value}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Highlights Section */}
          <motion.div variants={fadeInUp} custom={0.3} className="mb-8">
            <h4 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-github-green" />
              Highlights
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-github-muted text-xs mb-1">Most Productive Month</p>
                <p className="text-white font-bold text-lg">
                  {formatMonth(data.highlights.mostProductiveMonth.monthIndex)}
                </p>
                <p className="text-github-green text-sm mt-1">
                  {data.highlights.mostProductiveMonth.commits} commits
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-github-muted text-xs mb-1">Most Productive Day</p>
                <p className="text-white font-bold text-lg">
                  {data.highlights.mostProductiveDay}
                </p>
                <p className="text-github-purple text-sm mt-1">
                  {data.highlights.commitsByDayOfWeek[data.highlights.mostProductiveDay]} commits
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-github-muted text-xs mb-1">Average per Active Day</p>
                <p className="text-white font-bold text-lg">
                  {data.highlights.averageCommitsPerActiveDay.toFixed(1)}
                </p>
                <p className="text-github-accent text-sm mt-1">commits/day</p>
              </div>
            </div>
          </motion.div>

          {/* Top Languages */}
          <motion.div variants={fadeInUp} custom={0.4} className="mb-8">
            <h4 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-github-purple" />
              Top Languages
            </h4>
            <div className="flex flex-wrap gap-3">
              {data.languages.top.slice(0, 6).map((lang, i) => (
                <motion.div
                  key={lang.name}
                  variants={fadeInUp}
                  custom={0.45 + i * 0.05}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getLanguageColor(lang.name, lang.color) }}
                  />
                  <span className="text-white text-sm font-medium">{lang.name}</span>
                  <span className="text-github-muted text-xs">
                    {lang.percentage}%
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Top Repositories & Social Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Top Repository */}
            {topRepo && (
              <motion.div variants={fadeInUp} custom={0.5} className="bg-white/5 rounded-xl p-5 border border-white/5">
                <h4 className="text-white font-semibold text-base mb-3 flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-github-green" />
                  Most Active Repo
                </h4>
                <p className="text-white font-bold text-lg mb-1">{topRepo.fullName}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    <GitCommit className="w-3 h-3 text-github-muted" />
                    <span className="text-github-muted text-xs">{topRepo.commits} commits</span>
                  </div>
                  {topRepo.stars > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span className="text-github-muted text-xs">{formatNumber(topRepo.stars)} stars</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Social Stats */}
            <motion.div variants={fadeInUp} custom={0.55} className="bg-white/5 rounded-xl p-5 border border-white/5">
              <h4 className="text-white font-semibold text-base mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-github-accent" />
                Social Stats
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-github-muted text-xs mb-1">Followers</p>
                  <p className="text-white font-bold text-xl">{formatNumber(data.stats.followers)}</p>
                </div>
                <div>
                  <p className="text-github-muted text-xs mb-1">Following</p>
                  <p className="text-white font-bold text-xl">{formatNumber(data.stats.following)}</p>
                </div>
                <div>
                  <p className="text-github-muted text-xs mb-1">Owned Repos</p>
                  <p className="text-white font-bold text-xl">{data.stats.totalReposOwned}</p>
                </div>
                {mostStarredRepo && (
                  <div>
                    <p className="text-github-muted text-xs mb-1">Most Starred</p>
                    <p className="text-white font-bold text-sm truncate" title={mostStarredRepo.name}>
                      {mostStarredRepo.stars} ⭐
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Personality & Badges */}
          <motion.div variants={fadeInUp} custom={0.6} className="mb-6">
            <h4 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              Your Coding Personality
            </h4>
            <div className="bg-gradient-to-r from-github-green/20 to-github-purple/20 rounded-xl p-5 border border-white/10">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">{data.personality.primary.emoji}</span>
            <div>
                  <p className="text-white font-bold text-xl">{data.personality.primary.label}</p>
                  <p className="text-github-muted text-sm">{data.personality.primary.description}</p>
                </div>
              </div>
              {data.personality.badges.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                  {data.personality.badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full"
                      title={badge.description}
                    >
                      <span className="text-lg">{badge.emoji}</span>
                      <span className="text-white text-xs font-medium">{badge.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Review Stats (if available) */}
          {data.reviewStats && data.reviewStats.totalReviews > 0 && (
            <motion.div variants={fadeInUp} custom={0.65} className="mb-6">
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-github-muted text-xs mb-1">Code Reviews</p>
                    <p className="text-white font-bold text-lg">
                      {formatNumber(data.reviewStats.totalReviews)} reviews
                    </p>
                  </div>
                  {data.reviewStats.mostReviewedRepo && (
                    <div className="text-right">
                      <p className="text-github-muted text-xs mb-1">Most Reviewed</p>
                      <p className="text-white text-sm font-medium truncate max-w-[150px]" title={data.reviewStats.mostReviewedRepo}>
                        {data.reviewStats.mostReviewedRepo.split('/').pop()}
                      </p>
                    </div>
                  )}
            </div>
          </div>
            </motion.div>
          )}

          {/* Footer Watermark */}
          <motion.div
            variants={fadeInUp}
            custom={0.7}
            className="pt-6 border-t border-white/10 flex items-center justify-between"
          >
            <span className="text-github-muted text-xs">github-wrapped.vercel.app</span>
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3 text-github-muted" />
              <span className="text-github-muted text-xs">
                Generated {new Date(data.generatedAt).toLocaleDateString()}
                </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Share Buttons */}
        <motion.div
          variants={fadeInUp}
          custom={0.8}
          className="flex flex-wrap justify-center gap-3 mb-6"
        >
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all hover:scale-105 border border-white/10"
          >
            <Download className="w-4 h-4" />
            <span className="font-medium">Download</span>
          </button>
          <button
            onClick={() => handleShare("twitter")}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 text-[#1DA1F2] rounded-xl transition-all hover:scale-105 border border-[#1DA1F2]/20"
          >
            <Twitter className="w-4 h-4" />
            <span className="font-medium">Tweet</span>
          </button>
          <button
            onClick={() => handleShare("linkedin")}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0A66C2]/20 hover:bg-[#0A66C2]/30 text-[#0A66C2] rounded-xl transition-all hover:scale-105 border border-[#0A66C2]/20"
          >
            <Linkedin className="w-4 h-4" />
            <span className="font-medium">Share</span>
          </button>
          {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
            <button
              onClick={() => handleShare("native")}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all hover:scale-105 border border-white/10"
            >
              <Share2 className="w-4 h-4" />
              <span className="font-medium">Share</span>
            </button>
          )}
        </motion.div>

        {/* Final Message */}
        <motion.p
          variants={fadeInUp}
          custom={0.9}
          className="text-center text-github-muted text-sm md:text-base"
        >
          Thanks for coding with us in {data.year}! 🚀 Keep building amazing things!
        </motion.p>
      </motion.div>
    </div>
  );
}

