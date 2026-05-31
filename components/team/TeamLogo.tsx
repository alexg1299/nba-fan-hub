"use client";

import Image from "next/image";
import { useState } from "react";
import { getTeamColors, getTeamLogoUrl } from "@/lib/nba-api";

interface TeamLogoProps {
  abbreviation: string;
  size?: number;
  /**
   * "circle" – circular fallback with team color background (used in card/list views)
   * "box"    – rounded-2xl box with translucent team-color background (used in hero/detail views)
   */
  variant?: "circle" | "box";
  className?: string;
}

/**
 * Reusable team logo image with a graceful fallback to abbreviation text.
 * Used across GameCard, game detail hero, teams list, and team detail pages.
 */
export default function TeamLogo({ abbreviation, size = 52, variant = "circle", className }: TeamLogoProps) {
  const [imgError, setImgError] = useState(false);
  const colors = getTeamColors(abbreviation);

  if (variant === "box") {
    return (
      <div
        className={`rounded-2xl flex items-center justify-center shrink-0 overflow-hidden shadow-lg ${className ?? ""}`}
        style={{
          width: size,
          height: size,
          background: `${colors.primary}18`,
          border: `1px solid ${colors.primary}33`,
        }}
      >
        {!imgError ? (
          <Image
            src={getTeamLogoUrl(abbreviation)}
            alt={abbreviation}
            width={size}
            height={size}
            className="object-contain"
            onError={() => setImgError(true)}
            unoptimized
          />
        ) : (
          <span className="font-display font-800 text-xl" style={{ color: colors.primary }}>
            {abbreviation}
          </span>
        )}
      </div>
    );
  }

  // circle variant (default)
  if (imgError) {
    return (
      <div
        className={`rounded-full flex items-center justify-center font-display font-800 text-white ${className ?? ""}`}
        style={{ width: size, height: size, background: colors.primary, fontSize: size * 0.28 }}
      >
        {abbreviation}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className ?? ""}`} style={{ width: size, height: size }}>
      <Image
        src={getTeamLogoUrl(abbreviation)}
        alt={abbreviation}
        width={size}
        height={size}
        className="object-contain drop-shadow-sm"
        onError={() => setImgError(true)}
        unoptimized
      />
    </div>
  );
}
