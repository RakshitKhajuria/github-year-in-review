"use client";

import { motion } from "framer-motion";
import { FolderGit2, Star, Lock, Globe } from "lucide-react";
import type { WrappedData } from "@/lib/types";
import { getLanguageColor } from "@/lib/utils";
import { RadialSpotlightBackground } from "@/components/backgrounds/RadialSpotlightBackground";

interface ReposSlideProps {
  data: WrappedData;
}

export function ReposSlide({ data }: ReposSlideProps) {
  const { repositories } = data;
  const topRepo = repositories.top[0];

  return (
    <RadialSpotlightBackground
      spotlightColor="#06b6d4"
      spotlightIntensity={0.3}
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
        className="relative z-10 text-center w-full max-w-2xl mx-auto my-auto"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="inline-flex p-4 rounded-full bg-white/10 mb-6"
        >
          <FolderGit2 className="w-10 h-10 text-white" />
        </motion.div>

        {/* Intro */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/70 text-xl mb-4"
        >
          You couldn&apos;t stop working on
        </motion.p>

        {/* Top repository */}
        {topRepo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="inline-block p-6 bg-white/10 backdrop-blur rounded-2xl">
              <div className="flex items-center justify-center gap-2 mb-3">
                {topRepo.isPrivate ? (
                  <Lock className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Globe className="w-5 h-5 text-green-400" />
                )}
                <span className="text-white/60 text-sm">
                  {topRepo.isPrivate ? "Private" : "Public"}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {topRepo.name}
              </h2>
              <p className="text-white/60 mb-4">{topRepo.owner}/{topRepo.name}</p>
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-1">
                  {topRepo.language && (
                    <>
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getLanguageColor(topRepo.language, topRepo.languageColor) }}
                      />
                      <span className="text-white/80">{topRepo.language}</span>
                    </>
                  )}
                </div>
                {topRepo.stars > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-white/80">{topRepo.stars}</span>
                  </div>
                )}
                <span className="text-white font-semibold">
                  {topRepo.commits} commits
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Other repositories */}
        {repositories.top.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <p className="text-white/60 text-sm mb-3">Also keeping you busy:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {repositories.top.slice(1, 4).map((repo, index) => (
                <motion.div
                  key={repo.fullName}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="px-4 py-2 bg-white/10 backdrop-blur rounded-lg flex items-center gap-2"
                >
                  {repo.isPrivate ? (
                    <Lock className="w-3 h-3 text-yellow-400" />
                  ) : (
                    <Globe className="w-3 h-3 text-green-400" />
                  )}
                  <span className="text-white text-sm">{repo.name}</span>
                  <span className="text-white/40 text-xs">{repo.commits}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Total repos stat */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-white/60"
        >
          You contributed to{" "}
          <span className="text-white font-semibold">{repositories.totalContributed}</span>{" "}
          repositories this year
        </motion.p>

        {/* Fun message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-4 text-white/50 italic"
        >
          {repositories.totalContributed >= 20
            ? "You're everywhere! 🌟"
            : repositories.totalContributed >= 10
            ? "Diverse contributions! 🎨"
            : "Focused effort! 🎯"}
        </motion.p>
      </motion.div>
    </div>
    </RadialSpotlightBackground>
  );
}

