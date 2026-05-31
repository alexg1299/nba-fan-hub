"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Users, AlertCircle, ChevronRight } from "lucide-react";
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

interface Player {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  height?: string;
  weight?: string;
  jersey_number?: string;
  college?: string;
  country?: string;
}

const POSITION_ORDER: Record<string, number> = { G: 0, F: 1, C: 2, "G-F": 3, "F-G": 4, "F-C": 5, "C-F": 6, "": 99 };

function sortPlayers(players: Player[]) {
  return [...players].sort((a, b) => {
    const pa = POSITION_ORDER[a.position] ?? 99;
    const pb = POSITION_ORDER[b.position] ?? 99;
    if (pa !== pb) return pa - pb;
    return `${a.last_name}${a.first_name}`.localeCompare(`${b.last_name}${b.first_name}`);
  });
}

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { season } = useSeason();

  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetch(`/api/teams/${id}?season=${season}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setTeam(data.team);
        setPlayers(data.players || []);
      })
      .catch((e) => setError(e.message || "Failed to load team"))
      .finally(() => setLoading(false));
  }, [id, season]);

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          <Skeleton className="w-24 h-8 rounded-lg" />
          <Skeleton className="w-full h-32 rounded-2xl" />
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="w-full h-16 rounded-xl" />)}
          </div>
        </main>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <AlertCircle size={48} className="mx-auto mb-4" style={{ color: "var(--color-accent)" }} />
          <h2 className="font-display font-700 text-2xl mb-2" style={{ color: "var(--color-text)" }}>Team not found</h2>
          <p className="mb-6" style={{ color: "var(--color-text-muted)" }}>{error || "This team doesn't exist."}</p>
          <button onClick={() => router.back()} className="btn-primary px-6 py-2 rounded-lg text-sm">Go Back</button>
        </main>
      </div>
    );
  }

  const colors = getTeamColors(team.abbreviation);
  const sorted = sortPlayers(players);

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 page-enter">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 mb-6 text-sm font-display font-600 tracking-wide transition-opacity hover:opacity-70"
          style={{ color: "var(--color-text-muted)" }}
        >
          <ArrowLeft size={14} />
          Teams
        </button>

        {/* Team header */}
        <div
          className="rounded-2xl p-6 mb-8"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}22 0%, ${colors.secondary}11 100%)`,
            border: `1px solid ${colors.primary}44`,
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center font-display font-900 text-lg text-white shrink-0"
              style={{ background: colors.primary }}
            >
              {team.abbreviation}
            </div>
            <div>
              <p className="text-xs font-display font-600 tracking-widest uppercase mb-1" style={{ color: colors.primary }}>
                {team.conference}ern Conference · {team.division}
              </p>
              <h1 className="font-display font-800 text-3xl sm:text-4xl tracking-tight" style={{ color: "var(--color-text)" }}>
                {team.full_name}
              </h1>
              <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
                {seasonLabel(season)} Roster · {players.length} players
              </p>
            </div>
          </div>
        </div>

        {/* Roster */}
        <div className="mb-4 flex items-center gap-2">
          <Users size={16} style={{ color: "var(--color-accent)" }} />
          <h2 className="font-display font-700 text-lg tracking-wide uppercase" style={{ color: "var(--color-text)" }}>
            Roster
          </h2>
        </div>

        {players.length === 0 ? (
          <div
            className="rounded-xl p-8 text-center"
            style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
          >
            <Users size={36} className="mx-auto mb-3" style={{ color: "var(--color-text-subtle)" }} />
            <p className="font-display font-600" style={{ color: "var(--color-text-muted)" }}>
              No roster data available for {seasonLabel(season)}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {sorted.map((player) => (
              <Link
                key={player.id}
                href={`/players/${player.id}?season=${season}`}
                className="group flex items-center justify-between rounded-xl p-4 transition-all hover:scale-[1.005]"
                style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-display font-800 text-sm text-white shrink-0"
                    style={{ background: colors.primary }}
                  >
                    {player.first_name[0]}{player.last_name[0]}
                  </div>
                  <div>
                    <p className="font-display font-700 text-base" style={{ color: "var(--color-text)" }}>
                      {player.first_name} {player.last_name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {player.position && (
                        <span
                          className="text-xs font-display font-600 px-1.5 py-0.5 rounded"
                          style={{ background: `${colors.primary}22`, color: colors.primary }}
                        >
                          {player.position}
                        </span>
                      )}
                      {player.jersey_number && (
                        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                          #{player.jersey_number}
                        </span>
                      )}
                      {player.height && (
                        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                          {player.height}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                  style={{ color: "var(--color-text-subtle)" }}
                />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
