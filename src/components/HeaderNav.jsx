import { BarChart3, CalendarDays, Home, Newspaper, Sparkles, Table2, Trophy } from "lucide-react";

const tabIcons = {
  home: Home,
  scores: CalendarDays,
  predictions: Sparkles,
  groups: Table2,
  news: Newspaper,
  scorers: BarChart3,
  about: Trophy,
};

function toHref(path) {
  return path ? `/${path}` : "/";
}

export default function HeaderNav({ tabs, activeTab, onNavigate }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/92 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex min-h-16 items-center justify-between gap-4">
          <a
            href="/"
            onClick={(event) => {
              event.preventDefault();
              onNavigate?.("");
            }}
            className="flex items-center gap-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-300 via-amber-300 to-rose-400 text-zinc-950 shadow-lg shadow-amber-950/20">
              <Trophy className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-black uppercase tracking-wide text-white">WC2026.live</span>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Fixtures, odds, news</span>
            </span>
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {tabs.map((tab) => {
              const Icon = tabIcons[tab.id] || Trophy;
              return (
                <a
                  key={tab.id}
                  href={toHref(tab.path)}
                  onClick={(event) => {
                    event.preventDefault();
                    onNavigate?.(tab.path);
                  }}
                  aria-current={activeTab === tab.id ? "page" : undefined}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-black uppercase tracking-wide transition ${
                    activeTab === tab.id ? "bg-amber-300 text-zinc-950" : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {tab.label}
                </a>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-bold text-emerald-200 md:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            104 matches
          </div>
        </div>

        <nav className="-mx-1 flex gap-1 overflow-x-auto pb-3 no-scrollbar lg:hidden">
          {tabs.map((tab) => {
            const Icon = tabIcons[tab.id] || Trophy;
            return (
              <a
                key={tab.id}
                href={toHref(tab.path)}
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate?.(tab.path);
                }}
                aria-current={activeTab === tab.id ? "page" : undefined}
                className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-black uppercase tracking-wide transition ${
                  activeTab === tab.id ? "bg-amber-300 text-zinc-950" : "bg-white/5 text-zinc-400 hover:text-white"
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {tab.label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
