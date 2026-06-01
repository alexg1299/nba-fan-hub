"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// NBA seasons available in BallDontLie API (year = year the season started)
export const AVAILABLE_SEASONS = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015];

export function seasonLabel(season: number): string {
  return `${season}-${String(season + 1).slice(-2)}`;
}

interface SeasonContextValue {
  season: number;
  setSeason: (season: number) => void;
}

const SeasonContext = createContext<SeasonContextValue | null>(null);

export function SeasonProvider({ children }: { children: ReactNode }) {
  // Default: 2025 = 2025-26 season
  const [season, setSeason] = useState<number>(2025);

  return (
    <SeasonContext.Provider value={{ season, setSeason }}>
      {children}
    </SeasonContext.Provider>
  );
}

export function useSeason() {
  const ctx = useContext(SeasonContext);
  if (!ctx) throw new Error("useSeason must be used within a SeasonProvider");
  return ctx;
}
