export default function Footer() {
  return (
    <footer className="border-t border-slate-800 mt-12 py-10 bg-slate-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid sm:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: "linear-gradient(135deg, #facc15, #f59e0b)" }}>
                <span className="text-slate-900 font-black text-xs">W</span>
              </div>
              <span className="font-black text-white">WC2026.live</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">Your #1 source for 2026 FIFA World Cup live scores, standings, and news. Updated in real-time.</p>
          </div>
          {[
            { title: "Tournament", links: ["Live Scores", "Group Standings", "Match Schedule", "Top Scorers", "Team Profiles"] },
            { title: "Information", links: ["Venues & Cities", "Host Countries", "History & Records", "About WC2026", "FAQ"] },
            { title: "Follow", links: ["Latest News", "Match Previews", "Expert Analysis", "Bracket Predictor", "Fantasy Football"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-black text-xs uppercase tracking-widest text-yellow-400 mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-slate-400 hover:text-white text-xs transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-600 text-xs">© 2026 WC2026.live - Not affiliated with FIFA. Fan site for informational purposes.</p>
          <div className="flex gap-4">
            {["Privacy Policy", "Terms of Use", "Contact", "Sitemap"].map((link) => (
              <a key={link} href="#" className="text-slate-600 hover:text-slate-400 text-xs transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
