import AdUnit from "../AdUnit";
import { ADSENSE_SLOTS } from "../../constants/worldCupData";

export default function ScoresTab({ fixtures, fixturesLoading, fixturesError, onSelectMatch }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black uppercase tracking-tight">Fixtures</h2>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-xs text-slate-400 font-medium">Real FIFA World Cup matches</span>
        </div>
      </div>
      {fixturesError && <p className="text-xs text-amber-300">{fixturesError}</p>}

      <AdUnit slot={ADSENSE_SLOTS.TAB_TOP_BANNER} />

      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
        <div className="bg-slate-700/50 px-5 py-3 border-b border-slate-700">
          <h3 className="font-black text-sm uppercase tracking-wide text-slate-300">📅 FIFA World Cup Fixtures & Results</h3>
        </div>

        {fixtures.map((match, index) => (
          <button
            key={match.id ?? index}
            type="button"
            onClick={() => onSelectMatch?.(match)}
            className="w-full text-left flex items-center px-5 py-4 border-b border-slate-700/50 hover:bg-slate-700/30 transition-all last:border-0"
          >
            <div className="w-28 shrink-0">
              <p className="text-yellow-400 font-bold text-xs">{match.date}</p>
              <p className="text-slate-400 text-xs">{match.time}</p>
            </div>
            <div className="flex-1 flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 w-32 justify-end">
                {match.home.flagUrl ? (
                  <img src={match.home.flagUrl} alt={match.home.name} className="w-5 h-5 rounded-full object-cover" loading="lazy" />
                ) : (
                  <span className="flag-emoji text-xl">{match.home.flag}</span>
                )}
                <span className="font-bold text-sm text-white text-right">{match.home.name}</span>
              </div>
              <div className="w-10 h-7 bg-slate-700 rounded flex items-center justify-center">
                <span className="text-slate-300 text-xs font-black">{match.score ?? "vs"}</span>
              </div>
              <div className="flex items-center gap-2 w-32">
                {match.away.flagUrl ? (
                  <img src={match.away.flagUrl} alt={match.away.name} className="w-5 h-5 rounded-full object-cover" loading="lazy" />
                ) : (
                  <span className="flag-emoji text-xl">{match.away.flag}</span>
                )}
                <span className="font-bold text-sm text-white">{match.away.name}</span>
              </div>
            </div>
            <div className="w-32 shrink-0 text-right hidden sm:block">
              <p className="text-slate-400 text-xs">{match.group ?? match.round ?? "Fixture"}</p>
              <p className="text-slate-500 text-xs">{match.city}</p>
            </div>
          </button>
        ))}

        {fixturesLoading && <p className="px-5 py-3 text-xs text-slate-500">Loading real World Cup fixtures...</p>}
      </div>

      <AdUnit slot={ADSENSE_SLOTS.TAB_BOTTOM_RECTANGLE} format="rectangle" />
    </div>
  );
}
