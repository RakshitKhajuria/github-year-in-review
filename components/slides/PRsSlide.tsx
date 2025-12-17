"use client";

import { motion } from "framer-motion";
import { GitPullRequest, GitMerge, TrendingUp } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import type { WrappedData } from "@/lib/types";
import { RadialSpotlightBackground } from "@/components/backgrounds/RadialSpotlightBackground";

interface PRsSlideProps {
  data: WrappedData;
}

export function PRsSlide({ data }: PRsSlideProps) {
  const { totalPRs, totalReviews, activeDays } = data.stats;
  const prsPerWeek = activeDays > 0 ? (totalPRs / (activeDays / 7)).toFixed(1) : "0";
  const reviewsPerPR = totalPRs > 0 ? (totalReviews / totalPRs).toFixed(1) : "0";

  return (
    <RadialSpotlightBackground
      spotlightColor="#3b82f6"
      spotlightIntensity={0.3}
      className="overflow-y-auto overflow-x-hidden"
    >
      <div className="h-full w-full flex items-center justify-center relative p-6 md:p-8">
        {/* Floating PR icons */}
        <div className="absolute inset-0 pointer-events-none">
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
              <GitPullRequest className="w-8 h-8 text-white/12" />
          </motion.div>
        ))}
      </div>

        <div className="relative z-10 text-center w-full max-w-4xl mx-auto my-auto px-4 md:px-8">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-white/20 rounded-full blur-2xl"
            />
            <div className="relative bg-white/20 backdrop-blur-sm p-6 rounded-full">
              <GitMerge className="w-16 h-16 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl font-light text-white/90 mb-4"
        >
          You opened
        </motion.h2>

        {/* Counter */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.4,
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
          className="mb-6"
        >
          <AnimatedCounter
            value={totalPRs}
            className="text-8xl md:text-9xl font-bold text-white"
          />
        </motion.div>

        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-3xl md:text-4xl font-light text-white/90 mb-12"
        >
          pull requests this year!
        </motion.p>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-4 max-w-2xl"
        >
          <div className="glass px-6 py-3 rounded-full flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">~{prsPerWeek} PRs/week</span>
          </div>
          
          {totalReviews > 0 && (
            <div className="glass px-6 py-3 rounded-full flex items-center gap-2">
              <GitPullRequest className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">
                ~{reviewsPerPR} reviews per PR
              </span>
            </div>
          )}
        </motion.div>

        {/* Fun message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-lg text-white/80 italic"
        >
          {totalPRs === 0
            ? "Time to start contributing! 🚀"
            : totalPRs < 10
            ? "Every PR counts! 💪"
            : totalPRs < 50
            ? "Building momentum! 🔥"
            : totalPRs < 100
            ? "Impressive contribution rate! 🌟"
            : "PR powerhouse! 🏆"}
        </motion.p>
      </div>
    </div>
    </RadialSpotlightBackground>
  );
}

