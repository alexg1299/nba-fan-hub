"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import StandingsTable from "@/components/StandingsTable";
import type { StandingsEntry } from "@/types/nba";

export default function StandingsPage() {
  const [standings, setStandings] = useState<{ east: StandingsEntry[]; west: StandingsEntry[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/standings")
      .then((r) => r.json())
      .then((d) => setStandings(d.standings))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen court-pattern" style={{ background: "var(--color-bg)" }}>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 page-enter">
        <div className="mb-8">
          <p className="text-xs font-display font-600 tracking-widest uppercase mb-1" style={{ color: "var(--color-accent)" }}>
            2024-25 Season
          </p>
          <h1 className="font-display font-800 text-5xl tracking-tight" style={{ color: "var(--color-text)" }}>
            Standings
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
