"use client";

interface StatBarProps {
  label: string;
  homeValue: number;
  awayValue: number;
  homeAbbr: string;
  awayAbbr: string;
  isPercentage?: boolean;
  higherIsBetter?: boolean;
}

export default function StatBar({
  label,
  homeValue,
  awayValue,
  homeAbbr,
  awayAbbr,
  isPercentage = false,
  higherIsBetter = true,
}: StatBarProps) {
  const total = homeValue + awayValue;
  const homePercent = total === 0 ? 50 : (homeValue / total) * 100;
  const awayPercent = 100 - homePercent;

  const homeWins = higherIsBetter ? homeValue > awayValue : homeValue < awayValue;

  const format = (v: number) =>
    isPercentage ? `${(v * 100).toFixed(1)}%` : v.toString();

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span
          className="font-display font-700 text-sm"
          style={{ color: homeWins ? "var(--color-text)" : "var(--color-text-subtle)" }}
        >
          {format(homeValue)}
        </span>
        <span
          className="font-body font-400 text-center"
          style={{ color: "var(--color-text-subtle)" }}
        >
          {label}
        </span>
        <span
          className="font-display font-700 text-sm"
          style={{ color: !homeWins ? "var(--color-text)" : "var(--color-text-subtle)" }}
        >
          {format(awayValue)}
        </span>
      </div>

      {/* Bar */}
      <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
        <div
          className="rounded-l-full transition-all duration-700"
          style={{
            width: `${homePercent}%`,
            background: homeWins ? "var(--color-accent)" : "var(--color-border)",
          }}
        />
        <div
          className="rounded-r-full transition-all duration-700"
          style={{
            width: `${awayPercent}%`,
            background: !homeWins ? "var(--color-accent)" : "var(--color-border)",
          }}
        />
      </div>
    </div>
  );
}
