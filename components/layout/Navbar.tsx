"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Home, Trophy, Users, Menu, X, ChevronDown, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useSeason, AVAILABLE_SEASONS, seasonLabel } from "@/app/context/season-context";
import SiteLogo from "./SiteLogo";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/standings", label: "Standings", icon: Trophy },
  { href: "/teams", label: "Teams", icon: Shield },
  { href: "/players", label: "Players", icon: Users },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { season, setSeason } = useSeason();

  useEffect(() => setMounted(true), []);

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "var(--color-bg-card)",
        borderBottom: "1px solid var(--color-border)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: "0 2px 20px rgba(0,0,0,0.12)",
      }}
    >
      {/* Orange accent top stripe */}
      <div className="h-[3px] w-full" style={{ background: "linear-gradient(90deg, var(--color-accent) 0%, #ff9900 60%, transparent 100%)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <SiteLogo includeLogo={true} />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    "relative flex items-center gap-1.5 px-4 py-2 font-display font-700 text-sm tracking-widest uppercase transition-all duration-150",
                    isActive ? "" : "opacity-60 hover:opacity-80"
                  )}
                  style={isActive ? { color: "var(--color-accent)" } : { color: "var(--color-text)" }}
                >
                  <Icon size={13} />
                  {label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                      style={{ background: "var(--color-accent)" }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Season selector */}
            {mounted && (
              <div className="relative">
                <div
                  className="flex items-center gap-1.5 h-8 px-3 rounded-lg font-display font-700 text-xs tracking-widest uppercase cursor-pointer select-none transition-colors hover:opacity-80"
                  style={{
                    color: "var(--color-text-muted)",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-bg-elevated)",
                  }}
                >
                  <select
                    value={season}
                    onChange={(e) => setSeason(Number(e.target.value))}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full"
                    aria-label="Select season"
                  >
                    {AVAILABLE_SEASONS.map((s) => (
                      <option key={s} value={s}>{seasonLabel(s)}</option>
                    ))}
                  </select>
                  <span>{seasonLabel(season)}</span>
                  <ChevronDown size={10} />
                </div>
              </div>
            )}

            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
                style={{
                  color: "var(--color-text-muted)",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-bg-elevated)",
                }}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
              style={{
                color: "var(--color-text-muted)",
                border: "1px solid var(--color-border)",
                background: "var(--color-bg-elevated)",
              }}
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div
            className="md:hidden pb-4 border-t"
            style={{ borderColor: "var(--color-border)" }}
          >
            <nav className="flex flex-col gap-1 pt-3">
              {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={clsx(
                    "flex items-center gap-2.5 px-4 py-3 rounded-lg font-display font-700 text-sm tracking-widest uppercase transition-all",
                    pathname === href ? "" : "opacity-60 hover:opacity-90"
                  )}
                  style={
                    pathname === href
                      ? {
                          background: `color-mix(in srgb, var(--color-accent) 12%, transparent)`,
                          color: "var(--color-accent)",
                          borderLeft: "3px solid var(--color-accent)",
                        }
                      : { color: "var(--color-text)" }
                  }
                >
                  <Icon size={15} />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
