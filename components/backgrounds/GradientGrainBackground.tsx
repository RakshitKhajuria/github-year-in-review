"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GradientGrainBackgroundProps {
  children: ReactNode;
  colors: string[]; // Array of 2-3 gradient colors (hex or Tailwind)
  grainOpacity?: number;
  orbColors?: [string, string]; // Colors for the two animated orbs
  className?: string;
}

export function GradientGrainBackground({
  children,
  colors,
  grainOpacity = 0.03,
  orbColors = ["rgba(139, 92, 246, 0.2)", "rgba(236, 72, 153, 0.2)"], // Default purple and pink
  className = "",
}: GradientGrainBackgroundProps) {
  // Create gradient style from colors array
  const gradientStyle = {
    background: colors.length === 2
      ? `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`
      : colors.length === 3
      ? `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`
      : `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`,
  };

  return (
    <div className={`h-full w-full relative ${className}`} style={gradientStyle}>
      {/* Animated pulsing orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: orbColors[0] }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.6, 0.4],
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: orbColors[1] }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Grain overlay */}
      <div className="grain-overlay" style={{ opacity: grainOpacity }} />

      {/* Content */}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </div>
  );
}

