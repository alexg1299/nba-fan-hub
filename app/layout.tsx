import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "CourtSide | NBA Game Day Fan Hub", template: "%s | CourtSide" },
  description: "Your ultimate NBA Game Day companion. Live scores, upcoming matchups, key player stats, and in-depth game breakdowns.",
  keywords: ["NBA", "basketball", "scores", "stats", "game day", "fan hub"],
  openGraph: {
    title: "CourtSide — NBA Game Day Fan Hub",
    description: "Live scores, upcoming matchups, and in-depth game breakdowns.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
