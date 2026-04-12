export default function HeaderNav({ tabs, activeTab }) {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #facc15, #f59e0b)" }}>
              <span className="text-slate-900 font-black text-xs">WC</span>
            </div>
            <div>
              <span className="font-black text-white text-sm tracking-tight">WORLD CUP</span>
              <span className="text-yellow-400 font-black text-sm ml-1">2026</span>
            </div>
            <span className="hidden sm:block text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">COUNTDOWN</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => (
              <a
                key={tab.id}
                href={`#/${tab.path}`}
                aria-current={activeTab === tab.id ? "page" : undefined}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${activeTab === tab.id ? "bg-yellow-400 text-slate-900" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
              >
                {tab.label}
              </a>
            ))}
          </nav>
          <span className="text-xs text-slate-500 hidden lg:block">🏆 USA · Canada · Mexico</span>
        </div>

        <div className="flex md:hidden gap-1 pb-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <a
              key={tab.id}
              href={`#/${tab.path}`}
              aria-current={activeTab === tab.id ? "page" : undefined}
              className={`shrink-0 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${activeTab === tab.id ? "bg-yellow-400 text-slate-900" : "text-slate-400 hover:text-white bg-slate-800"}`}
            >
              {tab.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
