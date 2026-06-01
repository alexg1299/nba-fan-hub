"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  /** Text label shown next to the arrow. Defaults to "Back". */
  label?: string;
  /**
   * "hero"    — white text for use on coloured hero banners.
   * "default" — muted text for use on regular page backgrounds.
   */
  variant?: "hero" | "default";
  className?: string;
}

const STYLES: Record<"hero" | "default", React.CSSProperties> = {
  hero: { color: "rgba(255,255,255,0.8)" },
  default: { color: "var(--color-text-muted)" },
};

export default function BackButton({ label = "Back", variant = "default", className }: BackButtonProps) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className={`flex items-center gap-1.5 mb-6 text-sm font-display font-700 tracking-wide transition-opacity hover:opacity-70 ${className ?? ""}`}
      style={STYLES[variant]}
    >
      <ArrowLeft size={14} />
      {label}
    </button>
  );
}
