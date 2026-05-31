"use client";

interface ConferenceHeadingProps {
  conference: "East" | "West";
  /** Optional count badge shown after the title */
  count?: number;
  /** "sm" renders at text-base (sidebar/table headers), "md" at text-lg (page sections). Defaults to "sm". */
  size?: "sm" | "md";
}

const CONF_COLORS: Record<"East" | "West", string> = {
  East: "#CE1141",
  West: "#1D428A",
};

export default function ConferenceHeading({ conference, count, size = "sm" }: ConferenceHeadingProps) {
  const color = CONF_COLORS[conference];
  const textClass = size === "md" ? "text-lg" : "text-base";

  return (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
      <h2
        className={`font-display font-700 ${textClass} tracking-wider uppercase`}
        style={{ color: "var(--color-text)" }}
      >
        {conference}ern Conference
      </h2>
      {count !== undefined && (
        <span
          className="text-xs font-display font-600 px-2 py-0.5 rounded-full"
          style={{
            background: "var(--color-bg-card)",
            color: "var(--color-text-muted)",
            border: "1px solid var(--color-border)",
          }}
        >
          {count}
        </span>
      )}
    </div>
  );
}
