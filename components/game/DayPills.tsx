"use client";

function toISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

interface DayPillsProps {
  week: Date[];
  today: Date;
  selectedDate: string | null;
  gameCountByDate: Record<string, number>;
  onSelectDay: (d: Date) => void;
}

export default function DayPills({
  week,
  today,
  selectedDate,
  gameCountByDate,
  onSelectDay,
}: DayPillsProps) {
  const todayISO = toISO(today);

  return (
    <div className="grid grid-cols-7 gap-1.5">
      {week.map((d) => {
        const iso        = toISO(d);
        const isToday    = iso === todayISO;
        const isSelected = selectedDate === iso;
        const count      = gameCountByDate[iso] ?? 0;
        const dayName    = d.toLocaleDateString("en-US", { weekday: "short" });
        const dayNum     = d.getDate();

        return (
          <button
            key={iso}
            onClick={() => onSelectDay(d)}
            className="flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all hover:opacity-80"
            style={
              isSelected
                ? { background: "var(--color-accent)", color: "#fff" }
                : isToday
                ? {
                    background: "var(--color-bg-elevated)",
                    color: "var(--color-accent)",
                    border: "1px solid var(--color-accent)",
                  }
                : {
                    background: "var(--color-bg-elevated)",
                    color: "var(--color-text-muted)",
                  }
            }
          >
            <span className="font-display font-700 text-xs tracking-wide uppercase">{dayName}</span>
            <span className="font-display font-800 text-base leading-none">{dayNum}</span>
            {count > 0 ? (
              <span
                className="text-xs font-display font-700 leading-none"
                style={{ color: isSelected ? "rgba(255,255,255,0.85)" : "var(--color-accent)" }}
              >
                {count}
              </span>
            ) : (
              <span className="text-xs opacity-0">·</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
