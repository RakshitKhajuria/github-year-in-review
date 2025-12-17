"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Sparkles, Star } from "lucide-react";
import type { WrappedData } from "@/lib/types";
import { scaleIn, fadeInUp, orchestration } from "@/lib/animations";
import { springs, easings, durations } from "@/lib/motion";
import { RadialSpotlightBackground } from "@/components/backgrounds/RadialSpotlightBackground";

interface WelcomeSlideProps {
  data: WrappedData;
  onNext: () => void;
}

export function WelcomeSlide({ data, onNext }: WelcomeSlideProps) {
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContinue(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <RadialSpotlightBackground
      spotlightColor="#eab308"
      spotlightIntensity={0.3}
      className="overflow-hidden"
    >
      <div className="h-full w-full flex flex-col items-center justify-center p-6 md:p-8 relative">
        {/* Floating star icons - same as stars slide */}
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
              <Star className="w-8 h-8 text-white/12" fill="currentColor" />
            </motion.div>
          ))}
        </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: durations.slow, ease: easings.smooth }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        {/* Avatar with enhanced glow */}
        <motion.div
          initial={{ scale: 0, rotate: -180, filter: "blur(20px)" }}
          animate={{ scale: 1, rotate: 0, filter: "blur(0px)" }}
          transition={{ ...springs.bouncy, delay: 0.2 }}
          className="relative mb-10"
        >
          {/* Animated glow layers */}
          <motion.div 
            className="absolute inset-0 bg-white/40 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div 
            className="absolute inset-0 bg-purple-400/30 rounded-full blur-xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          
          {/* Avatar */}
          <div className="relative w-36 h-36 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-white/40 shadow-depth-lg">
            <Image
              src={data.user.avatarUrl}
              alt={data.user.username}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {/* Star icon */}
          <motion.div
            className="absolute -top-2 -right-2 bg-yellow-300 rounded-full p-2 shadow-depth-md"
            animate={{ 
              rotate: [0, 15, -15, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Star className="w-6 h-6 text-white" fill="white" />
          </motion.div>
        </motion.div>

        {/* Welcome text with staggered animations */}
        <motion.div
          className="mb-8"
        >
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={orchestration.sequence(0, 0.4)}
            className="text-white/90 text-xl mb-3 font-light tracking-wide"
          >
            Welcome back
          </motion.p>
          
          <motion.h1
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            custom={0.5}
            className="text-5xl md:text-7xl font-bold text-white mb-4 text-depth"
          >
            @{data.user.username}
          </motion.h1>
          
          {data.user.name && (
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={orchestration.sequence(2, 0.4)}
              className="text-white/70 text-xl md:text-2xl font-light"
            >
              {data.user.name}
            </motion.p>
          )}
        </motion.div>

        {/* Year badge with enhanced styling */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ ...springs.bouncy, delay: 0.7 }}
          className="relative group mb-10"
        >
          {/* Badge glow */}
          <motion.div
            className="absolute inset-0 bg-white/30 rounded-full blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
          
          <div className="relative px-8 py-4 glass-premium rounded-full shadow-depth-md">
            <span className="text-white font-bold text-2xl md:text-3xl tracking-wide">
              {data.year} Wrapped
            </span>
          </div>
        </motion.div>

        {/* Subtitle with typewriter feel */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0.9}
          className="text-white/80 text-lg md:text-xl max-w-md font-light leading-relaxed"
        >
          Let&apos;s look back at your year in code
        </motion.p>

        {/* Continue hint with enhanced interaction */}
        <AnimatePresence>
          {showContinue && (
            <motion.div
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.2, duration: durations.moderate }}
              className="mt-12"
            >
              <motion.button
                onClick={onNext}
                className="relative group flex items-center gap-3 px-6 py-3 glass-premium rounded-full transition-smooth"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Button glow on hover */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-white/20 blur-lg opacity-0 group-hover:opacity-100"
                  transition={{ duration: durations.normal }}
                />
                
                <span className="text-white/80 group-hover:text-white font-medium transition-colors relative z-10">
                  Tap to continue
                </span>
                
                <motion.span
                  className="text-white relative z-10"
                  animate={{ x: [0, 6, 0] }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  →
                </motion.span>
                
                {/* Ripple effect on click */}
                <motion.div
                  className="absolute inset-0 bg-white/30 rounded-full"
                  initial={{ scale: 0, opacity: 1 }}
                  whileTap={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      </div>
    </RadialSpotlightBackground>
  );
}

