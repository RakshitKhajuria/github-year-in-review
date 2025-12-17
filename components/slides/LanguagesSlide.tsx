"use client";

import { motion } from "framer-motion";
import { Code2, Palette } from "lucide-react";
import type { WrappedData } from "@/lib/types";
import { getLanguageColor } from "@/lib/utils";
import { GradientGrainBackground } from "@/components/backgrounds/GradientGrainBackground";

interface LanguagesSlideProps {
  data: WrappedData;
}

export function LanguagesSlide({ data }: LanguagesSlideProps) {
  const { languages } = data;
  const primaryLang = languages.top[0];

  return (
    <GradientGrainBackground
      colors={["#164e63", "#1e3a8a", "#1e40af"]}
      orbColors={["rgba(8, 145, 178, 0.3)", "rgba(37, 99, 235, 0.3)"]}
      className="overflow-y-auto overflow-x-hidden"
    >
      <div className="h-full w-full flex flex-col items-center justify-center p-6 md:p-8 relative">
        {/* Floating code brackets */}
        <div className="absolute inset-0 pointer-events-none">
        {["{ }", "[ ]", "< />", "( )", "=>", "::"].map((symbol, i) => (
          <motion.span
            key={i}
              className="absolute text-white/8 font-mono text-4xl font-bold"
            style={{
                left: `${5 + (i % 3) * 30}%`,
                top: `${10 + Math.floor(i / 3) * 30}%`,
            }}
            animate={{
                opacity: [0, 0.2, 0],
                scale: [0.7, 1, 0.7],
                rotate: [0, 20, -20, 0],
            }}
            transition={{
                duration: 5 + i * 0.3,
              repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut",
            }}
          >
            {symbol}
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
          <Code2 className="w-10 h-10 text-white" />
        </motion.div>

        {/* Intro */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/70 text-xl mb-6"
        >
          Your coding DNA says you&apos;re a
        </motion.p>

        {/* Primary language */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur">
            <div
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: getLanguageColor(primaryLang.name, primaryLang.color) }}
            />
            <span className="text-4xl md:text-5xl font-bold text-white">
              {primaryLang.name}
            </span>
            <span className="text-white/60 text-lg">developer</span>
          </div>
        </motion.div>

        {/* Language breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3 mb-8 max-w-md mx-auto"
        >
          {languages.top.slice(0, 5).map((lang, index) => (
            <motion.div
              key={lang.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: getLanguageColor(lang.name, lang.color) }}
              />
              <span className="text-white flex-shrink-0 w-24 text-left">{lang.name}</span>
              <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: getLanguageColor(lang.name, lang.color) }}
                  initial={{ width: 0 }}
                  animate={{ width: `${lang.percentage}%` }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                />
              </div>
              <span className="text-white/60 w-12 text-right">{lang.percentage}%</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Total languages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex items-center justify-center gap-2 text-white/60"
        >
          <Palette className="w-4 h-4" />
          <span>
            You used <span className="text-white font-semibold">{languages.total}</span>{" "}
            different languages this year
          </span>
        </motion.div>

        {/* Fun message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6 text-white/50 italic"
        >
          {languages.total >= 5
            ? "A true polyglot! 🌍"
            : languages.total >= 3
            ? "Versatile developer! 🎯"
            : "Focused and specialized! 🎪"}
        </motion.p>
      </motion.div>
    </div>
    </GradientGrainBackground>
  );
}

