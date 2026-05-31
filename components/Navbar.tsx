"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Activity, Trophy, Users, Menu, X, ChevronDown, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useSeason, AVAILABLE_SEASONS, seasonLabel } from "@/app/context/season-context";

const NAV_LINKS = [
  { href: "/", label: "Scores", icon: Activity },
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
      className="sticky top-0 z-50 border-b"
      style={{
        background: "var(--color-bg-card)",
        borderColor: "var(--color-border)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-display font-800 text-sm"
              style={{ background: "var(--color-accent)" }}
            >
              CS
            </div>
            <span
              className="font-display font-700 text-xl tracking-wider hidden sm:block"
              style={{ color: "var(--color-text)" }}
            >
              COURTSIDE
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex items-center gap-1.5 px-4 py-2 rounded-lg font-display font-600 text-sm tracking-wider uppercase transition-colors",
                  pathname === href
                    ? "text-white"
                    : "hover:opacity-80"
                )}
                style={
                  pathname === href
                    ? { background: "var(--color-accent)", color: "#fff" }
                    : { color: "var(--color-text-muted)" }
                }
              >
                <Icon size={14} />
                {label}
              </Link>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Season selector */}
            {mounted && (
              <div className="relative">
                <div
                  className="flex items-center gap-1.5 h-9 px-3 rounded-lg font-display font-600 text-xs tracking-wider uppercase cursor-pointer select-none"
                  style={{ color: "var(--color-text-muted)", border: "1px solid var(--color-border)", background: "var(--color-bg-card)" }}
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
                  <ChevronDown size={11} />
                </div>
              </div>
            )}

            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                style={{ color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}
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
                    "flex items-center gap-2 px-4 py-2.5 rounded-lg font-display font-600 text-sm tracking-wider uppercase transition-colors",
                    pathname === href ? "text-white" : ""
                  )}
                  style={
                    pathname === href
                      ? { background: "var(--color-accent)" }
                      : { color: "var(--color-text-muted)" }
                  }
                >
                  <Icon size={14} />
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
