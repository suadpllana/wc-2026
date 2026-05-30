import { ArrowLeft, ExternalLink } from "lucide-react";
import AdUnit from "../AdUnit";
import TeamFlag from "../TeamFlag";
import { ADSENSE_SLOTS } from "../../constants/worldCupData";

export default function TeamDetailsTab({ team, onBack, stats, groupTitle, recentMatches, upcomingMatches, teamNews, teamNewsLoading, teamNewsError }) {
  if (!team) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-zinc-400">No team selected.</p>
        <button type="button" onClick={onBack} className="rounded-lg bg-amber-300 px-4 py-2 text-xs font-black uppercase tracking-wide text-zinc-950">Back</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-black uppercase tracking-wide text-zinc-200 transition hover:border-amber-300/60"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back
      </button>

      <section className="rounded-lg border border-white/10 bg-zinc-900 p-6">
        <div className="mb-5 flex items-center gap-4">
          <TeamFlag team={team} size="xl" />
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white">{team.name}</h2>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">{groupTitle || "FIFA World Cup 2026"}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-9">
          {[
            { label: "P", value: stats.played ?? 0 },
            { label: "W", value: stats.w ?? 0 },
            { label: "D", value: stats.d ?? 0 },
            { label: "L", value: stats.l ?? 0 },
            { label: "GF", value: stats.gf ?? 0 },
            { label: "GA", value: stats.ga ?? 0 },
            { label: "GD", value: stats.gd ?? 0 },
            { label: "PTS", value: stats.pts ?? 0 },
            { label: "Rank", value: stats.rank ?? "-" },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-white/10 bg-zinc-950/70 p-3 text-center">
              <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">{item.label}</p>
              <p className="mt-1 text-sm font-black text-amber-300">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <AdUnit slot={ADSENSE_SLOTS.TAB_TOP_BANNER} />

      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-white/10 bg-zinc-900 p-4">
          <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-white">Completed matches</h3>
          {recentMatches.map((match) => (
            <p key={match.id} className="mb-1 text-xs text-zinc-400">{match.date}: {match.home.name} {match.score} {match.away.name}</p>
          ))}
          {recentMatches.length === 0 && <p className="text-xs text-zinc-500">No completed matches yet.</p>}
        </div>

        <div className="rounded-lg border border-white/10 bg-zinc-900 p-4">
          <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-white">Upcoming matches</h3>
          {upcomingMatches.map((match) => (
            <p key={match.id} className="mb-1 text-xs text-zinc-400">{match.date}: {match.home.name} vs {match.away.name}</p>
          ))}
          {upcomingMatches.length === 0 && <p className="text-xs text-zinc-500">No upcoming matches listed.</p>}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-black tracking-tight">Team news and analysis</h3>
        {teamNewsError && <p className="mb-3 rounded-lg border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-xs text-amber-100">{teamNewsError}</p>}

        <div className="grid gap-3 sm:grid-cols-2">
          {teamNews.map((item, index) => (
            <article key={`${item.title}-${index}`} className="rounded-lg border border-white/10 bg-zinc-900 p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-md bg-amber-300/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-amber-200">{item.tag}</span>
                <span className="text-xs text-zinc-500">{item.time}</span>
              </div>
              <h4 className="text-sm font-bold leading-snug text-white">{item.title}</h4>
              <p className="mb-3 mt-2 text-xs text-zinc-500">{item.source}</p>
              <a href={item.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wide text-amber-300 hover:text-white">
                Read story
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>

        {teamNewsLoading && <p className="mt-3 text-xs text-zinc-500">Loading team news...</p>}
        {!teamNewsLoading && teamNews.length === 0 && <p className="text-xs text-zinc-500">No team stories found right now.</p>}
      </section>

      <AdUnit slot={ADSENSE_SLOTS.TAB_BOTTOM_RECTANGLE} format="rectangle" />
    </div>
  );
}
