"use client";

import { useState } from "react";
import { Search, User } from "lucide-react";
import Navbar from "@/components/Navbar";

interface Player {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  team?: { full_name: string; abbreviation: string };
}

export default function PlayersPage() {
  const [query, setQuery] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function search() {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/players?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setPlayers(data.players || []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen court-pattern" style={{ background: "var(--color-bg)" }}>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 page-enter">
        <div className="mb-8">
          <p className="text-xs font-display font-600 tracking-widest uppercase mb-1" style={{ color: "var(--color-accent)" }}>
            Database
          </p>
          <h1 className="font-display font-800 text-5xl tracking-tight mb-2" style={{ color: "var(--color-text)" }}>
            Players
          </h1>
          <p style={{ color: "var(--color-text-muted)" }}>Search any NBA player by name.</p>
        </div>

        {/* Search input */}
        <div className="flex gap-3 mb-8">
          <div
            className="flex-1 flex items-center gap-3 rounded-xl px-4"
            style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
          >
            <Search size={16} style={{ color: "var(--color-text-subtle)" }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder="LeBron James, Stephen Curry..."
              className="flex-1 py-3 bg-transparent text-sm outline-none"
              style={{ color: "var(--color-text)" }}
            />
          </div>
          <button
            onClick={search}
            disabled={loading}
            className="btn-primary px-5 py-3 rounded-xl text-sm disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Results */}
        {searched && players.length === 0 && !loading && (
          <div className="text-center py-12">
            <User size={40} className="mx-auto mb-3" style={{ color: "var(--color-text-subtle)" }} />
            <p className="font-display font-600 text-lg" style={{ color: "var(--color-text-muted)" }}>No players found</p>
          </div>
        )}

        <div className="space-y-3">
          {players.map((player) => (
            <div
              key={player.id}
              className="rounded-xl p-4 flex items-center justify-between"
              style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-display font-800 text-sm text-white"
                  style={{ background: "var(--color-accent)" }}
                >
                  {player.first_name[0]}{player.last_name[0]}
                </div>
                <div>
                  <p className="font-display font-700 text-base" style={{ color: "var(--color-text)" }}>
                    {player.first_name} {player.last_name}
                  </p>
                  <p className="text-xs" style={{ color: "var(--color-text-subtle)" }}>
                    {player.position || "—"} · {player.team?.full_name || "Free Agent"}
                  </p>
                </div>
              </div>
              <span
                className="font-display font-700 text-xs tracking-wider uppercase px-3 py-1 rounded-full"
                style={{ background: "var(--color-bg-elevated)", color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}
              >
                {player.team?.abbreviation || "FA"}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
