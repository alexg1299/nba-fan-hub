"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, AlertCircle, BarChart3, User } from "lucide-react";
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

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      className="rounded-xl p-4 text-center"
      style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
    >
      <p className="font-display font-800 text-2xl" style={{ color: "var(--color-text)" }}>
        {value}
      </p>
      <p className="text-xs font-display font-600 tracking-widest uppercase mt-1" style={{ color: "var(--color-text-muted)" }}>
        {label}
      </p>
    </div>
  );
}

function PctBar({ label, value }: { label: string; value: number | null }) {
  const pct = value != null ? Math.round(value * 100) : null;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-display font-600 w-10 shrink-0" style={{ color: "var(--color-text-muted)" }}>{label}</span>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--color-border)" }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct ?? 0}%`, background: "var(--color-accent)" }}
        />
      </div>
      <span className="text-xs font-display font-700 w-10 text-right shrink-0" style={{ color: "var(--color-text)" }}>
        {pct != null ? `${pct}%` : "—"}
      </span>
    </div>
  );
}

export default function PlayerDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          <Skeleton className="w-24 h-8 rounded-lg" />
          <Skeleton className="w-full h-36 rounded-2xl" />
        </main>
      </div>
    }>
      <PlayerDetailContent />
    </Suspense>
  );
}

function PlayerDetailContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const { season } = useSeason();

  // Allow override via query param (from team page link)
  const seasonParam = searchParams.get("season");
  const effectiveSeason = seasonParam ? Number(seasonParam) : season;

  const [player, setPlayer] = useState<Player | null>(null);
  const [averages, setAverages] = useState<SeasonAverages | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
  }, [id, effectiveSeason]);

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
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
      <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
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
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 page-enter">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 mb-6 text-sm font-display font-600 tracking-wide transition-opacity hover:opacity-70"
          style={{ color: "var(--color-text-muted)" }}
        >
          <ArrowLeft size={14} />
          {player.team?.full_name ?? "Teams"}
        </button>

        {/* Player hero */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}22 0%, ${colors.secondary}11 100%)`,
            border: `1px solid ${colors.primary}44`,
          }}
        >
          <div className="flex items-center gap-5">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center font-display font-900 text-xl text-white shrink-0"
              style={{ background: colors.primary }}
            >
              {player.first_name[0]}{player.last_name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                {player.position && (
                  <span
                    className="text-xs font-display font-700 px-2 py-0.5 rounded"
                    style={{ background: `${colors.primary}33`, color: colors.primary }}
                  >
                    {player.position}
                  </span>
                )}
                {player.jersey_number && (
                  <span className="text-xs font-display font-600" style={{ color: "var(--color-text-muted)" }}>
                    #{player.jersey_number}
                  </span>
                )}
              </div>
              <h1 className="font-display font-800 text-3xl sm:text-4xl tracking-tight" style={{ color: "var(--color-text)" }}>
                {player.first_name} {player.last_name}
              </h1>
              {player.team && (
                <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
                  {player.team.full_name}
                </p>
              )}
            </div>
          </div>

          {/* Bio grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            {player.height && (
              <div>
                <p className="text-xs font-display font-600 tracking-widest uppercase" style={{ color: "var(--color-text-muted)" }}>Height</p>
                <p className="font-display font-700 text-sm mt-0.5" style={{ color: "var(--color-text)" }}>{player.height}</p>
              </div>
            )}
            {player.weight && (
              <div>
                <p className="text-xs font-display font-600 tracking-widest uppercase" style={{ color: "var(--color-text-muted)" }}>Weight</p>
                <p className="font-display font-700 text-sm mt-0.5" style={{ color: "var(--color-text)" }}>{player.weight} lbs</p>
              </div>
            )}
            {player.country && (
              <div>
                <p className="text-xs font-display font-600 tracking-widest uppercase" style={{ color: "var(--color-text-muted)" }}>Country</p>
                <p className="font-display font-700 text-sm mt-0.5" style={{ color: "var(--color-text)" }}>{player.country}</p>
              </div>
            )}
            {player.college && (
              <div>
                <p className="text-xs font-display font-600 tracking-widest uppercase" style={{ color: "var(--color-text-muted)" }}>College</p>
                <p className="font-display font-700 text-sm mt-0.5 truncate" style={{ color: "var(--color-text)" }}>{player.college}</p>
              </div>
            )}
            {player.draft_year && (
              <div>
                <p className="text-xs font-display font-600 tracking-widest uppercase" style={{ color: "var(--color-text-muted)" }}>Draft</p>
                <p className="font-display font-700 text-sm mt-0.5" style={{ color: "var(--color-text)" }}>
                  {player.draft_year} · Rd {player.draft_round} · #{player.draft_number}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Season averages */}
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 size={16} style={{ color: "var(--color-accent)" }} />
          <h2 className="font-display font-700 text-lg tracking-wide uppercase" style={{ color: "var(--color-text)" }}>
            {seasonLabel(effectiveSeason)} Averages
          </h2>
          {averages && (
            <span className="text-xs font-display font-600 px-2 py-0.5 rounded-full" style={{ background: "var(--color-bg-card)", color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}>
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
              <StatBox label="PTS" value={averages.pts.toFixed(1)} />
              <StatBox label="REB" value={averages.reb.toFixed(1)} />
              <StatBox label="AST" value={averages.ast.toFixed(1)} />
              <StatBox label="MIN" value={averages.min} />
            </div>
            <div className="grid grid-cols-4 gap-3 mb-6">
              <StatBox label="STL" value={averages.stl.toFixed(1)} />
              <StatBox label="BLK" value={averages.blk.toFixed(1)} />
              <StatBox label="TO" value={averages.turnover.toFixed(1)} />
              <StatBox label="PF" value={"—"} />
            </div>

            {/* Shooting percentages */}
            <div
              className="rounded-2xl p-5 space-y-4"
              style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
            >
              <h3 className="font-display font-700 text-sm tracking-widest uppercase" style={{ color: "var(--color-text-muted)" }}>
                Shooting
              </h3>
              <PctBar label="FG%" value={averages.fg_pct} />
              <PctBar label="3P%" value={averages.fg3_pct} />
              <PctBar label="FT%" value={averages.ft_pct} />

              <div className="grid grid-cols-3 gap-3 pt-2 border-t" style={{ borderColor: "var(--color-border)" }}>
                <div className="text-center">
                  <p className="text-xs font-display font-600 uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>FGM/A</p>
                  <p className="font-display font-700 text-sm mt-1" style={{ color: "var(--color-text)" }}>
                    {averages.fgm.toFixed(1)}/{averages.fga.toFixed(1)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-display font-600 uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>3PM/A</p>
                  <p className="font-display font-700 text-sm mt-1" style={{ color: "var(--color-text)" }}>
                    {averages.fg3m.toFixed(1)}/{averages.fg3a.toFixed(1)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-display font-600 uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>FTM/A</p>
                  <p className="font-display font-700 text-sm mt-1" style={{ color: "var(--color-text)" }}>
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
