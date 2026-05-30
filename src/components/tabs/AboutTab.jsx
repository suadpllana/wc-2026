import { Globe2, ShieldCheck } from "lucide-react";
import AdUnit from "../AdUnit";
import { ADSENSE_SLOTS } from "../../constants/worldCupData";

export default function AboutTab() {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/10 bg-zinc-900 p-6">
        <p className="mb-2 inline-flex items-center gap-2 rounded-md bg-emerald-300/10 px-2 py-1 text-xs font-black uppercase tracking-[0.18em] text-emerald-200">
          <Globe2 className="h-3.5 w-3.5" aria-hidden="true" />
          Tournament guide
        </p>
        <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">About World Cup 2026</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400">
          This platform tracks FIFA World Cup 2026 fixtures, group tables, teams, predictions, estimated odds, and football news in one place. The tournament is hosted by the USA, Canada, and Mexico with 48 teams and 104 matches.
        </p>
      </section>

      <AdUnit slot={ADSENSE_SLOTS.TAB_TOP_BANNER} />

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          { title: "48 teams", desc: "The largest men's World Cup field yet." },
          { title: "3 host nations", desc: "The United States, Canada, and Mexico share hosting duties." },
          { title: "104 matches", desc: "Group stage, Round of 32, and a larger knockout path." },
        ].map((item) => (
          <div key={item.title} className="rounded-lg border border-white/10 bg-zinc-900 p-4">
            <p className="text-sm font-black text-amber-300">{item.title}</p>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400">{item.desc}</p>
          </div>
        ))}
      </section>

      <section>
        <h3 className="mb-3 text-lg font-black tracking-tight">Historic World Cup classics</h3>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {[
            { match: "Brazil 1-7 Germany", year: "2014 Semi-final", story: "Germany stunned Brazil with five goals in the first half hour." },
            { match: "Argentina 3-3 France", year: "2022 Final", story: "Messi and Mbappe delivered one of the most dramatic finals ever." },
            { match: "Italy 3-2 Brazil", year: "1982 Group Stage", story: "Paolo Rossi's hat-trick decided a legendary tactical battle." },
            { match: "England 4-2 West Germany", year: "1966 Final", story: "Geoff Hurst scored a final hat-trick as England won at Wembley." },
            { match: "Uruguay 2-1 Brazil", year: "1950 Final Round", story: "The Maracanazo remains one of football's defining shocks." },
            { match: "Netherlands 5-1 Spain", year: "2014 Group Stage", story: "The Dutch dismantled the reigning champions in Salvador." },
          ].map((item) => (
            <article key={`${item.match}-${item.year}`} className="rounded-lg border border-white/10 bg-zinc-900 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-amber-300">{item.year}</p>
              <h4 className="mb-2 mt-1 text-sm font-black text-white">{item.match}</h4>
              <p className="text-xs leading-relaxed text-zinc-400">{item.story}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-zinc-900 p-5">
        <div className="mb-3 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-300" aria-hidden="true" />
          <h3 className="text-lg font-black tracking-tight">Editorial and betting disclosure</h3>
        </div>
        <p className="text-sm leading-relaxed text-zinc-400">
          Predictions and odds are model estimates for editorial use. Sponsored betting links are marked as sponsored, may use affiliate URLs, and are intended only for adults in places where online betting is legal.
        </p>
      </section>

      <AdUnit slot={ADSENSE_SLOTS.TAB_BOTTOM_RECTANGLE} format="rectangle" />
    </div>
  );
}
