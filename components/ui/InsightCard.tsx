"use client";

import { TrendingUp } from "lucide-react";

interface InsightCardProps {
  title: string;
  message: string;
}

export default function InsightCard({
  title,
  message,
}: InsightCardProps) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "linear-gradient(135deg, var(--color-bg-elevated) 0%, var(--color-bg-card) 100%)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp size={14} style={{ color: "var(--color-accent)" }} />
        <p
          className="font-display font-700 text-base tracking-wider uppercase"
          style={{ color: "var(--color-accent)" }}
        >
          {title}
        </p>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
        {message}
      </p>
    </div>
  );
}
