"use client";

import { motion } from "framer-motion";
import { GitCommit, TrendingUp } from "lucide-react";
import { SimpleCounter } from "@/components/ui/AnimatedCounter";
import type { WrappedData } from "@/lib/types";
import confetti from "canvas-confetti";
import { useEffect, useRef } from "react";
import { heroNumber, fadeInUp, glimmer, orchestration } from "@/lib/animations";
import { easings, durations } from "@/lib/motion";
import { RadialSpotlightBackground } from "@/components/backgrounds/RadialSpotlightBackground";

interface CommitsSlideProps {
  data: WrappedData;
}

export function CommitsSlide({ data }: CommitsSlideProps) {
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (!hasTriggered.current && data.stats.totalCommits > 100) {
      hasTriggered.current = true;
      const timer = setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#3fb950", "#58a6ff", "#a371f7", "#f778ba"],
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [data.stats.totalCommits]);

  const weeklyAverage = Math.round(data.stats.totalCommits / 52);
  const dailyAverage = (data.stats.totalCommits / data.stats.activeDays).toFixed(1);

  return (
    <RadialSpotlightBackground
      spotlightColor="#10b981"
      spotlightIntensity={0.3}
      className="overflow-y-auto overflow-x-hidden"
    >
      <div className="h-full w-full flex flex-col items-center justify-center p-6 md:p-8 relative">
        {/* Floating commit icons */}
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
              <GitCommit className="w-8 h-8 text-white/12" />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: durations.moderate }}
        className="relative z-10 text-center w-full max-w-2xl mx-auto my-auto"
      >
        {/* Icon with enhanced entrance */}
        <motion.div
          initial={{ scale: 0, rotate: -180, filter: "blur(10px)" }}
          animate={{ scale: 1, rotate: 0, filter: "blur(0px)" }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.1,
          }}
          className="inline-flex p-4 rounded-full bg-white/10 backdrop-blur-sm mb-8 relative"
        >
          {/* Icon glow */}
          <motion.div
            className="absolute inset-0 rounded-full bg-white/20 blur-lg"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <GitCommit className="w-10 h-10 text-white relative z-10" />
        </motion.div>

        {/* Main headline with stagger */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={orchestration.sequence(0, 0.2)}
          className="text-white/80 text-xl md:text-2xl mb-6 font-light tracking-wide"
        >
          You made
        </motion.p>

        {/* Big number with dramatic reveal */}
        <motion.div
          variants={heroNumber}
          initial="hidden"
          animate="visible"
          custom={0.3}
          className="mb-6 relative"
        >
          {/* Number glow */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              opacity: [0, 0.5, 0],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="text-7xl md:text-9xl font-bold text-white/20 blur-2xl">
              {data.stats.totalCommits}
            </div>
          </motion.div>
          
          <span className="text-7xl md:text-9xl font-bold text-white relative z-10 drop-shadow-2xl">
            <SimpleCounter value={data.stats.totalCommits} duration={2000} />
          </span>
        </motion.div>

        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={orchestration.sequence(2, 0.2)}
          className="text-white/80 text-2xl md:text-3xl mb-10 font-light"
        >
          commits this year!
        </motion.p>

        {/* Breakdown */}
        {data.stats.privateCommits > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center gap-8 mb-8"
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                <SimpleCounter value={data.stats.publicCommits} duration={1500} />
              </p>
              <p className="text-white/60 text-sm">public</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                <SimpleCounter value={data.stats.privateCommits} duration={1500} />
              </p>
              <p className="text-white/60 text-sm">private</p>
            </div>
          </motion.div>
        )}

        {/* Averages with enhanced micro-interactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, ease: easings.smooth }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <motion.div 
            className="flex items-center justify-center gap-2 px-5 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
            whileHover={{ 
              scale: 1.05, 
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              borderColor: "rgba(255, 255, 255, 0.3)",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <TrendingUp className="w-4 h-4 text-emerald-300" />
            </motion.div>
            <span className="text-white font-medium">~{weeklyAverage} commits/week</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center justify-center gap-2 px-5 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              borderColor: "rgba(255, 255, 255, 0.3)",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <span className="text-white font-medium">~{dailyAverage} commits per active day</span>
          </motion.div>
        </motion.div>

        {/* Fun fact */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-white/50 italic"
        >
          {data.stats.totalCommits > 1000
            ? "That's over 1000 commits! You're on fire! 🔥"
            : data.stats.totalCommits > 500
            ? "Half a thousand commits! Impressive! 💪"
            : data.stats.totalCommits > 100
            ? "Triple digits! Great work! ⭐"
            : "Every commit counts! 🌱"}
        </motion.p>
      </motion.div>
    </div>
    </RadialSpotlightBackground>
  );
}

