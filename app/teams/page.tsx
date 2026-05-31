"use client";

import { useEffect, useState } from "react";
import { Shield, ChevronRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Skeleton } from "@/components/Skeleton";
import { useSeason, seasonLabel } from "@/app/context/season-context";
import { getTeamColors } from "@/lib/nba-api";

interface Team {
  id: number;
  abbreviation: string;
  city: string;
  conference: string;
  division: string;
  full_name: string;
  name: string;
}

function TeamCard({ team }: { team: Team }) {
  const colors = getTeamColors(team.abbreviation);
  return (
    <Link
      href={`/teams/${team.id}`}
      className="group flex items-center justify-between rounded-xl p-4 transition-all hover:scale-[1.01]"
      style={{
        background: "var(--color-bg-card)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center font-display font-800 text-xs text-white shrink-0"
          style={{ background: colors.primary }}
        >
          {team.abbreviation}
        </div>
        <div>
          <p className="font-display font-700 text-base" style={{ color: "var(--color-text)" }}>
            {team.full_name}
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            {team.division} · {team.conference}ern Conference
          </p>
        </div>
      </div>
      <ChevronRight
        size={16}
        className="transition-transform group-hover:translate-x-1"
        style={{ color: "var(--color-text-subtle)" }}
      />
    </Link>
  );
}

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
          <p className="text-xs font-display font-600 tracking-widest uppercase mb-1" style={{ color: "var(--color-accent)" }}>
            League · {seasonLabel(season)}
          </p>
          <h1 className="font-display font-800 text-5xl tracking-tight mb-2" style={{ color: "var(--color-text)" }}>
            Teams
          </h1>
          <p style={{ color: "var(--color-text-muted)" }}>Select a team to view roster and player details.</p>
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
