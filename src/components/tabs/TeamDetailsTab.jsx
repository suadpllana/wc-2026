import AdUnit from "../AdUnit";
import { ADSENSE_SLOTS } from "../../constants/worldCupData";

function TeamFlag({ team }) {
  if (team?.flagUrl) {
    return <img src={team.flagUrl} alt={team.name} className="w-8 h-8 rounded-full object-cover" loading="lazy" />;
  }
  return <span className="flag-emoji text-2xl">{team?.flag ?? "🏳️"}</span>;
}

export default function TeamDetailsTab({ team, onBack, stats, groupTitle, recentMatches, upcomingMatches, teamNews, teamNewsLoading, teamNewsError }) {
  if (!team) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-400">No team selected.</p>
        <button onClick={onBack} className="px-4 py-2 rounded-lg bg-yellow-400 text-slate-900 font-bold text-xs uppercase tracking-wide">Back</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <button onClick={onBack} className="px-3 py-1.5 rounded-lg border border-slate-600 text-slate-200 text-xs font-bold uppercase tracking-wide hover:bg-slate-800">
          ← Back
        </button>
        <span className="text-xs text-slate-400">Team Details</span>
      </div>

      <section className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <TeamFlag team={team} />
          <div>
            <h2 className="font-black text-2xl tracking-tight">{team.name}</h2>
            <p className="text-xs text-slate-400 uppercase tracking-wider">{groupTitle || "FIFA World Cup 2026"}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
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
            <div key={item.label} className="bg-slate-700/40 border border-slate-700 rounded-lg p-2 text-center">
              <p className="text-[10px] uppercase tracking-widest text-slate-500">{item.label}</p>
              <p className="text-sm font-black text-yellow-400 mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <AdUnit slot={ADSENSE_SLOTS.TAB_TOP_BANNER} />

      <section className="grid sm:grid-cols-2 gap-3">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
          <h3 className="font-black text-sm uppercase tracking-tight mb-3">Recent Matches</h3>
          {(recentMatches.length > 0 ? recentMatches : []).map((match) => (
            <p key={match.id} className="text-xs text-slate-300 mb-1">{match.date} • {match.home.name} {match.score} {match.away.name}</p>
          ))}
          {recentMatches.length === 0 && <p className="text-xs text-slate-500">No completed matches yet.</p>}
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
          <h3 className="font-black text-sm uppercase tracking-tight mb-3">Upcoming Matches</h3>
          {(upcomingMatches.length > 0 ? upcomingMatches : []).map((match) => (
            <p key={match.id} className="text-xs text-slate-300 mb-1">{match.date} • {match.home.name} vs {match.away.name}</p>
          ))}
          {upcomingMatches.length === 0 && <p className="text-xs text-slate-500">No upcoming matches listed.</p>}
        </div>
      </section>

      <section>
        <h3 className="font-black text-base uppercase tracking-tight mb-3">Team News & Analysis</h3>
        {teamNewsError && <p className="text-xs text-amber-300 mb-3">{teamNewsError}</p>}

        <div className="grid sm:grid-cols-2 gap-3">
          {teamNews.map((item, index) => (
            <article key={`${item.title}-${index}`} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">{item.emoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded">{item.tag}</span>
                    <span className="text-xs text-slate-500">{item.time}</span>
                  </div>
                  <h4 className="font-bold text-sm leading-snug text-white">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 mb-2">{item.source}</p>
                  <a href={item.link} target="_blank" rel="noreferrer" className="text-xs font-bold uppercase tracking-wide text-yellow-400 hover:text-yellow-300">Read story →</a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {teamNewsLoading && <p className="text-xs text-slate-500 mt-3">Loading team news...</p>}
        {!teamNewsLoading && teamNews.length === 0 && <p className="text-xs text-slate-500">No team stories found right now.</p>}
      </section>

      <AdUnit slot={ADSENSE_SLOTS.TAB_BOTTOM_RECTANGLE} format="rectangle" />
    </div>
  );
}
