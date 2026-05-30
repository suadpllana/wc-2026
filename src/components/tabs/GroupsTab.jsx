import AdUnit from "../AdUnit";
import TeamFlag from "../TeamFlag";
import { ADSENSE_SLOTS } from "../../constants/worldCupData";

export default function GroupsTab({ groupCollection, groupMap, activeGroup, setActiveGroup, groupsLoading, groupsError, onSelectTeam }) {
  const activeTeams = groupMap[activeGroup]?.teams ?? [];

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/10 bg-zinc-900 p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-300">Group stage</p>
            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">World Cup 2026 groups and standings</h2>
            <p className="mt-2 text-sm text-zinc-400">Open any team for fixtures, team news, and tournament context.</p>
          </div>
          <span className="text-xs font-semibold text-zinc-500">Auto-refreshes from the fixture feed</span>
        </div>
      </section>

      {groupsError && <p className="rounded-lg border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-xs text-amber-100">{groupsError}</p>}
      <AdUnit slot={ADSENSE_SLOTS.TAB_TOP_BANNER} />

      <div className="flex flex-wrap gap-2">
        {groupCollection.map((group) => (
          <button
            key={group.letter}
            type="button"
            onClick={() => setActiveGroup(group.letter)}
            className={`h-10 w-10 rounded-lg text-sm font-black transition ${
              activeGroup === group.letter ? "bg-amber-300 text-zinc-950" : "border border-white/10 bg-zinc-900 text-zinc-400 hover:text-white"
            }`}
          >
            {group.letter}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-900">
        <div className="border-b border-white/10 bg-zinc-950 px-5 py-4">
          <h3 className="text-sm font-black uppercase tracking-[0.18em] text-amber-300">{groupMap[activeGroup]?.title ?? `Group ${activeGroup}`}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-[0.18em] text-zinc-500">
                <th className="px-5 py-3 text-left font-bold">Team</th>
                <th className="px-3 py-3 text-center font-bold">P</th>
                <th className="px-3 py-3 text-center font-bold">W</th>
                <th className="px-3 py-3 text-center font-bold">D</th>
                <th className="px-3 py-3 text-center font-bold">L</th>
                <th className="px-3 py-3 text-center font-bold">GF</th>
                <th className="px-3 py-3 text-center font-bold">GA</th>
                <th className="px-3 py-3 text-center font-bold">GD</th>
                <th className="px-5 py-3 text-center font-bold text-amber-300">PTS</th>
              </tr>
            </thead>
            <tbody>
              {activeTeams.map((team, index) => (
                <tr key={team.name} className={`border-b border-white/10 transition last:border-0 hover:bg-white/5 ${index < 2 ? "bg-emerald-300/[0.03]" : ""}`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="w-4 text-xs font-bold text-zinc-600">{index + 1}</span>
                      <TeamFlag team={team} />
                      <button type="button" onClick={() => onSelectTeam?.(team)} className="text-left text-sm font-black text-white transition hover:text-amber-300">
                        {team.name}
                      </button>
                      {index < 2 && <span className="hidden rounded-md bg-emerald-300/10 px-1.5 py-0.5 text-[10px] font-black text-emerald-200 sm:inline">Q</span>}
                    </div>
                  </td>
                  {[team.played, team.w, team.d, team.l, team.gf, team.ga, team.gd ?? team.gf - team.ga].map((value, valueIndex) => (
                    <td key={valueIndex} className="px-3 py-4 text-center text-zinc-300 tabular-nums">{value}</td>
                  ))}
                  <td className="px-5 py-4 text-center text-base font-black text-amber-300 tabular-nums">{team.pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {groupsLoading && <p className="px-5 py-3 text-xs text-zinc-500">Refreshing group tables...</p>}
        <div className="border-t border-white/10 px-5 py-3 text-xs text-zinc-500">Top two are highlighted as automatic qualification places.</div>
      </div>

      <h3 className="text-base font-black uppercase tracking-wide text-zinc-300">All groups</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {groupCollection.map((group) => (
          <button
            key={group.letter}
            type="button"
            onClick={() => setActiveGroup(group.letter)}
            className={`rounded-lg border p-4 text-left transition hover:border-amber-300/60 ${
              activeGroup === group.letter ? "border-amber-300 bg-amber-300/5" : "border-white/10 bg-zinc-900"
            }`}
          >
            <h4 className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-amber-300">{group.title}</h4>
            <div className="space-y-2">
              {group.teams.map((team, index) => (
                <div key={team.name} className="flex items-center gap-2">
                  <span className="w-3 text-xs text-zinc-600">{index + 1}</span>
                  <TeamFlag team={team} size="sm" />
                  <span className="min-w-0 flex-1 truncate text-xs font-bold text-zinc-300">{team.name}</span>
                  <span className="text-xs font-black text-amber-300">{team.pts}</span>
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>

      <AdUnit slot={ADSENSE_SLOTS.TAB_BOTTOM_RECTANGLE} format="rectangle" />
    </div>
  );
}
