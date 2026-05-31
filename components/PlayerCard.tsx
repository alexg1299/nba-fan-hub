"use client";

interface PlayerCardProps {
  name: string;
  position: string;
  pts: number;
  reb: number;
  ast: number;
  fg_pct?: number;
  teamAbbr?: string;
  teamColor?: string;
  isHighlighted?: boolean;
}

export default function PlayerCard({
  name,
  position,
  pts,
  reb,
  ast,
  fg_pct,
  teamAbbr,
  teamColor = "#FF8C00",
  isHighlighted = false,
}: PlayerCardProps) {
  const stats = [
    { label: "PTS", value: pts },
    { label: "REB", value: reb },
    { label: "AST", value: ast },
    ...(fg_pct !== undefined ? [{ label: "FG%", value: `${(fg_pct * 100).toFixed(0)}%` }] : []),
  ];

  return (
    <div
      className="rounded-xl p-4 transition-all duration-200 hover:scale-[1.01]"
      style={{
        background: isHighlighted ? `${teamColor}18` : "var(--color-bg-elevated)",
        border: isHighlighted ? `1px solid ${teamColor}40` : "1px solid var(--color-border)",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p
            className="font-display font-700 text-base leading-tight"
            style={{ color: "var(--color-text)" }}
          >
            {name}
          </p>
          <p
            className="text-xs font-body mt-0.5"
            style={{ color: "var(--color-text-subtle)" }}
          >
            {position}
            {teamAbbr && ` · ${teamAbbr}`}
          </p>
        </div>
        {isHighlighted && (
          <div
            className="text-xs font-display font-700 px-2 py-0.5 rounded"
            style={{ background: teamColor, color: "#fff" }}
          >
            KEY
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-1">
        {stats.map(({ label, value }) => (
          <div key={label} className="text-center">
            <p
              className="stat-value text-xl"
              style={{ color: "var(--color-text)" }}
            >
              {value}
            </p>
            <p
              className="text-xs font-display font-600 tracking-wide"
              style={{ color: "var(--color-text-subtle)" }}
            >
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
