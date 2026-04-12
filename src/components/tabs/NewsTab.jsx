import AdUnit from "../AdUnit";
import { ADSENSE_SLOTS } from "../../constants/worldCupData";

export default function NewsTab({ featuredNews, newsLoading, newsError }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-black uppercase tracking-tight">Daily World Cup News</h2>
        <span className="text-xs text-slate-400">Updates every 15 min</span>
      </div>
      {newsError && <p className="text-xs text-amber-300">{newsError}</p>}

      <AdUnit slot={ADSENSE_SLOTS.TAB_TOP_BANNER} />

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {featuredNews.map((item, index) => (
          <article key={`${item.title}-${index}`} className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-yellow-400/40 transition-all">
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">{item.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-black text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded">{item.tag}</span>
                  <span className="text-xs text-slate-500">{item.time}</span>
                </div>
                <h3 className="font-bold text-sm leading-snug text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-500 mb-3">{item.source}</p>
                <a href={item.link} target="_blank" rel="noreferrer" className="inline-flex text-xs font-bold uppercase tracking-wide text-yellow-400 hover:text-yellow-300">
                  Read Story →
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {newsLoading && <p className="text-xs text-slate-500">Loading daily stories...</p>}
      {!newsLoading && featuredNews.length === 0 && <p className="text-sm text-slate-400">No stories found right now.</p>}

      <AdUnit slot={ADSENSE_SLOTS.TAB_BOTTOM_RECTANGLE} format="rectangle" />
    </div>
  );
}
