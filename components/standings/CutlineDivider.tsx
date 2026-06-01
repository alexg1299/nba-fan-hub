interface CutlineDividerProps {
  color?: string;
  opacity?: number;
}

/**
 * A thin horizontal rule used to mark playoff / play-in cutlines in standings tables.
 */
export default function CutlineDivider({
  color = "var(--color-accent)",
  opacity = 0.5,
}: CutlineDividerProps) {
  return <div className="h-px mx-4" style={{ background: color, opacity }} />;
}
