"use client";

import { motion } from "framer-motion";
import { CalendarDays, Zap } from "lucide-react";
import { SimpleCounter } from "@/components/ui/AnimatedCounter";
import type { WrappedData } from "@/lib/types";
import { GradientGrainBackground } from "@/components/backgrounds/GradientGrainBackground";

interface MonthSlideProps {
  data: WrappedData;
}

const MONTH_EMOJIS: Record<string, string> = {
  January: "❄️",
  February: "💝",
  March: "🌸",
  April: "🌧️",
  May: "🌻",
  June: "☀️",
  July: "🏖️",
  August: "🌴",
  September: "🍂",
  October: "🎃",
  November: "🍁",
  December: "🎄",
};

export function MonthSlide({ data }: MonthSlideProps) {
  const { mostProductiveMonth } = data.highlights;
  const monthPercentage = Math.round(
    (mostProductiveMonth.commits / data.stats.totalCommits) * 100
  );
  const emoji = MONTH_EMOJIS[mostProductiveMonth.month] || "📅";

  return (
    <GradientGrainBackground
      colors={["#831843", "#9f1239", "#7c2d12"]}
      orbColors={["rgba(190, 24, 93, 0.3)", "rgba(225, 29, 72, 0.3)"]}
      className="overflow-y-auto overflow-x-hidden"
    >
      <div className="h-full w-full flex flex-col items-center justify-center p-6 md:p-8 relative">
      {/* Floating emojis */}
        <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute text-4xl"
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
            {emoji}
          </motion.span>
        ))}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 text-center w-full max-w-2xl mx-auto my-auto"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="inline-flex p-4 rounded-full bg-white/10 mb-8"
        >
          <CalendarDays className="w-10 h-10 text-white" />
        </motion.div>

        {/* Intro text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/70 text-xl mb-6"
        >
          Your most productive month was
        </motion.p>

        {/* Month name */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="mb-6"
        >
          <span className="text-5xl md:text-7xl font-bold text-white flex items-center justify-center gap-4">
            <span className="text-6xl md:text-8xl">{emoji}</span>
            {mostProductiveMonth.month}
          </span>
        </motion.div>

        {/* Commit count */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur rounded-full">
            <Zap className="w-5 h-5 text-yellow-300" />
            <span className="text-2xl font-bold text-white">
              <SimpleCounter value={mostProductiveMonth.commits} duration={1500} />
            </span>
            <span className="text-white/70">commits</span>
          </div>
        </motion.div>

        {/* Percentage */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-white/60 text-lg"
        >
          That&apos;s{" "}
          <span className="text-white font-semibold">{monthPercentage}%</span>{" "}
          of your year&apos;s work in just 30 days!
        </motion.p>

        {/* Best day */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 p-4 bg-white/10 backdrop-blur rounded-xl inline-block"
        >
          <p className="text-white/60 text-sm mb-1">Your favorite day to code</p>
          <p className="text-2xl font-bold text-white">
            {data.highlights.mostProductiveDay}
          </p>
        </motion.div>

        {/* Fun message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-white/50 italic"
        >
          {mostProductiveMonth.month === "December"
            ? "Ending the year strong! 🎉"
            : mostProductiveMonth.month === "January"
            ? "New year, new code! 🚀"
            : `${mostProductiveMonth.month} was your power month! ⚡`}
        </motion.p>
      </motion.div>
    </div>
    </GradientGrainBackground>
  );
}

