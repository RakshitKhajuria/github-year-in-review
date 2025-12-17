"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Sparkles } from "lucide-react";

interface CelebrationBackgroundProps {
  children: ReactNode;
  intensity?: "subtle" | "medium";
  className?: string;
}

export function CelebrationBackground({
  children,
  intensity = "subtle",
  className = "",
}: CelebrationBackgroundProps) {
  const particleCount = intensity === "subtle" ? 6 : 8;

  return (
    <div className={`h-full w-full relative ${className}`}>
      {/* Dark gradient base */}
      <div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #0a0a0f 0%, #1a1625 50%, #1e1b2e 100%)",
        }}
      />

      {/* Subtle celebration particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(particleCount)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute"
            style={{
              left: `${10 + (i % 3) * 35}%`,
              top: `${15 + Math.floor(i / 3) * 35}%`,
            }}
            animate={{
              y: [0, -60, 0],
              opacity: [0, 0.3, 0],
              rotate: [0, 180, 360],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 10 + i * 0.5,
              repeat: Infinity,
              delay: i * 1.2,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="w-6 h-6 text-white/30" />
          </motion.div>
        ))}

        {/* Floating confetti elements */}
        {[...Array(particleCount)].map((_, i) => (
          <motion.div
            key={`confetti-${i}`}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${20 + (i % 3) * 30}%`,
              top: `${10 + Math.floor(i / 3) * 40}%`,
              backgroundColor: [
                "rgba(109, 40, 217, 0.5)",
                "rgba(190, 24, 93, 0.5)",
                "rgba(22, 163, 74, 0.5)",
                "rgba(202, 138, 4, 0.5)",
              ][i % 4],
            }}
            animate={{
              y: [0, -80, 0],
              x: [0, (i % 2 === 0 ? 20 : -20), 0],
              opacity: [0, 0.4, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 12 + i * 0.3,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Subtle grain overlay */}
      <div className="grain-overlay" style={{ opacity: 0.02 }} />

      {/* Content */}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </div>
  );
}

