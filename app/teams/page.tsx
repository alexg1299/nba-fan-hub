"use client";

import { useEffect, useState } from "react";
import { Shield } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { Skeleton } from "@/components/ui/Skeleton";
import TeamCard from "@/components/team/TeamCard";
import type { Team } from "@/components/team/TeamCard";
import { useSeason, seasonLabel } from "@/app/context/season-context";
export default function TeamsPage() {
  const { season } = useSeason();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("/api/teams")
      .then((r) => r.json())
      .then((data) => setTeams(data.teams || []))
      .catch(() => setError("Failed to load teams"))
      .finally(() => setLoading(false));
  }, []);

  const east = teams.filter((t) => t.conference === "East").sort((a, b) => a.full_name.localeCompare(b.full_name));
  const west = teams.filter((t) => t.conference === "West").sort((a, b) => a.full_name.localeCompare(b.full_name));

  return (
    <div className="min-h-screen court-pattern" style={{ background: "var(--color-bg)" }}>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 page-enter">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-display font-700 tracking-widest uppercase mb-2 flex items-center gap-2" style={{ color: "var(--color-accent)" }}>
            <span className="inline-block w-4 h-0.5" style={{ background: "var(--color-accent)" }} />
            League · {seasonLabel(season)}
          </p>
          <h1 className="font-hero text-6xl mb-2" style={{ color: "var(--color-text)", letterSpacing: "0.04em" }}>
            TEAMS
          </h1>
          <p className="font-body" style={{ color: "var(--color-text-muted)" }}>Select a team to view roster and player details.</p>
        </div>

        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-16 rounded-xl" />
            ))}
          </div>
        )}

        {error && (
          <div
            className="rounded-xl p-6 text-center"
            style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
          >
            <Shield size={40} className="mx-auto mb-3" style={{ color: "var(--color-text-subtle)" }} />
            <p className="font-display font-600" style={{ color: "var(--color-text-muted)" }}>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Eastern Conference */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full" style={{ background: "#006BB6" }} />
                <h2 className="font-display font-700 text-lg tracking-wide uppercase" style={{ color: "var(--color-text)" }}>
                  Eastern Conference
                </h2>
                <span className="text-xs font-display font-600 px-2 py-0.5 rounded-full" style={{ background: "var(--color-bg-card)", color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}>
                  {east.length}
                </span>
              </div>
              <div className="space-y-2">
                {east.map((t) => <TeamCard key={t.id} team={t} />)}
              </div>
            </div>

            {/* Western Conference */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full" style={{ background: "#CE1141" }} />
                <h2 className="font-display font-700 text-lg tracking-wide uppercase" style={{ color: "var(--color-text)" }}>
                  Western Conference
                </h2>
                <span className="text-xs font-display font-600 px-2 py-0.5 rounded-full" style={{ background: "var(--color-bg-card)", color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}>
                  {west.length}
                </span>
              </div>
              <div className="space-y-2">
                {west.map((t) => <TeamCard key={t.id} team={t} />)}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
