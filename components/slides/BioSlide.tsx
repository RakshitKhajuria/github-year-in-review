"use client";

import { motion } from "framer-motion";
import { Quote, User } from "lucide-react";
import type { WrappedData } from "@/lib/types";
import { fadeInUp, orchestration } from "@/lib/animations";
import { durations } from "@/lib/motion";
import { GradientGrainBackground } from "@/components/backgrounds/GradientGrainBackground";

interface BioSlideProps {
  data: WrappedData;
}

export function BioSlide({ data }: BioSlideProps) {
  const { bio, name, username } = data.user;

  // If no bio, show a generated message
  const displayText = bio || `@${username} is building something amazing on GitHub.`;

  return (
    <GradientGrainBackground
      colors={["#134e4a", "#155e75", "#0c4a6e"]}
      orbColors={["rgba(20, 184, 166, 0.25)", "rgba(8, 145, 178, 0.3)"]}
      className="overflow-y-auto overflow-x-hidden"
    >
      <div className="h-full w-full flex flex-col items-center justify-center p-6 md:p-8 relative">
        {/* Floating quote marks */}
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
              <Quote className="w-8 h-8 text-white/12" />
            </motion.div>
          ))}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: durations.moderate }}
        className="relative z-10 text-center max-w-3xl w-full"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          className="inline-flex p-4 rounded-full bg-white/10 backdrop-blur-sm mb-8"
        >
          <Quote className="w-10 h-10 text-white" />
        </motion.div>

        {/* Headline */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={orchestration.sequence(0, 0.2)}
          className="text-white/80 text-xl md:text-2xl mb-8 font-light"
        >
          {name ? `${name}'s` : `@${username}'s`} GitHub story
        </motion.p>

        {/* Bio quote card */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={orchestration.sequence(1, 0.2)}
          className="relative p-8 md:p-12 glass-premium rounded-3xl shadow-depth-lg mb-8"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {/* Quote marks */}
          <motion.div
            className="absolute top-4 left-4 text-white/20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            <Quote className="w-12 h-12 md:w-16 md:h-16" />
          </motion.div>

          {/* Bio text */}
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={orchestration.sequence(2, 0.2)}
            className="text-white text-xl md:text-2xl font-light leading-relaxed relative z-10"
            style={{ textAlign: "left" }}
          >
            {displayText}
          </motion.p>

          {/* Closing quote */}
          <motion.div
            className="absolute bottom-4 right-4 text-white/20 rotate-180"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, type: "spring" }}
          >
            <Quote className="w-12 h-12 md:w-16 md:h-16" />
          </motion.div>
        </motion.div>

        {/* Fun message */}
        {bio && (
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={orchestration.sequence(3, 0.2)}
            className="text-white/70 text-lg italic"
          >
            Your story in your own words 📝
          </motion.p>
        )}
      </motion.div>
    </div>
    </GradientGrainBackground>
  );
}

