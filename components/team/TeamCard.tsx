"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getTeamColors } from "@/lib/nba-api";
import TeamLogo from "./TeamLogo";

export interface Team {
  id: number;
  abbreviation: string;
  city: string;
  conference: string;
  division: string;
  full_name: string;
  name: string;
}

interface TeamCardProps {
  team: Team;
}

/**
 * Clickable team card that links to the team detail page.
 * Used on the /teams listing page.
 */
export default function TeamCard({ team }: TeamCardProps) {
  const colors = getTeamColors(team.abbreviation);

  return (
    <Link
      href={`/teams/${team.id}`}
      className="group flex items-center justify-between rounded-xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg"
      style={{
        background: "var(--color-bg-card)",
        border: `1px solid var(--color-border)`,
        borderLeft: `3px solid ${colors.primary}`,
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 overflow-hidden"
          style={{ background: `${colors.primary}18` }}
        >
          <TeamLogo abbreviation={team.abbreviation} size={36} variant="circle" />
        </div>
        <div>
          <p className="font-display font-700 text-base" style={{ color: "var(--color-text)" }}>
            {team.full_name}
          </p>
          <p className="text-xs font-display font-600 tracking-wide" style={{ color: "var(--color-text-muted)" }}>
            {team.division} · {team.conference}ern
          </p>
        </div>
      </div>
      <ChevronRight
        size={16}
        className="transition-transform group-hover:translate-x-1"
        style={{ color: colors.primary }}
      />
    </Link>
  );
}
