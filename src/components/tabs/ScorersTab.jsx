import { Award, Star } from "lucide-react";
import AdUnit from "../AdUnit";
import TeamFlag from "../TeamFlag";
import { ADSENSE_SLOTS } from "../../constants/worldCupData";

export default function ScorersTab({ scorers }) {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/10 bg-zinc-900 p-5">
        <p className="mb-2 inline-flex items-center gap-2 rounded-md bg-amber-300/10 px-2 py-1 text-xs font-black uppercase tracking-[0.18em] text-amber-200">
          <Award className="h-3.5 w-3.5" aria-hidden="true" />
          Golden Boot
        </p>
        <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">World Cup 2026 top scorers</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">The scorer table will update once matches begin. Until then, track the stars most likely to shape the tournament.</p>
      </section>

      <AdUnit slot={ADSENSE_SLOTS.TAB_TOP_BANNER} />

      <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-900">
        {scorers.map((player, index) => (
          <div key={player.name} className={`flex items-center gap-3 border-b border-white/10 px-5 py-4 last:border-0 ${index === 0 ? "bg-amber-300/[0.04]" : ""}`}>
            <div className="w-8 shrink-0 text-center">
              <span className={`text-sm font-black ${index < 3 ? "text-amber-300" : "text-zinc-500"}`}>{index + 1}</span>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-zinc-950">
              <span className="text-xs font-black text-zinc-300">{player.img}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black text-white">{player.name}</p>
              <div className="mt-1 flex items-center gap-2">
                <TeamFlag team={player.team} size="sm" />
                <p className="text-xs text-zinc-400">{player.team}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-black text-amber-300 tabular-nums">{player.goals}</p>
                <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">Goals</p>
              </div>
              <div className="hidden text-center sm:block">
                <p className="text-2xl font-black text-zinc-300 tabular-nums">{player.assists}</p>
                <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">Assists</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          { award: "Golden Boot", desc: "Top scorer of the tournament", tone: "text-amber-300" },
          { award: "Golden Ball", desc: "Best player of the tournament", tone: "text-sky-300" },
          { award: "Golden Glove", desc: "Best goalkeeper", tone: "text-emerald-300" },
        ].map((award) => (
          <div key={award.award} className="rounded-lg border border-white/10 bg-zinc-900 p-4">
            <p className={`mb-1 text-sm font-black ${award.tone}`}>{award.award}</p>
            <p className="text-xs text-zinc-400">{award.desc}</p>
            <p className="mt-2 text-xs italic text-zinc-600">Awarded July 19, 2026</p>
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-white/10 bg-zinc-900 p-5">
        <div className="mb-4 flex items-center gap-2">
          <Star className="h-5 w-5 text-amber-300" aria-hidden="true" />
          <h3 className="text-lg font-black tracking-tight">Players to watch</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { player: "Kylian Mbappe", team: "France", reason: "France remain one of the tournament favorites and Mbappe drives their highest-value chances." },
            { player: "Vinicius Jr.", team: "Brazil", reason: "Brazil's transition threat gives him a strong Golden Boot platform." },
            { player: "Lamine Yamal", team: "Spain", reason: "Spain's wide overloads make him a constant creator and scorer." },
            { player: "Harry Kane", team: "England", reason: "England's route should give Kane volume from open play and penalties." },
          ].map((player) => (
            <article key={player.player} className="rounded-lg border border-white/10 bg-zinc-950/60 p-4">
              <p className="text-sm font-black text-white">{player.player}</p>
              <div className="mt-1 flex items-center gap-2">
                <TeamFlag team={player.team} size="sm" />
                <p className="text-xs font-bold text-amber-300">{player.team}</p>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">{player.reason}</p>
            </article>
          ))}
        </div>
      </section>

      <AdUnit slot={ADSENSE_SLOTS.TAB_BOTTOM_RECTANGLE} format="rectangle" />
    </div>
  );
}
