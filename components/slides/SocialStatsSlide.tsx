"use client";

import { motion } from "framer-motion";
import { Users, UserPlus, TrendingUp } from "lucide-react";
import { SimpleCounter } from "@/components/ui/AnimatedCounter";
import type { WrappedData } from "@/lib/types";
import { fadeInUp, orchestration } from "@/lib/animations";
import { easings, durations } from "@/lib/motion";
import { GradientGrainBackground } from "@/components/backgrounds/GradientGrainBackground";

interface SocialStatsSlideProps {
  data: WrappedData;
}

export function SocialStatsSlide({ data }: SocialStatsSlideProps) {
  const { followers, following } = data.stats;
  const followerGrowth = followers > 0 ? Math.round((following / followers) * 100) : 0;

  return (
    <GradientGrainBackground
      colors={["#1e3a8a", "#4c1d95", "#6b21a8"]}
      orbColors={["rgba(37, 99, 235, 0.3)", "rgba(126, 34, 206, 0.3)"]}
      className="overflow-y-auto overflow-x-hidden"
    >
      <div className="h-full w-full flex flex-col items-center justify-center p-6 md:p-8 relative">
        {/* Floating user icons */}
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
              <Users className="w-10 h-10 text-white/12" />
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
          <Users className="w-10 h-10 text-white" />
        </motion.div>

        {/* Main headline */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={orchestration.sequence(0, 0.2)}
          className="text-white/80 text-xl md:text-2xl mb-8 font-light"
        >
          Your GitHub community
        </motion.p>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Followers */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={orchestration.sequence(1, 0.2)}
            className="p-6 glass-premium rounded-2xl shadow-depth-md"
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-blue-500/20">
                <UserPlus className="w-6 h-6 text-blue-300" />
              </div>
              <div className="text-left">
                <p className="text-white/60 text-sm">Followers</p>
                <p className="text-4xl md:text-5xl font-bold text-white">
                  <SimpleCounter value={followers} duration={2000} />
                </p>
              </div>
            </div>
            <p className="text-white/50 text-xs">
              People following your work
            </p>
          </motion.div>

          {/* Following */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={orchestration.sequence(2, 0.2)}
            className="p-6 glass-premium rounded-2xl shadow-depth-md"
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-purple-500/20">
                <TrendingUp className="w-6 h-6 text-purple-300" />
              </div>
              <div className="text-left">
                <p className="text-white/60 text-sm">Following</p>
                <p className="text-4xl md:text-5xl font-bold text-white">
                  <SimpleCounter value={following} duration={2000} />
                </p>
              </div>
            </div>
            <p className="text-white/50 text-xs">
              Developers you&apos;re following
            </p>
          </motion.div>
        </div>

        {/* Fun fact */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={orchestration.sequence(3, 0.2)}
          className="text-white/70 text-lg italic"
        >
          {followers > 1000
            ? "You're a GitHub influencer! 🌟"
            : followers > 100
            ? "Building a solid community! 👥"
            : following > followers
            ? "You're exploring more than you're followed - curious mind! 🔍"
            : "Every follower counts! 🌱"}
        </motion.p>
      </motion.div>
    </div>
    </GradientGrainBackground>
  );
}

