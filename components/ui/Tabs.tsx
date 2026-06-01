import clsx from "clsx";

export interface TabItem {
  key: string;
  label: string;
  icon?: React.ElementType;
}

interface TabsProps {
  tabs: TabItem[];
  active: string;
  onChange: (key: string) => void;
  className?: string;
}

export default function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div
      className={clsx("flex gap-1 p-1 rounded-xl w-fit", className)}
      style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
    >
      {tabs.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-lg font-display font-600 text-xs tracking-wider uppercase transition-all",
            active === key ? "text-white shadow-sm" : "hover:opacity-70"
          )}
          style={
            active === key
              ? { background: "var(--color-accent)" }
              : { color: "var(--color-text-muted)" }
          }
        >
          {Icon && <Icon size={12} />}
          {label}
        </button>
      ))}
    </div>
  );
}
