import { ExternalLink, Newspaper } from "lucide-react";
import AdUnit from "../AdUnit";
import { ADSENSE_SLOTS } from "../../constants/worldCupData";

export default function NewsTab({ featuredNews, newsLoading, newsError }) {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/10 bg-zinc-900 p-5">
        <p className="mb-2 inline-flex items-center gap-2 rounded-md bg-emerald-300/10 px-2 py-1 text-xs font-black uppercase tracking-[0.18em] text-emerald-200">
          <Newspaper className="h-3.5 w-3.5" aria-hidden="true" />
          Newsroom
        </p>
        <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">World Cup 2026 news and analysis</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">Fresh fixture updates, team stories, previews, injury notes, and analysis from the daily news feed.</p>
      </section>

      {newsError && <p className="rounded-lg border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-xs text-amber-100">{newsError}</p>}

      <AdUnit slot={ADSENSE_SLOTS.TAB_TOP_BANNER} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {featuredNews.map((item, index) => (
          <article key={`${item.title}-${index}`} className="rounded-lg border border-white/10 bg-zinc-900 p-4 transition hover:border-amber-300/50">
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-md bg-amber-300/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-amber-200">{item.tag}</span>
              <span className="text-xs text-zinc-500">{item.time}</span>
            </div>
            <h3 className="text-sm font-bold leading-snug text-white">{item.title}</h3>
            <p className="mb-3 mt-2 text-xs text-zinc-500">{item.source}</p>
            <a href={item.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wide text-amber-300 hover:text-white">
              Read story
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </article>
        ))}
      </div>

      {newsLoading && <p className="text-xs text-zinc-500">Loading daily stories...</p>}
      {!newsLoading && featuredNews.length === 0 && <p className="text-sm text-zinc-400">No stories found right now.</p>}

      <AdUnit slot={ADSENSE_SLOTS.TAB_BOTTOM_RECTANGLE} format="rectangle" />
    </div>
  );
}
