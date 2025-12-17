"use client";

import { motion } from "framer-motion";
import { Eye, GitMerge, CheckCircle2 } from "lucide-react";
import { SimpleCounter } from "@/components/ui/AnimatedCounter";
import type { WrappedData } from "@/lib/types";
import { fadeInUp, orchestration } from "@/lib/animations";
import { durations } from "@/lib/motion";
import { RadialSpotlightBackground } from "@/components/backgrounds/RadialSpotlightBackground";

interface ReviewsSlideProps {
  data: WrappedData;
}

export function ReviewsSlide({ data }: ReviewsSlideProps) {
  const { totalReviews, reviewsPerPR } = data.reviewStats || {
    totalReviews: data.stats.totalReviews,
    reviewsPerPR: data.stats.totalPRs > 0 
      ? Math.round((data.stats.totalReviews / data.stats.totalPRs) * 10) / 10 
      : 0,
    mostReviewedRepo: null,
  };

  return (
    <RadialSpotlightBackground
      spotlightColor="#a855f7"
      spotlightIntensity={0.3}
      className="overflow-y-auto overflow-x-hidden"
    >
      <div className="h-full w-full flex flex-col items-center justify-center p-6 md:p-8 relative">
        {/* Floating eye icons */}
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
              <Eye className="w-8 h-8 text-white/12" />
            </motion.div>
          ))}
        </div>

        {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: durations.moderate }}
        className="relative z-10 text-center max-w-2xl w-full"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          className="inline-flex p-4 rounded-full bg-white/10 backdrop-blur-sm mb-8"
        >
          <Eye className="w-10 h-10 text-white" />
        </motion.div>

        {/* Main headline */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={orchestration.sequence(0, 0.2)}
          className="text-white/80 text-xl md:text-2xl mb-6 font-light"
        >
          You reviewed
        </motion.p>

        {/* Big number */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={orchestration.sequence(1, 0.2)}
          className="mb-8"
        >
          <span className="text-7xl md:text-9xl font-bold text-white drop-shadow-2xl">
            <SimpleCounter value={totalReviews} duration={2000} />
          </span>
        </motion.div>

        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={orchestration.sequence(2, 0.2)}
          className="text-white/80 text-2xl md:text-3xl mb-8 font-light"
        >
          pull requests this year!
        </motion.p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={orchestration.sequence(3, 0.2)}
            className="p-4 glass-premium rounded-xl"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <GitMerge className="w-5 h-5 text-purple-300" />
              <p className="text-white/60 text-sm">Reviews per PR</p>
            </div>
            <p className="text-3xl font-bold text-white">
              {reviewsPerPR.toFixed(1)}
            </p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={orchestration.sequence(4, 0.2)}
            className="p-4 glass-premium rounded-xl"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-300" />
              <p className="text-white/60 text-sm">Total PRs</p>
            </div>
            <p className="text-3xl font-bold text-white">
              <SimpleCounter value={data.stats.totalPRs} duration={1500} />
            </p>
          </motion.div>
        </div>

        {/* Fun fact */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={orchestration.sequence(5, 0.2)}
          className="text-white/70 text-lg italic"
        >
          {totalReviews > 100
            ? "You're a code review champion! 🏆"
            : totalReviews > 50
            ? "Great collaboration! 🤝"
            : reviewsPerPR > 2
            ? "Thorough reviewer! 🔍"
            : "Every review makes code better! ✨"}
        </motion.p>
      </motion.div>
      </div>
    </RadialSpotlightBackground>
  );
}

