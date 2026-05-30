import { useMemo, useState } from "react";
import { ArrowRight, Filter, Search, Sparkles, TrendingUp } from "lucide-react";
import AdUnit from "../AdUnit";
import BettingSponsors from "../BettingSponsors";
import TeamFlag from "../TeamFlag";
import { ADSENSE_SLOTS } from "../../constants/worldCupData";
import { getMatchPrediction } from "../../utils/predictions";

function OddsPill({ label, team, value, highlight }) {
  return (
    <div className={`rounded-lg border p-2 ${highlight ? "border-amber-300 bg-amber-300 text-zinc-950" : "border-white/10 bg-zinc-950/60 text-zinc-200"}`}>
      <p className="text-[10px] font-black uppercase tracking-[0.16em] opacity-70">{label}</p>
      <p className="mt-1 truncate text-xs font-bold">{team}</p>
      <p className="mt-1 text-lg font-black tabular-nums">{value}</p>
    </div>
  );
}

function PredictionCard({ match, onSelectMatch }) {
  const prediction = getMatchPrediction(match);
  const strongest = Object.entries(prediction.probabilities).sort(([, a], [, b]) => b - a)[0][0];

  return (
    <article className="rounded-lg border border-white/10 bg-zinc-900/80 p-4 transition hover:border-amber-300/50">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-300">
            {match.group || match.round}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {match.date} at {match.time} / {match.city}
          </p>
        </div>
        <span className="rounded-md bg-white/5 px-2 py-1 text-xs font-bold text-zinc-400">#{match.matchNumber}</span>
      </div>

      <div className="mb-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <TeamFlag team={match.home} />
            <p className="truncate text-sm font-black text-white">{match.home.name}</p>
          </div>
          <p className="text-xs text-zinc-500">{prediction.probabilities.home}% win</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-xs font-black text-zinc-500">VS</div>
        <div className="min-w-0 text-right">
          <div className="mb-2 flex items-center justify-end gap-2">
            <p className="truncate text-sm font-black text-white">{match.away.name}</p>
            <TeamFlag team={match.away} />
          </div>
          <p className="text-xs text-zinc-500">{prediction.probabilities.away}% win</p>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2">
        <OddsPill label="1" team={match.home.name} value={prediction.odds.home} highlight={strongest === "home"} />
        <OddsPill label="X" team="Draw" value={prediction.odds.draw} highlight={strongest === "draw"} />
        <OddsPill label="2" team={match.away.name} value={prediction.odds.away} highlight={strongest === "away"} />
      </div>

      <div className="rounded-lg border border-white/10 bg-zinc-950/70 p-3">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-300/10 px-2 py-1 text-xs font-black text-emerald-200">
            <TrendingUp className="h-3 w-3" aria-hidden="true" />
            {prediction.primaryPick}
          </span>
          <span className="rounded-md bg-sky-300/10 px-2 py-1 text-xs font-black text-sky-200">{prediction.bttsPick}</span>
        </div>
        <p className="text-xs leading-relaxed text-zinc-400">{prediction.explanation}</p>
      </div>

      <button
        type="button"
        onClick={() => onSelectMatch?.(match)}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-black uppercase tracking-wide text-zinc-950 transition hover:bg-amber-300"
      >
        Match details
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </article>
  );
}

export default function PredictionsTab({ fixtures, fixturesLoading, fixturesError, onSelectMatch }) {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("all");

  const filteredFixtures = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return fixtures.filter((match) => {
      const haystack = `${match.home.name} ${match.away.name} ${match.group} ${match.round} ${match.city}`.toLowerCase();
      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
      const matchesStage =
        stage === "all" ||
        (stage === "groups" && match.group) ||
        (stage === "knockout" && !match.group) ||
        (stage.length === 1 && match.group === `Group ${stage}`);
      return matchesQuery && matchesStage;
    });
  }, [fixtures, query, stage]);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/10 bg-zinc-900 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-md bg-amber-300/10 px-2 py-1 text-xs font-black uppercase tracking-[0.18em] text-amber-200">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Model predictions
            </p>
            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">World Cup 2026 predictions and 1X2 odds</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
              Every fixture gets a 1X2 estimate, both-teams-to-score lean, and a short matchup note. Prices are editorial model odds, not live sportsbook lines.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-zinc-950 p-3">
              <p className="text-xl font-black text-amber-300">{fixtures.length}</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">Games</p>
            </div>
            <div className="rounded-lg bg-zinc-950 p-3">
              <p className="text-xl font-black text-emerald-300">1X2</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">Odds</p>
            </div>
            <div className="rounded-lg bg-zinc-950 p-3">
              <p className="text-xl font-black text-sky-300">BTTS</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">Lean</p>
            </div>
          </div>
        </div>
      </section>

      {fixturesError && <p className="rounded-lg border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-xs text-amber-100">{fixturesError}</p>}

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-zinc-900 p-3 md:flex-row">
            <label className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search team, group, city..."
                className="h-11 w-full rounded-lg border border-white/10 bg-zinc-950 pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-300"
              />
            </label>
            <label className="relative md:w-56">
              <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
              <select
                value={stage}
                onChange={(event) => setStage(event.target.value)}
                className="h-11 w-full appearance-none rounded-lg border border-white/10 bg-zinc-950 pl-9 pr-3 text-sm font-bold text-white outline-none transition focus:border-amber-300"
              >
                <option value="all">All matches</option>
                <option value="groups">Group stage</option>
                <option value="knockout">Knockout stage</option>
                {"ABCDEFGHIJKL".split("").map((letter) => (
                  <option key={letter} value={letter}>{`Group ${letter}`}</option>
                ))}
              </select>
            </label>
          </div>

          <AdUnit slot={ADSENSE_SLOTS.PREDICTIONS_IN_ARTICLE || ADSENSE_SLOTS.TAB_TOP_BANNER} />

          <div className="grid gap-4 xl:grid-cols-2">
            {filteredFixtures.map((match) => (
              <PredictionCard key={match.id} match={match} onSelectMatch={onSelectMatch} />
            ))}
          </div>

          {fixturesLoading && <p className="text-xs text-zinc-500">Refreshing fixture feed...</p>}
          {!fixturesLoading && filteredFixtures.length === 0 && <p className="text-sm text-zinc-400">No predictions match that filter.</p>}
        </div>

        <aside className="space-y-4">
          <BettingSponsors />
          <div className="rounded-lg border border-white/10 bg-zinc-900 p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">How to read it</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              1 is the listed home team, X is draw, and 2 is the listed away team. Lower decimal odds mean the model sees that outcome as more likely.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
