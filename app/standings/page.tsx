"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import StandingsTable from "@/components/standings/StandingsTable";
import type { StandingsEntry } from "@/types/nba";
import { useSeason, seasonLabel } from "@/app/context/season-context";

export default function StandingsPage() {
  const [standings, setStandings] = useState<{ east: StandingsEntry[]; west: StandingsEntry[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const { season } = useSeason();

  useEffect(() => {
    setLoading(true);
    setStandings(null);
    fetch(`/api/standings?season=${season}`)
      .then((r) => r.json())
      .then((d) => setStandings(d.standings))
      .finally(() => setLoading(false));
  }, [season]);

  return (
    <div className="min-h-screen court-pattern" style={{ background: "var(--color-bg)" }}>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 page-enter">
        <div className="mb-8">
          <p className="text-xs font-display font-700 tracking-widest uppercase mb-2 flex items-center gap-2" style={{ color: "var(--color-accent)" }}>
            <span className="inline-block w-4 h-0.5" style={{ background: "var(--color-accent)" }} />
            {seasonLabel(season)} Season
          </p>
          <h1 className="font-hero text-6xl" style={{ color: "var(--color-text)", letterSpacing: "0.04em" }}>
            STANDINGS
          </h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[0, 1].map((i) => (
              <div key={i} className="rounded-2xl h-96 animate-pulse" style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }} />
            ))}
          </div>
        ) : standings ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StandingsTable teams={standings.east} conference="East" />
            <StandingsTable teams={standings.west} conference="West" />
          </div>
        ) : (
          <p style={{ color: "var(--color-text-muted)" }}>Unable to load standings.</p>
        )}
      </main>
    </div>
  );
}
