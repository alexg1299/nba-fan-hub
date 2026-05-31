"use client";

import WeekNav from "./WeekNav";
import DayPills from "./DayPills";
import DateJump from "./DateJump";

export interface WeekStripProps {
  week: Date[];
  today: Date;
  selectedDate: string | null;
  gameCountByDate: Record<string, number>;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onGoToToday: () => void;
  onSelectDay: (d: Date) => void;
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearDate: () => void;
}

export default function WeekStrip({
  week,
  today,
  selectedDate,
  gameCountByDate,
  onPrevWeek,
  onNextWeek,
  onGoToToday,
  onSelectDay,
  onDateChange,
  onClearDate,
}: WeekStripProps) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
    >
      <WeekNav
        week={week}
        onPrevWeek={onPrevWeek}
        onNextWeek={onNextWeek}
        onGoToToday={onGoToToday}
      />
      <DayPills
        week={week}
        today={today}
        selectedDate={selectedDate}
        gameCountByDate={gameCountByDate}
        onSelectDay={onSelectDay}
      />
      <DateJump
        selectedDate={selectedDate}
        onDateChange={onDateChange}
        onClear={onClearDate}
      />
    </div>
  );
}
