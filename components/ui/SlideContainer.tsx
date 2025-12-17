/**
 * SlideContainer - Consistent layout wrapper for all slides
 * 
 * Provides:
 * - Consistent padding and spacing
 * - Proper overflow handling
 * - Responsive max-widths
 * - Centered content alignment
 * - Smooth scrolling when content overflows
 */

import { ReactNode } from "react";
import { motion, MotionProps } from "framer-motion";

interface SlideContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
  overflow?: "hidden" | "auto" | "visible";
  centerContent?: boolean;
  motionProps?: MotionProps;
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  full: "max-w-full",
};

const paddingClasses = {
  none: "",
  sm: "p-4 md:p-6",
  md: "p-6 md:p-8",
  lg: "p-8 md:p-12",
};

export function SlideContainer({
  children,
  className = "",
  maxWidth = "2xl",
  padding = "md",
  overflow = "auto",
  centerContent = true,
  motionProps,
}: SlideContainerProps) {
  const baseClasses = `
    w-full h-full
    ${overflow === "auto" ? "overflow-y-auto overflow-x-hidden" : overflow === "hidden" ? "overflow-hidden" : ""}
    ${centerContent ? "flex flex-col items-center justify-center" : ""}
    ${paddingClasses[padding]}
    ${maxWidthClasses[maxWidth]}
  `.trim().replace(/\s+/g, " ");

  const content = (
    <div className={`${baseClasses} ${className}`}>
      {children}
    </div>
  );

  if (motionProps) {
    return <motion.div {...motionProps} className={`${baseClasses} ${className}`}>{children}</motion.div>;
  }

  return content;
}

/**
 * SlideContent - Inner content wrapper with consistent spacing
 */
interface SlideContentProps {
  children: ReactNode;
  className?: string;
  spacing?: "tight" | "normal" | "loose";
}

const spacingClasses = {
  tight: "space-y-4",
  normal: "space-y-6",
  loose: "space-y-8",
};

export function SlideContent({
  children,
  className = "",
  spacing = "normal",
}: SlideContentProps) {
  return (
    <div className={`w-full ${spacingClasses[spacing]} ${className}`}>
      {children}
    </div>
  );
}

