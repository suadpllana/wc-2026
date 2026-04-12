import AdUnit from "../AdUnit";
import { ADSENSE_SLOTS } from "../../constants/worldCupData";

export default function AboutTab() {
  return (
    <div className="space-y-6">
      <section className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <h2 className="text-2xl font-black uppercase tracking-tight mb-2">About World Cup 2026</h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          This platform tracks FIFA World Cup 2026 fixtures, group tables, teams, and live football stories in one place.
          The tournament is hosted by USA, Canada, and Mexico with a 48-team format for the first time in history.
        </p>
      </section>

      <AdUnit slot={ADSENSE_SLOTS.TAB_TOP_BANNER} />

      <section>
        <h3 className="font-black text-base uppercase tracking-tight mb-3">Historic World Cup Classics</h3>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {[
            { match: "Brazil 1-7 Germany", year: "2014 Semi-final", story: "The Mineirazo stunned the football world as Germany scored 5 in 29 minutes." },
            { match: "Argentina 3-3 France (4-2 pens)", year: "2022 Final", story: "A final for the ages with a Mbappe hat-trick and Messi lifting the trophy." },
            { match: "Italy 3-2 Brazil", year: "1982 Group Stage", story: "Paolo Rossi hat-trick in one of the greatest tactical battles ever played." },
            { match: "England 4-2 West Germany", year: "1966 Final", story: "The only World Cup title for England, remembered for Geoff Hurst's hat-trick." },
            { match: "Uruguay 2-1 Brazil", year: "1950 Final Round", story: "The Maracanazo remains one of the most dramatic shocks in football history." },
            { match: "Netherlands 5-1 Spain", year: "2014 Group Stage", story: "Van Persie's flying header opened a dominant Dutch revenge performance." },
          ].map((item) => (
            <article key={`${item.match}-${item.year}`} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-xs uppercase tracking-wider text-yellow-400">{item.year}</p>
              <h4 className="font-black text-sm mt-1 mb-2">{item.match}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.story}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-black text-base uppercase tracking-tight mb-3">Records Broken in WC 2022</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            "Lionel Messi became the first player to score in every knockout round of a single World Cup.",
            "Kylian Mbappe became the first man since 1966 to score a hat-trick in a World Cup final.",
            "Morocco became the first African nation to reach a World Cup semi-final.",
            "The 2022 final became the highest-scoring World Cup final since 1966.",
            "Argentina lifted a third World Cup title after a 36-year wait.",
            "Qatar 2022 delivered one of the biggest upset catalogs in modern tournament history.",
          ].map((record) => (
            <div key={record} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex gap-2">
              <span className="text-yellow-400">•</span>
              <p className="text-xs text-slate-300 leading-relaxed">{record}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <h3 className="font-black text-base uppercase tracking-tight mb-4">What Makes 2026 Unique</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { title: "48 Teams", desc: "Biggest World Cup ever with more continents represented." },
            { title: "3 Host Nations", desc: "First tournament co-hosted by USA, Canada, and Mexico." },
            { title: "104 Matches", desc: "Expanded format creates more stories, rivalries, and underdog runs." },
          ].map((item) => (
            <div key={item.title} className="bg-slate-700/40 border border-slate-700 rounded-xl p-4">
              <p className="text-yellow-400 font-black text-sm mb-1">{item.title}</p>
              <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <AdUnit slot={ADSENSE_SLOTS.TAB_BOTTOM_RECTANGLE} format="rectangle" />
    </div>
  );
}
