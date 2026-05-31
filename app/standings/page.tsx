"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import StandingsTable from "@/components/standings/StandingsTable";
import type { StandingsEntry } from "@/types/nba";
import { useSeason, seasonLabel } from "@/app/context/season-context";
import Hero from "@/components/layout/Hero";

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
        <Hero title="STANDINGS" dataSource="api" season={season} />

        {loading ? (
          <div className="flex flex-col gap-6">
            {[0, 1].map((i) => (
              <div key={i} className="rounded-2xl h-96 animate-pulse" style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }} />
            ))}
          </div>
        ) : standings ? (
          <div className="flex flex-col gap-6">
            <StandingsTable teams={standings.east} conference="East" compact={false} />
            <StandingsTable teams={standings.west} conference="West" compact={false} />
          </div>
        ) : (
          <p style={{ color: "var(--color-text-muted)" }}>Unable to load standings.</p>
        )}
      </main>
    </div>
  );
}
