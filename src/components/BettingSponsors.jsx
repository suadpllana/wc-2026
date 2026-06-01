import { ExternalLink, ShieldCheck } from "lucide-react";
import { BETTING_SPONSORS, RESPONSIBLE_GAMBLING_URL } from "../constants/worldCupData";

export default function BettingSponsors({ compact = false }) {
  return (
    <section className={`rounded-lg border border-white/10 bg-zinc-950/70 ${compact ? "p-3" : "p-4"}`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-300">Bet on World Cup 2026</p>
          <p className="mt-1 text-xs text-zinc-400">18+ only. Follow local laws and gamble responsibly.</p>
        </div>
        <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-300" aria-hidden="true" />
      </div>

      <div className={`grid gap-2 ${compact ? "" : "sm:grid-cols-2"}`}>
        {BETTING_SPONSORS.map((sponsor) => (
          <a
            key={sponsor.id}
            href={sponsor.url}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="group flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-zinc-900 px-3 py-3 transition hover:border-amber-300/60 hover:bg-zinc-800"
          >
            <span className="min-w-0">
              <span className={`mb-2 block h-1 w-10 rounded-full bg-gradient-to-r ${sponsor.accentClass}`} />
              <span className="block text-sm font-black text-white">{sponsor.name}</span>
              <span className="block text-xs text-zinc-400">{sponsor.label}</span>
              {sponsor.offer && <span className="mt-1 block text-[11px] font-bold text-emerald-300">{sponsor.offer}</span>}
            </span>
            <ExternalLink className="h-4 w-4 shrink-0 text-zinc-500 transition group-hover:text-amber-300" aria-hidden="true" />
          </a>
        ))}
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-zinc-500">
        Sponsored links. We may earn a commission.{" "}
        <a href={RESPONSIBLE_GAMBLING_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-zinc-400 underline hover:text-amber-300">
          BeGambleAware.org
        </a>
      </p>
    </section>
  );
}
