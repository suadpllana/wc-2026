import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Search } from "lucide-react";
import AdUnit from "../AdUnit";
import TeamFlag from "../TeamFlag";
import { ADSENSE_SLOTS } from "../../constants/worldCupData";

export default function ScoresTab({ fixtures, fixturesLoading, fixturesError, onSelectMatch }) {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("all");

  const filteredFixtures = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return fixtures.filter((match) => {
      const haystack = `${match.home.name} ${match.away.name} ${match.group} ${match.round} ${match.city} ${match.venue}`.toLowerCase();
      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
      const matchesStage = stage === "all" || (stage === "groups" && match.group) || (stage === "knockout" && !match.group);
      return matchesQuery && matchesStage;
    });
  }, [fixtures, query, stage]);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/10 bg-zinc-900 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-md bg-emerald-300/10 px-2 py-1 text-xs font-black uppercase tracking-[0.18em] text-emerald-200">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              Full schedule
            </p>
            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">World Cup 2026 fixtures</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
              Every match is clickable, with flags, venue context, predictions, news, and team pages connected from the fixture detail view.
            </p>
          </div>
          <div className="rounded-lg bg-zinc-950 px-4 py-3 text-center">
            <p className="text-2xl font-black text-amber-300">{fixtures.length}</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">matches</p>
          </div>
        </div>
      </section>

      {fixturesError && <p className="rounded-lg border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-xs text-amber-100">{fixturesError}</p>}

      <AdUnit slot={ADSENSE_SLOTS.TAB_TOP_BANNER} />

      <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-zinc-900 p-3 md:flex-row">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search fixtures..."
            className="h-11 w-full rounded-lg border border-white/10 bg-zinc-950 pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-300"
          />
        </label>
        <div className="grid grid-cols-3 gap-2 md:w-80">
          {[
            ["all", "All"],
            ["groups", "Groups"],
            ["knockout", "Knockout"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setStage(id)}
              className={`rounded-lg px-3 py-2 text-xs font-black uppercase tracking-wide transition ${
                stage === id ? "bg-amber-300 text-zinc-950" : "bg-zinc-950 text-zinc-400 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-900">
        {filteredFixtures.map((match) => (
          <button
            key={match.id}
            type="button"
            onClick={() => onSelectMatch?.(match)}
            className="grid w-full gap-3 border-b border-white/10 px-4 py-4 text-left transition last:border-0 hover:bg-white/5 md:grid-cols-[120px_1fr_180px_32px] md:items-center"
          >
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-amber-300">{match.date}</p>
              <p className="mt-1 text-xs text-zinc-500">{match.time}</p>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 md:justify-end">
                  <TeamFlag team={match.home} />
                  <span className="truncate text-sm font-black text-white md:text-right">{match.home.name}</span>
                </div>
              </div>
              <div className="rounded-lg bg-zinc-950 px-3 py-2 text-xs font-black text-zinc-400">{match.score ?? "vs"}</div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <TeamFlag team={match.away} />
                  <span className="truncate text-sm font-black text-white">{match.away.name}</span>
                </div>
              </div>
            </div>

            <div className="text-left md:text-right">
              <p className="text-xs font-bold text-zinc-300">{match.group || match.round}</p>
              <p className="mt-1 text-xs text-zinc-500">{match.city}</p>
            </div>

            <ArrowRight className="hidden h-4 w-4 text-zinc-600 md:block" aria-hidden="true" />
          </button>
        ))}

        {fixturesLoading && <p className="px-5 py-3 text-xs text-zinc-500">Refreshing World Cup fixtures...</p>}
        {!fixturesLoading && filteredFixtures.length === 0 && <p className="px-5 py-8 text-sm text-zinc-400">No fixtures match that search.</p>}
      </div>

      <AdUnit slot={ADSENSE_SLOTS.TAB_BOTTOM_RECTANGLE} format="rectangle" />
    </div>
  );
}
