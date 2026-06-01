"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, BarChart3, User } from "lucide-react";
import Image from "next/image";
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
  draft_year?: number;
  draft_round?: number;
  draft_number?: number;
  team?: Team;
}

interface SeasonAverages {
  games_played: number;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  turnover: number;
  min: string;
  fg_pct: number;
  fg3_pct: number;
  ft_pct: number;
  fgm: number;
  fga: number;
  fg3m: number;
  fg3a: number;
  ftm: number;
  fta: number;
  oreb: number;
  dreb: number;
}

function StatBox({ label, value, accentColor }: { label: string; value: string | number; accentColor?: string }) {
  return (
    <div
      className="rounded-xl p-4 text-center relative overflow-hidden"
      style={{
        background: "var(--color-bg-card)",
        border: `1px solid var(--color-border)`,
        borderTop: accentColor ? `3px solid ${accentColor}` : "3px solid var(--color-accent)",
      }}
    >
      <p className="font-hero text-3xl" style={{ color: "var(--color-text)", letterSpacing: "0.02em" }}>
        {value}
      </p>
      <p className="text-xs font-display font-700 tracking-widest uppercase mt-1" style={{ color: "var(--color-text-muted)" }}>
        {label}
      </p>
    </div>
  );
}

function PctBar({ label, value, color }: { label: string; value: number | null; color?: string }) {
  const pct = value != null ? Math.round(value * 100) : null;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-display font-700 w-10 shrink-0" style={{ color: "var(--color-text-muted)" }}>{label}</span>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--color-border)" }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct ?? 0}%`, background: color || "var(--color-accent)" }}
        />
      </div>
      <span className="text-xs font-display font-800 w-10 text-right shrink-0" style={{ color: "var(--color-text)" }}>
        {pct != null ? `${pct}%` : "—"}
      </span>
    </div>
  );
}

interface Props {
  id: string;
  initialPlayer: Player | null;
  initialAverages: SeasonAverages | null;
  initialSeason: number;
}

export default function PlayerDetailClient({ id, initialPlayer, initialAverages, initialSeason }: Props) {
  const router = useRouter();
  const { season } = useSeason();

  const effectiveSeason = season;

  const [player, setPlayer] = useState<Player | null>(initialPlayer);
  const [averages, setAverages] = useState<SeasonAverages | null>(initialAverages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);

  // Skip first fetch when server already provided data for this season
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (initialPlayer && effectiveSeason === initialSeason) return;
    }

    if (!id) return;
    setLoading(true);
    setError(null);
    fetch(`/api/players/${id}?season=${effectiveSeason}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setPlayer(data.player);
        setAverages(data.averages || null);
      })
      .catch((e) => setError(e.message || "Failed to load player"))
      .finally(() => setLoading(false));
  }, [id, effectiveSeason, initialPlayer, initialSeason]);

  if (loading) {
    return (
      <div className="min-h-screen page-enter" style={{ background: "var(--color-bg)" }}>
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          <Skeleton className="w-24 h-8 rounded-lg" />
          <Skeleton className="w-full h-36 rounded-2xl" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
          </div>
          <Skeleton className="w-full h-40 rounded-2xl" />
        </main>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="min-h-screen page-enter" style={{ background: "var(--color-bg)" }}>
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
          <AlertCircle size={48} className="mx-auto mb-4" style={{ color: "var(--color-accent)" }} />
          <h2 className="font-display font-700 text-2xl mb-2" style={{ color: "var(--color-text)" }}>Player not found</h2>
          <p className="mb-6" style={{ color: "var(--color-text-muted)" }}>{error || "This player doesn't exist."}</p>
          <button onClick={() => router.back()} className="btn-primary px-6 py-2 rounded-lg text-sm">Go Back</button>
        </main>
      </div>
    );
  }

  const teamAbbr = player.team?.abbreviation ?? "";
  const colors = getTeamColors(teamAbbr);

  return (
    <div className="min-h-screen page-enter" style={{ background: "var(--color-bg)" }}>
      <Navbar />

      {/* Full-width player hero banner */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
          minHeight: "220px",
        }}
      >
        {/* Diagonal sport stripes */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(-55deg, transparent, transparent 20px, rgba(0,0,0,0.06) 20px, rgba(0,0,0,0.06) 21px)",
          }}
        />

        {/* Jersey number watermark */}
        {player.jersey_number && (
          <div
            className="absolute right-4 top-0 bottom-0 flex items-center pointer-events-none select-none"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(120px, 20vw, 200px)",
              color: "rgba(255,255,255,0.07)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            {player.jersey_number}
          </div>
        )}

        {/* Team logo watermark */}
        {!logoError && teamAbbr && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none opacity-15">
            <Image
              src={getTeamLogoUrl(teamAbbr)}
              alt=""
              width={140}
              height={140}
              className="object-contain"
              onError={() => setLogoError(true)}
              unoptimized
            />
          </div>
        )}

        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 py-8">
          {/* Back */}
          <BackButton variant="hero" />

          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center font-hero text-2xl text-white shrink-0"
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.25)",
                letterSpacing: "0.06em",
              }}
            >
              {player.first_name?.[0]}{player.last_name?.[0]}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                {player.position && (
                  <span
                    className="text-xs font-display font-800 px-2 py-0.5 rounded"
                    style={{ background: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.95)" }}
                  >
                    {player.position}
                  </span>
                )}
                {player.jersey_number && (
                  <span className="text-xs font-display font-700" style={{ color: "rgba(255,255,255,0.75)" }}>
                    #{player.jersey_number}
                  </span>
                )}
              </div>
              <h1
                className="font-hero text-white leading-none"
                style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", letterSpacing: "0.03em" }}
              >
                {player.first_name?.toUpperCase()} {player.last_name?.toUpperCase()}
              </h1>
              {player.team && (
                <p className="text-sm mt-2 font-display font-600 tracking-wide" style={{ color: "rgba(255,255,255,0.75)" }}>
                  {player.team.full_name}
                </p>
              )}
            </div>
          </div>

          {/* Bio grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            {player.height && (
              <div className="rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.1)" }}>
                <p className="text-xs font-display font-700 tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.6)" }}>Height</p>
                <p className="font-display font-800 text-sm mt-0.5 text-white">{player.height}</p>
              </div>
            )}
            {player.weight && (
              <div className="rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.1)" }}>
                <p className="text-xs font-display font-700 tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.6)" }}>Weight</p>
                <p className="font-display font-800 text-sm mt-0.5 text-white">{player.weight} lbs</p>
              </div>
            )}
            {player.country && (
              <div className="rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.1)" }}>
                <p className="text-xs font-display font-700 tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.6)" }}>Country</p>
                <p className="font-display font-800 text-sm mt-0.5 text-white">{player.country}</p>
              </div>
            )}
            {player.college && (
              <div className="rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.1)" }}>
                <p className="text-xs font-display font-700 tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.6)" }}>College</p>
                <p className="font-display font-800 text-sm mt-0.5 text-white truncate">{player.college}</p>
              </div>
            )}
            {player.draft_year && (
              <div className="rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.1)" }}>
                <p className="text-xs font-display font-700 tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.6)" }}>Draft</p>
                <p className="font-display font-800 text-sm mt-0.5 text-white">
                  {player.draft_year} · Rd {player.draft_round} · #{player.draft_number}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, var(--color-bg))" }}
        />
      </div>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

        {/* Season averages */}
        <div className="mb-5 flex items-center gap-3">
          <div className="w-1 h-6 rounded-full" style={{ background: colors.primary }} />
          <BarChart3 size={16} style={{ color: colors.primary }} />
          <h2 className="font-display font-800 text-lg tracking-widest uppercase" style={{ color: "var(--color-text)" }}>
            {seasonLabel(effectiveSeason)} Averages
          </h2>
          {averages && (
            <span className="text-xs font-display font-700 px-2 py-0.5 rounded-full" style={{ background: `${colors.primary}22`, color: colors.primary, border: `1px solid ${colors.primary}44` }}>
              {averages.games_played} GP
            </span>
          )}
        </div>

        {!averages ? (
          <div
            className="rounded-xl p-8 text-center"
            style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
          >
            <User size={36} className="mx-auto mb-3" style={{ color: "var(--color-text-subtle)" }} />
            <p className="font-display font-600" style={{ color: "var(--color-text-muted)" }}>
              No stats available for {seasonLabel(effectiveSeason)}
            </p>
          </div>
        ) : (
          <>
            {/* Key stats */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              <StatBox label="PTS" value={averages.pts.toFixed(1)} accentColor={colors.primary} />
              <StatBox label="REB" value={averages.reb.toFixed(1)} accentColor={colors.primary} />
              <StatBox label="AST" value={averages.ast.toFixed(1)} accentColor={colors.primary} />
              <StatBox label="MIN" value={averages.min} accentColor={colors.primary} />
            </div>
            <div className="grid grid-cols-4 gap-3 mb-6">
              <StatBox label="STL" value={averages.stl.toFixed(1)} accentColor={colors.secondary} />
              <StatBox label="BLK" value={averages.blk.toFixed(1)} accentColor={colors.secondary} />
              <StatBox label="TO" value={averages.turnover.toFixed(1)} accentColor={colors.secondary} />
              <StatBox label="PF" value={"—"} accentColor={colors.secondary} />
            </div>

            {/* Shooting percentages */}
            <div
              className="rounded-2xl p-5 space-y-4"
              style={{
                background: "var(--color-bg-card)",
                border: `1px solid var(--color-border)`,
                borderTop: `3px solid ${colors.primary}`,
              }}
            >
              <h3 className="font-display font-800 text-sm tracking-widest uppercase" style={{ color: colors.primary }}>
                Shooting
              </h3>
              <PctBar label="FG%" value={averages.fg_pct} color={colors.primary} />
              <PctBar label="3P%" value={averages.fg3_pct} color={colors.secondary} />
              <PctBar label="FT%" value={averages.ft_pct} color={colors.primary} />

              <div className="grid grid-cols-3 gap-3 pt-2 border-t" style={{ borderColor: "var(--color-border)" }}>
                <div className="text-center">
                  <p className="text-xs font-display font-700 uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>FGM/A</p>
                  <p className="font-display font-800 text-sm mt-1" style={{ color: "var(--color-text)" }}>
                    {averages.fgm.toFixed(1)}/{averages.fga.toFixed(1)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-display font-700 uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>3PM/A</p>
                  <p className="font-display font-800 text-sm mt-1" style={{ color: "var(--color-text)" }}>
                    {averages.fg3m.toFixed(1)}/{averages.fg3a.toFixed(1)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-display font-700 uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>FTM/A</p>
                  <p className="font-display font-800 text-sm mt-1" style={{ color: "var(--color-text)" }}>
                    {averages.ftm.toFixed(1)}/{averages.fta.toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
