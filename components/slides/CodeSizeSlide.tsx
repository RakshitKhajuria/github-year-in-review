"use client";

import { motion } from "framer-motion";
import { Code2, FileCode, TrendingUp } from "lucide-react";
import type { WrappedData } from "@/lib/types";
import { fadeInUp, orchestration } from "@/lib/animations";
import { durations } from "@/lib/motion";
import { GradientGrainBackground } from "@/components/backgrounds/GradientGrainBackground";

interface CodeSizeSlideProps {
  data: WrappedData;
}

export function CodeSizeSlide({ data }: CodeSizeSlideProps) {
  // Filter languages with code size data
  const languagesWithSize = data.languages.top.filter((lang) => lang.codeSize && lang.codeSize > 0);
  
  // Calculate total code size
  const totalCodeSize = languagesWithSize.reduce((sum, lang) => sum + (lang.codeSize || 0), 0);
  
  // Format bytes to human readable
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  // Find largest language
  const largestLanguage = languagesWithSize.length > 0
    ? languagesWithSize.reduce((max, lang) => 
        (lang.codeSize || 0) > (max.codeSize || 0) ? lang : max
      )
    : null;

  if (languagesWithSize.length === 0) {
    // Fallback if no code size data
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-6 md:p-8 relative overflow-y-auto overflow-x-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 text-center"
        >
          <Code2 className="w-16 h-16 text-white/50 mx-auto mb-4" />
          <p className="text-white/70 text-xl">
            Code size data not available
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <GradientGrainBackground
      colors={["#14532d", "#065f46", "#064e3b"]}
      orbColors={["rgba(34, 197, 94, 0.3)", "rgba(16, 185, 129, 0.3)"]}
      className="overflow-y-auto overflow-x-hidden"
    >
      <div className="h-full w-full flex flex-col items-center justify-center p-6 md:p-8 relative">
        {/* Floating code icons */}
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
              <Code2 className="w-8 h-8 text-white/12" />
            </motion.div>
          ))}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: durations.moderate }}
        className="relative z-10 text-center w-full max-w-2xl mx-auto my-auto px-4"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          className="inline-flex p-3 rounded-full bg-white/10 backdrop-blur-sm mb-6"
        >
          <FileCode className="w-8 h-8 text-white" />
        </motion.div>

        {/* Main headline */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={orchestration.sequence(0, 0.2)}
          className="text-white/80 text-lg md:text-xl mb-4 font-light"
        >
          You wrote
        </motion.p>

        {/* Total code size */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={orchestration.sequence(1, 0.2)}
          className="mb-6"
        >
          <p className="text-5xl md:text-7xl font-bold text-white mb-1 drop-shadow-2xl">
            {formatBytes(totalCodeSize)}
          </p>
          <p className="text-white/70 text-base md:text-lg">of code</p>
        </motion.div>

        {/* Top languages by size - Compact and appealing */}
        {languagesWithSize.length > 0 && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={orchestration.sequence(2, 0.2)}
            className="space-y-2.5 mb-6 max-w-lg mx-auto"
          >
            <p className="text-white/60 text-xs md:text-sm mb-3 font-medium">By language:</p>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 md:p-5 border border-white/10">
            {languagesWithSize.slice(0, 5).map((lang, index) => {
              const percentage = totalCodeSize > 0 
                ? Math.round((lang.codeSize! / totalCodeSize) * 100) 
                : 0;
              
              return (
                <motion.div
                  key={lang.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.08 }}
                    className="flex items-center gap-3 mb-2.5 last:mb-0"
                >
                    {/* Language color dot */}
                  <div
                      className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: lang.color || "#8b949e" }}
                  />
                    {/* Language name */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm md:text-base truncate">{lang.name}</p>
                    </div>
                    {/* Progress bar */}
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden max-w-[120px] md:max-w-[150px]">
                        <motion.div
                        className="h-full rounded-full shadow-sm"
                        style={{ backgroundColor: lang.color || "#8b949e" }}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.5 + index * 0.08, duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    {/* Size value */}
                    <span className="text-white/80 text-xs md:text-sm font-medium w-16 md:w-20 text-right flex-shrink-0">
                        {formatBytes(lang.codeSize!)}
                      </span>
                </motion.div>
              );
            })}
            </div>
          </motion.div>
        )}

        {/* Fun fact */}
        {largestLanguage && (
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={orchestration.sequence(3, 0.2)}
            className="text-white/70 text-sm md:text-base italic"
          >
            Most code written in <span className="font-semibold text-white">{largestLanguage.name}</span> 💻
          </motion.p>
        )}
      </motion.div>
    </div>
    </GradientGrainBackground>
  );
}

