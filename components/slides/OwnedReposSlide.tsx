"use client";

import { motion } from "framer-motion";
import { FolderGit2, Lock, Globe } from "lucide-react";
import { SimpleCounter } from "@/components/ui/AnimatedCounter";
import type { WrappedData } from "@/lib/types";
import { fadeInUp, orchestration } from "@/lib/animations";
import { durations } from "@/lib/motion";
import { GradientGrainBackground } from "@/components/backgrounds/GradientGrainBackground";

interface OwnedReposSlideProps {
  data: WrappedData;
}

export function OwnedReposSlide({ data }: OwnedReposSlideProps) {
  const { totalReposOwned, publicReposOwned, privateReposOwned } = data.stats;
  const publicPercentage = totalReposOwned > 0 
    ? Math.round((publicReposOwned / totalReposOwned) * 100) 
    : 0;
  const privatePercentage = 100 - publicPercentage;

  return (
    <GradientGrainBackground
      colors={["#1e3a8a", "#312e81", "#4c1d95"]}
      orbColors={["rgba(37, 99, 235, 0.25)", "rgba(109, 40, 217, 0.25)"]}
      className="overflow-y-auto overflow-x-hidden"
    >
      <div className="h-full w-full flex flex-col items-center justify-center p-6 md:p-8 relative">
        {/* Floating folder icons */}
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
              <FolderGit2 className="w-8 h-8 text-white/12" />
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
          <FolderGit2 className="w-10 h-10 text-white" />
        </motion.div>

        {/* Main headline */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={orchestration.sequence(0, 0.2)}
          className="text-white/80 text-xl md:text-2xl mb-6 font-light"
        >
          You own
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
            <SimpleCounter value={totalReposOwned} duration={2000} />
          </span>
        </motion.div>

        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={orchestration.sequence(2, 0.2)}
          className="text-white/80 text-2xl md:text-3xl mb-8 font-light"
        >
          repositories
        </motion.p>

        {/* Public/Private split */}
        {totalReposOwned > 0 && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={orchestration.sequence(3, 0.2)}
            className="grid grid-cols-2 gap-4 mb-6"
          >
            {/* Public repos */}
            <motion.div
              className="p-4 glass-premium rounded-xl"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-blue-300" />
                <p className="text-white/60 text-sm">Public</p>
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                <SimpleCounter value={publicReposOwned} duration={1500} />
              </p>
              <p className="text-white/50 text-xs">{publicPercentage}%</p>
            </motion.div>

            {/* Private repos */}
            <motion.div
              className="p-4 glass-premium rounded-xl"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Lock className="w-5 h-5 text-purple-300" />
                <p className="text-white/60 text-sm">Private</p>
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                <SimpleCounter value={privateReposOwned} duration={1500} />
              </p>
              <p className="text-white/50 text-xs">{privatePercentage}%</p>
            </motion.div>
          </motion.div>
        )}

        {/* Fun fact */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={orchestration.sequence(4, 0.2)}
          className="text-white/70 text-lg italic"
        >
          {publicPercentage > 80
            ? "Open source champion! 🌍"
            : publicPercentage > 50
            ? "Balanced portfolio! ⚖️"
            : privateReposOwned > publicReposOwned
            ? "Building in private, shipping in public! 🔒"
            : "Every repo tells a story! 📚"}
        </motion.p>
      </motion.div>
    </div>
    </GradientGrainBackground>
  );
}

