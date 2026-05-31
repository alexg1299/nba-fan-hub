export default function SiteLogo({ size = 32, includeLogo = false }: { size?: number; includeLogo?: boolean }) {
  return (
    <>
      {/* Basketball Icon */}
      {includeLogo && (
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
          style={{
            background: "var(--color-accent)",
            boxShadow: "0 2px 10px var(--color-accent-glow)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" />
            <path d="M12 2C12 2 12 22 12 22" stroke="white" strokeWidth="1.5" />
            <path d="M2 12C2 12 22 12 22 12" stroke="white" strokeWidth="1.5" />
            <path d="M4.93 4.93C7.5 7.5 9 12 9 12C9 12 7.5 16.5 4.93 19.07" stroke="white" strokeWidth="1.5" />
            <path d="M19.07 4.93C16.5 7.5 15 12 15 12C15 12 16.5 16.5 19.07 19.07" stroke="white" strokeWidth="1.5" />
          </svg>
        </div>
      )}
      <div className="hidden sm:block">
        <span
          className="font-hero text-2xl tracking-wider leading-none"
          style={{ color: "var(--color-text)", letterSpacing: "0.08em" }}
        >
          COURT
        </span>
        <span
          className="font-hero text-2xl tracking-wider leading-none"
          style={{ color: "var(--color-accent)", letterSpacing: "0.08em" }}
        >
          SIDE
        </span>
      </div>
    </>
  );
}
