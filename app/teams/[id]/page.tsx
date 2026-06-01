"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Users, AlertCircle, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import BackButton from "@/components/layout/BackButton";
import { Skeleton } from "@/components/ui/Skeleton";
import { useSeason, seasonLabel } from "@/app/context/season-context";
import { getTeamColors, getTeamLogoUrl } from "@/lib/nba-api";

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
  const [logoError, setLogoError] = useState(false);

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
        {/* Skeleton hero with back button still accessible */}
        <div
          className="relative overflow-hidden"
          style={{ background: "var(--color-bg-card)", minHeight: "200px" }}
        >
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-8">
            <BackButton/>
            <div className="flex items-center gap-5">
              <Skeleton className="w-20 h-20 rounded-2xl shrink-0" />
              <div className="space-y-2">
                <Skeleton className="w-16 h-3 rounded" />
                <Skeleton className="w-64 h-10 rounded-lg" />
                <Skeleton className="w-32 h-3 rounded" />
              </div>
            </div>
          </div>
        </div>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="w-full h-16 rounded-xl" />)}
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

      {/* Full-width team hero banner */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
          minHeight: "200px",
        }}
      >
        {/* Diagonal sport pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(-55deg, transparent, transparent 20px, rgba(0,0,0,0.06) 20px, rgba(0,0,0,0.06) 21px)",
          }}
        />

        {/* Watermark logo */}
        <div className="absolute right-0 top-0 bottom-0 flex items-center pr-8 pointer-events-none opacity-10">
          {!logoError ? (
            <Image
              src={getTeamLogoUrl(team.abbreviation)}
              alt=""
              width={200}
              height={200}
              className="object-contain"
              onError={() => setLogoError(true)}
              unoptimized
            />
          ) : null}
        </div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-8 page-enter">
          {/* Back */}
          <BackButton label="Back" variant="hero" />

          <div className="flex items-center gap-5">
            {/* Team logo */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              {!logoError ? (
                <Image
                  src={getTeamLogoUrl(team.abbreviation)}
                  alt={team.abbreviation}
                  width={64}
                  height={64}
                  className="object-contain drop-shadow"
                  onError={() => setLogoError(true)}
                  unoptimized
                />
              ) : (
                <span className="font-display font-900 text-2xl text-white">{team.abbreviation}</span>
              )}
            </div>

            <div>
              <p className="text-xs font-display font-700 tracking-widest uppercase mb-1" style={{ color: "rgba(255,255,255,0.7)" }}>
                {team.conference}ern Conference · {team.division}
              </p>
              <h1
                className="font-hero leading-none text-white"
                style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "0.03em" }}
              >
                {team.full_name?.toUpperCase() ?? team.name?.toUpperCase() ?? team.abbreviation}
              </h1>
              <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,0.7)" }}>
                {seasonLabel(season)} Roster · {players.length} players
              </p>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, var(--color-bg))" }}
        />
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

        {/* Roster */}
        <div className="mb-5 flex items-center gap-3">
          <div className="w-1 h-6 rounded-full" style={{ background: colors.primary }} />
          <Users size={16} style={{ color: colors.primary }} />
          <h2 className="font-display font-800 text-lg tracking-widest uppercase" style={{ color: "var(--color-text)" }}>
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
                className="group flex items-center justify-between rounded-xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{
                  background: "var(--color-bg-card)",
                  border: `1px solid var(--color-border)`,
                  borderLeft: `3px solid ${colors.primary}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-display font-800 text-sm text-white shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                      boxShadow: `0 2px 8px ${colors.primary}44`,
                    }}
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
                          className="text-xs font-display font-700 px-1.5 py-0.5 rounded"
                          style={{ background: `${colors.primary}22`, color: colors.primary }}
                        >
                          {player.position}
                        </span>
                      )}
                      {player.jersey_number && (
                        <span className="text-xs font-display font-600" style={{ color: "var(--color-text-muted)" }}>
                          #{player.jersey_number}
                        </span>
                      )}
                      {player.height && (
                        <span className="text-xs" style={{ color: "var(--color-text-subtle)" }}>
                          {player.height}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                  style={{ color: colors.primary }}
                />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
