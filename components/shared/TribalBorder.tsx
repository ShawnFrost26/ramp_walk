"use client";

import React from "react";

interface TribalBorderProps {
  /** Optional custom height or additional styling */
  className?: string;
  /** Whether this is placed at the top (e.g. above footer) or bottom (e.g. below header) */
  variant?: "header" | "footer" | "standalone";
}

/**
 * TribalBorder Component
 * Renders an authentic repeating tribal dance border motif (in vermilion red and emerald green)
 * inspired by traditional Adivasi handloom border art.
 */
export function TribalBorder({ className = "", variant = "header" }: TribalBorderProps) {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={`w-full overflow-hidden select-none relative ${
        variant === "header"
          ? "border-b border-[#74091A] shadow-xs"
          : variant === "footer"
          ? "border-b border-[#74091A]/60"
          : ""
      } ${className}`}
      style={{
        height: "22px",
        backgroundImage: "url('/images/tribal-border-pattern.svg')",
        backgroundRepeat: "repeat-x",
        backgroundPosition: "center",
        backgroundSize: "auto 100%",
        imageRendering: "auto",
      }}
    />
  );
}
