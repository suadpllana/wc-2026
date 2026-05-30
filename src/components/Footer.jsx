import { Trophy } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-14 border-t border-white/10 bg-zinc-950 py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-300 text-zinc-950">
                <Trophy className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="font-black text-white">WC2026.live</span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-zinc-400">
              Fixtures, group tables, match predictions, estimated 1X2 odds, and World Cup 2026 news in one fast fan dashboard.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-zinc-600">
              Not affiliated with FIFA. Betting content is informational, 18+ only, and subject to local law.
            </p>
          </div>

          {[
            { title: "Tournament", links: [["Fixtures", "/fixtures"], ["Predictions", "/predictions"], ["Groups", "/groups"], ["Top Scorers", "/scorers"]] },
            { title: "Coverage", links: [["Latest News", "/news"], ["Match Previews", "/predictions"], ["Team Pages", "/groups"], ["About", "/about"]] },
            { title: "Legal", links: [["Privacy Policy", "/about"], ["Terms", "/about"], ["Contact", "/about"], ["Sitemap", "/sitemap.xml"]] },
          ].map((column) => (
            <div key={column.title}>
              <h4 className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-amber-300">{column.title}</h4>
              <ul className="space-y-2">
                {column.links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="text-sm text-zinc-500 transition hover:text-white">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright 2026 WC2026.live. All rights reserved.</p>
          <p>Odds are model estimates, not live sportsbook prices.</p>
        </div>
      </div>
    </footer>
  );
}
