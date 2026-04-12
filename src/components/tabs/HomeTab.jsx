import AdUnit from "../AdUnit";
import CountdownBox from "../CountdownBox";
import { ADSENSE_SLOTS } from "../../constants/worldCupData";

export default function HomeTab({ countdown, onOpenFixtures, onOpenGroups, onOpenNews, fixtures, featuredNews, newsError, newsLoading }) {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #facc15 0%, transparent 50%), radial-gradient(circle at 80% 50%, #3b82f6 0%, transparent 50%)" }} />
        <div className="relative z-10">
          <div className="text-5xl mb-3">🏆</div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-1">FIFA World Cup 2026</h1>
          <p className="text-yellow-400 font-bold text-lg mb-6">USA · Canada · Mexico · June 11 - July 19</p>
          <p className="text-slate-400 text-sm mb-8 uppercase tracking-widest font-semibold">Tournament Begins In</p>
          <div className="flex items-start justify-center gap-4">
            <CountdownBox value={countdown.days} label="Days" />
            <span className="text-yellow-400 text-3xl font-black mt-4">:</span>
            <CountdownBox value={countdown.hours} label="Hours" />
            <span className="text-yellow-400 text-3xl font-black mt-4">:</span>
            <CountdownBox value={countdown.minutes} label="Mins" />
            <span className="text-yellow-400 text-3xl font-black mt-4">:</span>
            <CountdownBox value={countdown.seconds} label="Secs" />
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button onClick={onOpenFixtures} className="px-5 py-2.5 rounded-lg bg-yellow-400 text-slate-900 font-black text-sm uppercase tracking-wide hover:bg-yellow-300 transition-all">View Fixtures</button>
            <button onClick={onOpenGroups} className="px-5 py-2.5 rounded-lg border border-slate-600 text-white font-black text-sm uppercase tracking-wide hover:bg-slate-800 transition-all">View Groups</button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { value: "48", label: "Teams", icon: "🌍" },
          { value: "104", label: "Matches", icon: "⚽" },
          { value: "16", label: "Venues", icon: "🏟️" },
          { value: "3", label: "Host Nations", icon: "🏅" },
        ].map((item) => (
          <div key={item.label} className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className="text-3xl font-black text-yellow-400">{item.value}</div>
            <div className="text-xs text-slate-400 uppercase tracking-widest mt-1 font-semibold">{item.label}</div>
          </div>
        ))}
      </section>

      <AdUnit slot={ADSENSE_SLOTS.HOME_MID_RECTANGLE} format="rectangle" />

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black uppercase tracking-tight">Opening Fixtures</h2>
          <button onClick={onOpenFixtures} className="text-yellow-400 text-xs font-bold uppercase tracking-wide hover:text-yellow-300">View All →</button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {fixtures.slice(0, 6).map((match, index) => (
            <div key={index} className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-yellow-400/30 transition-all">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-yellow-400 font-bold">{match.date} · {match.time}</span>
                <span className="text-xs text-slate-500 font-medium">{match.city}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  {match.home.flagUrl ? (
                    <img src={match.home.flagUrl} alt={match.home.name} className="w-5 h-5 rounded-full object-cover" loading="lazy" />
                  ) : (
                    <span className="flag-emoji text-xl">{match.home.flag}</span>
                  )}
                  <span className="font-bold text-sm text-white">{match.home.name}</span>
                </div>
                <div className="px-3 py-1 bg-slate-700 rounded-lg mx-2">
                  <span className="text-slate-300 font-black text-sm">VS</span>
                </div>
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <span className="font-bold text-sm text-white">{match.away.name}</span>
                  {match.away.flagUrl ? (
                    <img src={match.away.flagUrl} alt={match.away.name} className="w-5 h-5 rounded-full object-cover" loading="lazy" />
                  ) : (
                    <span className="flag-emoji text-xl">{match.away.flag}</span>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2 text-center">{match.venue}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black uppercase tracking-tight">Latest News & Analysis</h2>
          <button onClick={onOpenNews} className="text-yellow-400 text-xs font-bold uppercase tracking-wide hover:text-yellow-300">View All →</button>
        </div>
        {newsError && <p className="text-xs text-amber-300 mb-3">{newsError}</p>}
        <div className="grid sm:grid-cols-2 gap-3">
          {featuredNews.slice(0, 6).map((item, index) => (
            <article key={`${item.title}-${index}`} className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-slate-500 cursor-pointer transition-all group">
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-black text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded">{item.tag}</span>
                    <span className="text-xs text-slate-500">{item.time}</span>
                  </div>
                  <h3 className="font-bold text-sm text-white leading-snug group-hover:text-yellow-400 transition-colors">{item.title}</h3>
                  {item.source && <p className="text-xs text-slate-500 mt-1">{item.source}</p>}
                </div>
              </div>
            </article>
          ))}
        </div>
        {newsLoading && <p className="text-xs text-slate-500 mt-3">Loading daily feed...</p>}
      </section>

      <section>
        <h2 className="text-lg font-black uppercase tracking-tight mb-4">Host Nations</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { flag: "🇺🇸", country: "United States", venues: "11 venues", cities: "Atlanta, Boston, Dallas, LA, Miami, NY, Philadelphia, San Francisco, Seattle, Kansas City, Houston" },
            { flag: "🇨🇦", country: "Canada", venues: "2 venues", cities: "Toronto, Vancouver" },
            { flag: "🇲🇽", country: "Mexico", venues: "3 venues", cities: "Mexico City, Guadalajara, Monterrey" },
          ].map((host) => (
            <div key={host.country} className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <div className="flag-emoji text-4xl mb-3">{host.flag}</div>
              <h3 className="font-black text-white text-base mb-1">{host.country}</h3>
              <p className="text-yellow-400 text-xs font-bold mb-2">{host.venues}</p>
              <p className="text-slate-400 text-xs leading-relaxed">{host.cities}</p>
            </div>
          ))}
        </div>
      </section>

      <AdUnit slot={ADSENSE_SLOTS.HOME_BOTTOM_RECTANGLE} format="rectangle" />
    </div>
  );
}
