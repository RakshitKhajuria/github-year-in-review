"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { WrappedData } from "@/lib/types";
import { RadialSpotlightBackground } from "@/components/backgrounds/RadialSpotlightBackground";

interface PersonalitySlideProps {
  data: WrappedData;
}

export function PersonalitySlide({ data }: PersonalitySlideProps) {
  const { personality } = data;
  const { primary, badges } = personality;

  return (
    <RadialSpotlightBackground
      spotlightColor={primary.color}
      spotlightIntensity={0.3}
      className="overflow-y-auto overflow-x-hidden"
    >
      <div className="h-full w-full flex flex-col items-center justify-center p-6 md:p-8 relative">
        {/* Floating sparkle icons */}
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
              <Sparkles className="w-8 h-8 text-white/12" />
            </motion.div>
          ))}
        </div>

        {/* Floating emoji
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute text-6xl"
            style={{
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 80 + 10}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.3, 0],
              scale: [0.5, 1, 0.5],
              rotate: [0, 20, -20, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: i * 0.7,
            }}
          >
            {primary.emoji}
          </motion.span>
        ))}
      </div> */}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 text-center w-full max-w-2xl mx-auto my-auto"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="inline-flex p-4 rounded-full bg-white/10 mb-6"
        >
          <Sparkles className="w-10 h-10 text-white" />
        </motion.div>

        {/* Intro */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/70 text-xl mb-6"
        >
          Based on your coding patterns, you are a...
        </motion.p>

        {/* Primary personality */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="mb-6"
        >
          <motion.span
            className="text-8xl md:text-9xl block mb-4"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              repeatDelay: 1,
            }}
          >
            {primary.emoji}
          </motion.span>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {primary.label}
          </h2>
          <p className="text-white/70 text-xl max-w-md mx-auto">
            {primary.description}
          </p>
        </motion.div>

        {/* Additional badges */}
        {badges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8"
          >
            <p className="text-white/50 text-sm mb-3">Also earned:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {badges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full"
                  style={{ borderColor: badge.color, borderWidth: 1 }}
                >
                  <span className="text-xl">{badge.emoji}</span>
                  <span className="text-white text-sm">{badge.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Fun footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-10 text-white/40 italic text-sm"
        >
          Your unique coding personality! ✨
        </motion.p>
      </motion.div>
    </div>
    </RadialSpotlightBackground>
  );
}

