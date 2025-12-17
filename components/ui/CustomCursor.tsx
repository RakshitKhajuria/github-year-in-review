"use client";

import { useEffect, useState, useRef } from "react";

// Detect touch devices once
const isTouchDevice = 
  typeof window !== 'undefined' && (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore
    (navigator.msMaxTouchPoints > 0)
  );

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const mousePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Disable on touch devices
    if (isTouchDevice) {
      return;
    }

    let cursorX = 0;
    let cursorY = 0;
    let isAnimating = false;

    const updateCursor = () => {
      // Smooth interpolation for lag-free movement (easing factor)
      cursorX += (mousePosRef.current.x - cursorX) * 0.2;
      cursorY += (mousePosRef.current.y - cursorY) * 0.2;

      setPosition({ x: cursorX, y: cursorY });

      // Continue animation if mouse is still moving
      if (Math.abs(mousePosRef.current.x - cursorX) > 0.1 || Math.abs(mousePosRef.current.y - cursorY) > 0.1) {
        rafRef.current = requestAnimationFrame(updateCursor);
      } else {
        isAnimating = false;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current.x = e.clientX;
      mousePosRef.current.y = e.clientY;
      
      if (!isVisible) {
        setIsVisible(true);
        cursorX = e.clientX;
        cursorY = e.clientY;
        setPosition({ x: cursorX, y: cursorY });
      }
      
      if (!isAnimating) {
        isAnimating = true;
        rafRef.current = requestAnimationFrame(updateCursor);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      isAnimating = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      // Check if hovering over interactive elements
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.closest('button') !== null ||
        target.closest('a') !== null ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      setIsPointer(isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseover', handleMouseOver);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isVisible]);

  // Don't render on touch devices
  if (isTouchDevice) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.15s ease-out',
        willChange: 'transform',
      }}
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        <svg
          width="28"
          height="28"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-200 ease-out ${isPointer ? 'scale-110 rotate-12' : 'scale-100 rotate-0'}`}
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}
        >
          {/* Octocat body - GitHub logo */}
          <path
            d="M16 0C7.163 0 0 7.163 0 16c0 7.07 4.584 13.066 10.942 15.18.8.147 1.092-.347 1.092-.77 0-.38-.014-1.387-.022-2.72-4.45.967-5.39-2.144-5.39-2.144-.728-1.85-1.778-2.343-1.778-2.343-1.453-.994.11-.974.11-.974 1.606.113 2.452 1.65 2.452 1.65 1.428 2.447 3.745 1.74 4.656 1.33.146-1.034.558-1.74 1.016-2.142-3.554-.404-7.29-1.778-7.29-7.92 0-1.75.625-3.18 1.65-4.3-.165-.404-.715-2.03.156-4.234 0 0 1.344-.43 4.4 1.642 1.276-.355 2.645-.532 4.006-.538 1.36.006 2.73.183 4.006.538 3.056-2.072 4.4-1.642 4.4-1.642.871 2.204.321 3.83.156 4.234 1.025 1.12 1.65 2.55 1.65 4.3 0 6.152-3.74 7.512-7.302 7.91.574.495 1.085 1.47 1.085 2.962 0 2.14-.02 3.864-.02 4.39 0 .427.29.924 1.1.77C27.416 29.066 32 23.07 32 16 32 7.163 24.837 0 16 0z"
            fill="white"
            fillOpacity="0.9"
          />
          {/* Octocat face - eyes */}
          <circle cx="12.5" cy="12.5" r="1.2" fill="#0d1117" />
          <circle cx="19.5" cy="12.5" r="1.2" fill="#0d1117" />
          {/* Octocat face - smile */}
          <path
            d="M10.5 18.5 Q16 20.5 21.5 18.5"
            stroke="#0d1117"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
}

