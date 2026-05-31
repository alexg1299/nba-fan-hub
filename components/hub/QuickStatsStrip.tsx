"use client";

interface StatItem {
  label: string;
  value: number;
  color: string;
}

interface QuickStatsStripProps {
  stats: StatItem[];
}

export default function QuickStatsStrip({ stats }: QuickStatsStripProps) {
  return (
    <div
      className="rounded-2xl p-4 grid grid-cols-3 gap-3"
      style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
    >
      {stats.map(({ label, value, color }) => (
        <div key={label} className="text-center">
          <p className="font-display font-800 text-2xl leading-none" style={{ color }}>
            {value}
          </p>
          <p
            className="font-display font-600 text-xs tracking-wider uppercase mt-1"
            style={{ color: "var(--color-text-subtle)" }}
          >
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
