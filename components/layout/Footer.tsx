import SiteLogo from "./SiteLogo";

export default function Footer() {
    return (
        <footer className="border-t mt-16 py-8" style={{ borderColor: "var(--color-border)" }}>
            <div className="h-[2px] w-full mb-8" style={{ background: "linear-gradient(90deg, var(--color-accent), transparent)" }} />
            <div
            className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2"
            style={{ color: "var(--color-text-subtle)" }}
            >
            <div className="flex items-center gap-2">
                <SiteLogo />
            </div>
            <span className="text-xs">Data via BallDontLie API · Built with Next.js</span>
            <span className="text-xs font-display font-700 tracking-widest uppercase">NBA Fan Hub</span>
            </div>
        </footer>
    )
}