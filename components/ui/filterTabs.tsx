import clsx from "clsx";
import { RefreshCw } from "lucide-react";

interface FilterTabsProps {
    options: { key: string; label: string; icon: React.ElementType }[];
    selectedDate?: string;
    filter: string;
    onSelect: (option: string) => void;
    live?: { count: number };
    refresh?: {
        loading: boolean;
        loadData: () => void;
    }
}

export default function FilterTabs({ options, selectedDate, filter, onSelect, live, refresh }: FilterTabsProps) {
    return (
        <div className="flex items-center gap-2 flex-wrap">
              {options.map(({ key, label, icon: Icon }) => {
                const isActive = !selectedDate && filter === key;
                return (
                  <button
                    key={key}
                    onClick={() => onSelect(key)}
                    className={clsx(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-display font-600 text-xs tracking-wider uppercase transition-all",
                      isActive ? "text-white shadow-md" : "hover:opacity-80"
                    )}
                    style={
                      isActive
                        ? { background: "var(--color-accent)" }
                        : {
                            background: "var(--color-bg-card)",
                            color: "var(--color-text-muted)",
                            border: "1px solid var(--color-border)",
                          }
                    }
                  >
                    <Icon size={11} />
                    {label}
                    {key === "live" && live != null && live.count > 0 && (
                      <span
                        className="w-4 h-4 rounded-full text-white text-xs flex items-center justify-center"
                        style={{ background: "var(--color-live)", fontSize: "9px" }}
                      >
                        {live.count}
                      </span>
                    )}
                  </button>
                );
              })}
              { refresh &&
                    <button
                        onClick={refresh?.loadData}
                        className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-display font-600 text-xs tracking-wider uppercase transition-all hover:opacity-80"
                        style={{
                        background: "var(--color-bg-card)",
                        color: "var(--color-text-muted)",
                        border: "1px solid var(--color-border)",
                        }}
                    >
                        <RefreshCw size={11} className={refresh?.loading ? "animate-spin" : ""} />
                        Refresh
                    </button>
              }
            </div>
    )
}