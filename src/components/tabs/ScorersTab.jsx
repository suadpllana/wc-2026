import AdUnit from "../AdUnit";
import { ADSENSE_SLOTS } from "../../constants/worldCupData";

export default function ScorersTab({ scorers }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black uppercase tracking-tight">Top Scorers</h2>
      <AdUnit slot={ADSENSE_SLOTS.TAB_TOP_BANNER} />

      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
        <div className="bg-yellow-400 px-5 py-3">
          <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Golden Boot Race - 2026</h3>
        </div>
        {scorers.map((player, index) => (
          <div key={player.name} className={`flex items-center px-5 py-4 border-b border-slate-700/50 last:border-0 hover:bg-slate-700/20 transition-all ${index === 0 ? "bg-yellow-400/5" : ""}`}>
            <div className="w-8 shrink-0">
              {index === 0 ? <span className="text-yellow-400 text-lg">🥇</span> : index === 1 ? <span className="text-slate-400 text-lg">🥈</span> : index === 2 ? <span className="text-amber-600 text-lg">🥉</span> : <span className="text-slate-500 font-black text-sm">{index + 1}</span>}
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center mx-3 shrink-0">
              <span className="text-xs font-black text-slate-300">{player.img}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-white text-sm">{player.name}</p>
              <p className="text-slate-400 text-xs">{player.flag} {player.team}</p>
            </div>
            <div className="flex items-center gap-6 shrink-0">
              <div className="text-center">
                <p className="font-black text-2xl text-yellow-400 tabular-nums">{player.goals}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Goals</p>
              </div>
              <div className="text-center hidden sm:block">
                <p className="font-black text-2xl text-slate-300 tabular-nums">{player.assists}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Assists</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <h3 className="font-black text-base uppercase tracking-tight mb-4">🏅 Individual Awards to Watch</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { award: "Golden Boot", desc: "Top scorer of the tournament", color: "text-yellow-400" },
            { award: "Golden Ball", desc: "Best player of the tournament", color: "text-blue-400" },
            { award: "Golden Glove", desc: "Best goalkeeper", color: "text-green-400" },
          ].map((award) => (
            <div key={award.award} className="bg-slate-700/50 rounded-xl p-4 border border-slate-700">
              <p className={`font-black text-sm ${award.color} mb-1`}>{award.award}</p>
              <p className="text-slate-400 text-xs">{award.desc}</p>
              <p className="text-slate-500 text-xs mt-2 italic">Awarded July 19, 2026</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <h3 className="font-black text-base uppercase tracking-tight mb-4">⭐ Players to Watch</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { player: "Kylian Mbappe", team: "France 🇫🇷", reason: "Hungry for his first WC title after 2022 final heartbreak" },
            { player: "Vinicius Jr.", team: "Brazil 🇧🇷", reason: "Brazil's best chance at ending their 24-year World Cup drought" },
            { player: "Lamine Yamal", team: "Spain 🇪🇸", reason: "The 18-year-old superstar defending Spain's Euro 2024 glory" },
            { player: "Erling Haaland", team: "Norway 🇳🇴", reason: "Finally on the biggest stage - can he deliver?" },
            { player: "Lionel Messi", team: "Argentina 🇦🇷", reason: "Defending champion in what could be his final tournament" },
            { player: "Jude Bellingham", team: "England 🏴", reason: "Can he finally end England's 60-year hurt?" },
          ].map((player) => (
            <div key={player.player} className="flex gap-3 p-3 bg-slate-700/30 rounded-xl border border-slate-700/50">
              <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center shrink-0">
                <span className="text-xs font-black text-slate-300">{player.player.split(" ").map((n) => n[0]).join("")}</span>
              </div>
              <div>
                <p className="font-bold text-white text-xs">{player.player}</p>
                <p className="text-yellow-400 text-xs">{player.team}</p>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">{player.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AdUnit slot={ADSENSE_SLOTS.TAB_BOTTOM_RECTANGLE} format="rectangle" />
    </div>
  );
}
