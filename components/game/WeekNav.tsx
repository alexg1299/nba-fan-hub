"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface WeekNavProps {
  week: Date[];
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onGoToToday: () => void;
}

export default function WeekNav({ week, onPrevWeek, onNextWeek, onGoToToday }: WeekNavProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <button
        onClick={onPrevWeek}
        className="p-1.5 rounded-lg hover:opacity-70 transition-opacity"
        style={{ background: "var(--color-bg-elevated)", color: "var(--color-text-muted)" }}
        aria-label="Previous week"
      >
        <ChevronLeft size={14} />
      </button>

      <div className="flex items-center gap-3">
        <span
          className="font-display font-700 text-xs tracking-widest uppercase"
          style={{ color: "var(--color-text-muted)" }}
        >
          {week[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          {" — "}
          {week[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
        <button
          onClick={onGoToToday}
          className="text-xs font-display font-600 tracking-wider uppercase px-2 py-0.5 rounded transition-opacity hover:opacity-70"
          style={{ color: "var(--color-accent)", border: "1px solid var(--color-accent)" }}
        >
          Today
        </button>
      </div>

      <button
        onClick={onNextWeek}
        className="p-1.5 rounded-lg hover:opacity-70 transition-opacity"
        style={{ background: "var(--color-bg-elevated)", color: "var(--color-text-muted)" }}
        aria-label="Next week"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
