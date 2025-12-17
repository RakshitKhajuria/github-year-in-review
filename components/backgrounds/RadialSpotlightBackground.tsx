"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface RadialSpotlightBackgroundProps {
  children: ReactNode;
  spotlightColor?: string; // Hex color for the spotlight
  spotlightIntensity?: number; // 0-1, default 0.3
  className?: string;
}

export function RadialSpotlightBackground({
  children,
  spotlightColor = "#ffffff",
  spotlightIntensity = 0.3,
  className = "",
}: RadialSpotlightBackgroundProps) {
  // Convert hex to rgba for spotlight
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const spotlightStyle = {
    background: `radial-gradient(circle at center, ${hexToRgba(spotlightColor, spotlightIntensity * 0.5)} 0%, transparent 60%)`,
  };

  return (
    <div className={`h-full w-full relative ${className}`}>
      {/* Dark base background */}
      <div className="absolute inset-0 bg-[#0d1117]" />
      
      {/* Animated pulsing orbs behind spotlight */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: hexToRgba(spotlightColor, 0.15) }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
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
          style={{ backgroundColor: hexToRgba(spotlightColor, 0.12) }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
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
      
      {/* Radial spotlight effect */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={spotlightStyle}
      />
      
      {/* Vignette effect for dimmed edges */}
      <div className="absolute inset-0 bg-vignette pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </div>
  );
}

