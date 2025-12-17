"use client";

import { motion } from "framer-motion";
import { Calendar, Code2 } from "lucide-react";
import { SimpleCounter } from "@/components/ui/AnimatedCounter";
import type { WrappedData } from "@/lib/types";
import { GradientGrainBackground } from "@/components/backgrounds/GradientGrainBackground";

interface OverviewSlideProps {
  data: WrappedData;
}

export function OverviewSlide({ data }: OverviewSlideProps) {
  const activeDaysPercentage = Math.round(
    (data.stats.activeDays / 365) * 100
  );

  return (
    <GradientGrainBackground
      colors={["#1e3a8a", "#4c1d95", "#701a75"]}
      orbColors={["rgba(37, 99, 235, 0.3)", "rgba(126, 34, 206, 0.3)"]}
      className="overflow-y-auto overflow-x-hidden"
    >
      <div className="h-full w-full flex flex-col items-center justify-center p-6 md:p-8 relative">
        {/* Floating calendar icons */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
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
              <Calendar className="w-8 h-8 text-white/12" />
            </motion.div>
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
          <Calendar className="w-10 h-10 text-white" />
        </motion.div>

        {/* Main stat */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-white/70 text-xl mb-4">In {data.year}, you pushed code on</p>
          
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-7xl md:text-9xl font-bold text-white">
              <SimpleCounter value={data.stats.activeDays} duration={1500} />
            </span>
            <span className="text-3xl md:text-4xl text-white/70 font-medium">
              days
            </span>
          </div>

          <p className="text-white/60 text-lg">
            That&apos;s{" "}
            <span className="text-white font-semibold">{activeDaysPercentage}%</span>{" "}
            of the year!
          </p>
        </motion.div>

        {/* Secondary stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 grid grid-cols-2 gap-6"
        >
          <div className="p-4 bg-white/10 backdrop-blur rounded-xl">
            <Code2 className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-white">
              <SimpleCounter value={data.stats.totalReposContributed} duration={1500} />
            </p>
            <p className="text-white/60 text-sm">repositories contributed to</p>
          </div>

          <div className="p-4 bg-white/10 backdrop-blur rounded-xl">
            <div className="w-6 h-6 mx-auto mb-2 text-yellow-400 text-2xl">🏖️</div>
            <p className="text-3xl font-bold text-white">
              <SimpleCounter value={data.stats.idleDays} duration={1500} />
            </p>
            <p className="text-white/60 text-sm">rest days (you earned them!)</p>
          </div>
        </motion.div>

        {/* Fun message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-white/50 italic"
        >
          {activeDaysPercentage > 60
            ? "You're a coding machine! 🤖"
            : activeDaysPercentage > 40
            ? "Great balance between coding and life! ⚖️"
            : "Quality over quantity, right? 💎"}
        </motion.p>
      </motion.div>
    </div>
    </GradientGrainBackground>
  );
}

