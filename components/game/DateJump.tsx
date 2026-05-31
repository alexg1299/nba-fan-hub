"use client";

import { Calendar } from "lucide-react";

interface DateJumpProps {
  selectedDate: string | null;
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

export default function DateJump({ selectedDate, onDateChange, onClear }: DateJumpProps) {
  return (
    <div
      className="mt-3 pt-3 flex items-center gap-2"
      style={{ borderTop: "1px solid var(--color-border)" }}
    >
      <Calendar size={13} style={{ color: "var(--color-text-subtle)" }} />
      <label
        className="font-display font-600 text-xs tracking-wider uppercase"
        style={{ color: "var(--color-text-subtle)" }}
      >
        Jump to date
      </label>
      <input
        type="date"
        value={selectedDate ?? ""}
        onChange={onDateChange}
        className="ml-auto text-xs font-display font-600 rounded-lg px-2 py-1 outline-none"
        style={{
          background: "var(--color-bg-elevated)",
          color: "var(--color-text)",
          border: "1px solid var(--color-border)",
        }}
      />
      {selectedDate && (
        <button
          onClick={onClear}
          className="text-xs font-display font-600 tracking-wider uppercase hover:opacity-70 transition-opacity"
          style={{ color: "var(--color-text-subtle)" }}
        >
          Clear
        </button>
      )}
    </div>
  );
}
