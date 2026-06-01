import { seasonLabel } from "@/app/context/season-context";
import { count } from "console";
import { AlertCircle, Zap } from "lucide-react";

interface HeroProps {
    title: string;
    subtitle?: string;
    description?: string;
    accentText?: string;
    dataSource: "api" | "mock";
    season: number;
    live?: { count: number } 
}



export default function Hero({ title, subtitle, description, dataSource, season, live, accentText }: HeroProps) {
    return (
        <section className="mb-8 page-enter">
          <div className="flex items-end justify-between mb-2">
            <div>
              <p
                className="text-xs font-display font-700 tracking-widest uppercase mb-2 flex items-center gap-2"
                style={{ color: "var(--color-accent)" }}
              >
                <span className="inline-block w-4 h-0.5" style={{ background: "var(--color-accent)" }} />
                {accentText}{accentText != undefined ? " · " : ""}{seasonLabel(season)} SEASON
              </p>
              
                <h1 className="font-hero text-6xl" style={{ color: "var(--color-text)", letterSpacing: "0.04em" }}>
                {title}
                {subtitle &&
                    <>
                    <br />
                        <span className="text-2xl" style={{ color: "var(--color-accent)" }}>{subtitle}</span>
                    </>
                }
              </h1>
                {description && 
                <p className="font-body" style={{ color: "var(--color-text-muted)" }}>{description}</p>
                }
            </div>

            <div className="hidden sm:flex flex-col items-end gap-1">
              {live != null && live?.count > 0 && (
                <div className="live-badge flex items-center gap-1.5">
                  <Zap size={10} />
                  {live.count} Live {live.count === 1 ? "Game" : "Games"}
                </div>
              )}
              {dataSource === "mock" && (
                <p className="text-xs flex items-center gap-1" style={{ color: "var(--color-text-subtle)" }}>
                  <AlertCircle size={10} />
                  Demo data
                </p>
              )}
            </div>
          </div>
          <div className="h-px w-full mt-6" style={{ background: "var(--color-border)" }} />
        </section>
    )
}