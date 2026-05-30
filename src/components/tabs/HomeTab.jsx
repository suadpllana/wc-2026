import { ArrowRight, CalendarDays, Newspaper, Sparkles, Table2 } from "lucide-react";
import AdUnit from "../AdUnit";
import CountdownBox from "../CountdownBox";
import TeamFlag from "../TeamFlag";
import { ADSENSE_SLOTS, HOST_NATIONS } from "../../constants/worldCupData";
import { getMatchPrediction } from "../../utils/predictions";

function HomeButton({ children, icon, onClick, variant = "primary" }) {
  const ButtonIcon = icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-xs font-black uppercase tracking-wide transition ${
        variant === "primary" ? "bg-amber-300 text-zinc-950 hover:bg-white" : "border border-white/10 bg-white/5 text-white hover:border-amber-300/60"
      }`}
    >
      <ButtonIcon className="h-4 w-4" aria-hidden="true" />
      {children}
    </button>
  );
}

function MatchStrip({ match, onSelectMatch }) {
  const prediction = getMatchPrediction(match);

  return (
    <button
      type="button"
      onClick={() => onSelectMatch?.(match)}
      className="w-full rounded-lg border border-white/10 bg-zinc-900/90 p-4 text-left transition hover:border-amber-300/60 hover:bg-zinc-800"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-300">{match.group || match.round}</span>
        <span className="text-xs text-zinc-500">{match.date} / {match.time}</span>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <TeamFlag team={match.home} />
            <span className="truncate text-sm font-black text-white">{match.home.name}</span>
          </div>
        </div>
        <span className="rounded-md bg-zinc-950 px-3 py-1 text-xs font-black text-zinc-500">VS</span>
        <div className="min-w-0">
          <div className="flex items-center justify-end gap-2">
            <span className="truncate text-right text-sm font-black text-white">{match.away.name}</span>
            <TeamFlag team={match.away} />
          </div>
        </div>
      </div>
      <p className="mt-3 truncate text-xs text-zinc-500">{match.venue}, {match.city}</p>
      <p className="mt-2 text-xs font-bold text-amber-200">{prediction.primaryPick} / {prediction.bttsPick}</p>
    </button>
  );
}

export default function HomeTab({ countdown, onOpenFixtures, onOpenGroups, onOpenNews, onOpenPredictions, onSelectMatch, fixtures, featuredNews, newsError, newsLoading }) {
  const openingMatch = fixtures[0];
  const openingPrediction = getMatchPrediction(openingMatch);

  return (
    <div className="space-y-8">
      <section
        className="overflow-hidden rounded-lg border border-white/10 bg-zinc-900 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(9,10,15,0.96), rgba(9,10,15,0.78), rgba(9,10,15,0.94)), url('https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1800&q=80')",
        }}
      >
        <div className="grid gap-6 p-5 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-md bg-emerald-300/10 px-2 py-1 text-xs font-black uppercase tracking-[0.18em] text-emerald-200">
              World Cup 2026 dashboard
            </p>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-6xl">Fixtures, predictions, odds, groups and news</h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
              Track all 104 matches across the USA, Canada, and Mexico with clean match pages, real flags, model picks, and fresh World Cup news.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <HomeButton icon={CalendarDays} onClick={onOpenFixtures}>Fixtures</HomeButton>
              <HomeButton icon={Sparkles} onClick={onOpenPredictions} variant="secondary">Predictions</HomeButton>
              <HomeButton icon={Table2} onClick={onOpenGroups} variant="secondary">Groups</HomeButton>
              <HomeButton icon={Newspaper} onClick={onOpenNews} variant="secondary">News</HomeButton>
            </div>

            <div className="mt-8">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Opening match countdown</p>
              <div className="flex flex-wrap items-start gap-3">
                <CountdownBox value={countdown.days} label="Days" />
                <CountdownBox value={countdown.hours} label="Hours" />
                <CountdownBox value={countdown.minutes} label="Mins" />
                <CountdownBox value={countdown.seconds} label="Secs" />
              </div>
            </div>
          </div>

          {openingMatch && (
            <div className="rounded-lg border border-white/10 bg-zinc-950/80 p-4 shadow-2xl shadow-black/30">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">Next up</p>
                <span className="rounded-md bg-white/5 px-2 py-1 text-xs font-bold text-zinc-400">Match #{openingMatch.matchNumber}</span>
              </div>
              <button type="button" onClick={() => onSelectMatch?.(openingMatch)} className="block w-full rounded-lg bg-zinc-900 p-4 text-left transition hover:bg-zinc-800">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <div className="min-w-0">
                    <TeamFlag team={openingMatch.home} size="xl" />
                    <p className="mt-3 truncate text-xl font-black text-white">{openingMatch.home.name}</p>
                  </div>
                  <span className="rounded-lg bg-amber-300 px-3 py-2 text-xs font-black text-zinc-950">VS</span>
                  <div className="min-w-0 text-right">
                    <div className="flex justify-end">
                      <TeamFlag team={openingMatch.away} size="xl" />
                    </div>
                    <p className="mt-3 truncate text-xl font-black text-white">{openingMatch.away.name}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-zinc-400">{openingMatch.date} at {openingMatch.time}</p>
                <p className="text-sm text-zinc-500">{openingMatch.venue}, {openingMatch.city}</p>
              </button>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  ["1", openingMatch.home.name, openingPrediction.odds.home],
                  ["X", "Draw", openingPrediction.odds.draw],
                  ["2", openingMatch.away.name, openingPrediction.odds.away],
                ].map(([label, team, odds]) => (
                  <div key={label} className="rounded-lg border border-white/10 bg-zinc-900 p-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">{label}</p>
                    <p className="mt-1 truncate text-xs font-bold text-zinc-300">{team}</p>
                    <p className="mt-1 text-xl font-black text-amber-300">{odds}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { value: "48", label: "Teams" },
          { value: "104", label: "Matches" },
          { value: "16", label: "Venues" },
          { value: "3", label: "Host nations" },
        ].map((item) => (
          <div key={item.label} className="rounded-lg border border-white/10 bg-zinc-900 p-4">
            <div className="text-3xl font-black text-amber-300">{item.value}</div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{item.label}</div>
          </div>
        ))}
      </section>

      <AdUnit slot={ADSENSE_SLOTS.HOME_MID_RECTANGLE} format="rectangle" />

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-black tracking-tight">Opening Fixtures</h2>
          <button type="button" onClick={onOpenFixtures} className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wide text-amber-300 hover:text-white">
            View all
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          {fixtures.slice(0, 6).map((match) => (
            <MatchStrip key={match.id} match={match} onSelectMatch={onSelectMatch} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-black tracking-tight">Latest News</h2>
            <button type="button" onClick={onOpenNews} className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wide text-amber-300 hover:text-white">
              View all
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
          {newsError && <p className="mb-3 rounded-lg border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-xs text-amber-100">{newsError}</p>}
          <div className="grid gap-3 sm:grid-cols-2">
            {featuredNews.slice(0, 4).map((item, index) => (
              <article key={`${item.title}-${index}`} className="rounded-lg border border-white/10 bg-zinc-900 p-4 transition hover:border-amber-300/50">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-md bg-amber-300/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-amber-200">{item.tag}</span>
                  <span className="text-xs text-zinc-500">{item.time}</span>
                </div>
                <h3 className="text-sm font-bold leading-snug text-white">{item.title}</h3>
                {item.source && <p className="mt-2 text-xs text-zinc-500">{item.source}</p>}
              </article>
            ))}
          </div>
          {newsLoading && <p className="mt-3 text-xs text-zinc-500">Loading daily feed...</p>}
        </div>

        <div>
          <h2 className="mb-4 text-xl font-black tracking-tight">Host Nations</h2>
          <div className="grid gap-3">
            {HOST_NATIONS.map((host) => (
              <article key={host.country} className="rounded-lg border border-white/10 bg-zinc-900 p-4">
                <div className="mb-3 flex items-center gap-3">
                  <TeamFlag team={host.country} size="lg" />
                  <div>
                    <h3 className="font-black text-white">{host.country}</h3>
                    <p className="text-xs font-bold text-emerald-300">{host.venues}</p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-zinc-400">{host.cities}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <AdUnit slot={ADSENSE_SLOTS.HOME_BOTTOM_RECTANGLE} format="rectangle" />
    </div>
  );
}
