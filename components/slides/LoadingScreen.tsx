"use client";

import { motion } from "framer-motion";
import { Github, Code2, GitBranch, GitCommit } from "lucide-react";

interface LoadingScreenProps {
  username: string;
}

export function LoadingScreen({ username }: LoadingScreenProps) {
  const loadingTexts = [
    "Fetching your commits...",
    "Analyzing your code...",
    "Calculating your stats...",
    "Building your story...",
    "Almost there...",
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-github-darker relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Floating icons */}
      <div className="absolute inset-0 pointer-events-none">
        {[Code2, GitBranch, GitCommit].map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute text-white/10"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.3, 0],
              y: [0, -100],
              x: Math.sin(i * 2) * 50,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.8,
            }}
            style={{
              left: `${20 + i * 30}%`,
              top: "70%",
            }}
          >
            <Icon className="w-8 h-8" />
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4">
        {/* Animated logo */}
        <motion.div
          className="mb-6"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 bg-github-green/20 rounded-full blur-xl"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <Github className="w-20 h-20 text-white relative z-10" />
          </div>
        </motion.div>

        {/* Username */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-white mb-8 text-center"
        >
          @{username}
        </motion.h1>

        {/* Loading spinner */}
        <div className="mb-6">
          <motion.div
            className="w-12 h-12 border-4 border-white/20 border-t-github-green rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Animated loading text */}
        <div className="h-8 flex items-center justify-center mb-4 min-w-[200px]">
            {loadingTexts.map((text, i) => (
              <motion.span
                key={text}
              initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 2,
                  repeat: Infinity,
                  repeatDelay: loadingTexts.length * 2 - 2,
                }}
              className="absolute text-github-muted text-lg text-center"
              >
                {text}
              </motion.span>
            ))}
        </div>

        {/* Progress dots */}
        <div className="flex gap-2 justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-white/50 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

