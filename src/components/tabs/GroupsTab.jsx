import AdUnit from "../AdUnit";
import { ADSENSE_SLOTS } from "../../constants/worldCupData";

export default function GroupsTab({ groupCollection, groupMap, activeGroup, setActiveGroup, groupsLoading, groupsError, onSelectTeam }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-black uppercase tracking-tight">Group Standings</h2>
        <span className="text-xs text-slate-400">Auto-refresh every 2 min</span>
      </div>
      {groupsError && <p className="text-xs text-amber-300">{groupsError}</p>}
      <AdUnit slot={ADSENSE_SLOTS.TAB_TOP_BANNER} />

      <div className="flex flex-wrap gap-2">
        {groupCollection.map((group) => (
          <button
            key={group.letter}
            onClick={() => setActiveGroup(group.letter)}
            className={`w-10 h-10 rounded-lg font-black text-sm transition-all ${activeGroup === group.letter ? "bg-yellow-400 text-slate-900" : "bg-slate-800 text-slate-400 hover:text-white border border-slate-700"}`}
          >
            {group.letter}
          </button>
        ))}
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
        <div className="bg-yellow-400 px-5 py-3">
          <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">{groupMap[activeGroup]?.title ?? `Group ${activeGroup}`}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-xs uppercase tracking-widest border-b border-slate-700">
                <th className="text-left px-5 py-3 font-bold">Team</th>
                <th className="text-center px-3 py-3 font-bold">P</th>
                <th className="text-center px-3 py-3 font-bold">W</th>
                <th className="text-center px-3 py-3 font-bold">D</th>
                <th className="text-center px-3 py-3 font-bold">L</th>
                <th className="text-center px-3 py-3 font-bold">GF</th>
                <th className="text-center px-3 py-3 font-bold">GA</th>
                <th className="text-center px-3 py-3 font-bold">GD</th>
                <th className="text-center px-5 py-3 font-bold text-yellow-400">PTS</th>
              </tr>
            </thead>
            <tbody>
              {(groupMap[activeGroup]?.teams ?? []).map((team, index) => (
                <tr key={team.name} className={`border-b border-slate-700/50 last:border-0 hover:bg-slate-700/30 transition-all ${index < 2 ? "border-l-2 border-l-yellow-400" : ""}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-xs w-4 font-bold">{index + 1}</span>
                      {team.flagUrl ? (
                        <img src={team.flagUrl} alt={team.name} className="w-5 h-5 rounded-full object-cover" loading="lazy" />
                      ) : (
                        <span className="flag-emoji text-lg">{team.flag ?? "🏳️"}</span>
                      )}
                      <button onClick={() => onSelectTeam?.(team)} className="font-bold text-white text-sm hover:text-yellow-400 transition-colors text-left">{team.name}</button>
                      {index < 2 && <span className="text-xs text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded font-bold hidden sm:inline">Q</span>}
                    </div>
                  </td>
                  {[team.played, team.w, team.d, team.l, team.gf, team.ga, team.gd ?? team.gf - team.ga].map((value, valueIndex) => (
                    <td key={valueIndex} className="text-center px-3 py-3.5 text-slate-300 tabular-nums">{value}</td>
                  ))}
                  <td className="text-center px-5 py-3.5 font-black text-yellow-400 text-base tabular-nums">{team.pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {groupsLoading && <p className="px-5 py-3 text-xs text-slate-500">Loading live group tables...</p>}
        <div className="px-5 py-3 border-t border-slate-700 flex items-center gap-3">
          <span className="w-3 h-3 border-l-2 border-yellow-400 inline-block" />
          <span className="text-xs text-slate-400">Advances to Round of 32</span>
        </div>
      </div>

      <h3 className="text-base font-black uppercase tracking-tight text-slate-300 mt-4">All Groups at a Glance</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {groupCollection.map((group) => (
          <div key={group.letter} onClick={() => setActiveGroup(group.letter)} className={`bg-slate-800 border rounded-xl p-4 cursor-pointer transition-all hover:border-yellow-400/50 ${activeGroup === group.letter ? "border-yellow-400" : "border-slate-700"}`}>
            <h4 className="font-black text-yellow-400 text-xs uppercase tracking-widest mb-3">{group.title}</h4>
            <div className="space-y-2">
              {group.teams.map((team, index) => (
                <div key={team.name} className="flex items-center gap-2">
                  <span className="text-slate-600 text-xs w-3">{index + 1}</span>
                  {team.flagUrl ? (
                    <img src={team.flagUrl} alt={team.name} className="w-4 h-4 rounded-full object-cover" loading="lazy" />
                  ) : (
                    <span className="flag-emoji text-base">{team.flag ?? "🏳️"}</span>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); onSelectTeam?.(team); }} className="text-xs text-slate-300 font-medium flex-1 text-left hover:text-yellow-400 transition-colors">{team.name}</button>
                  <span className="text-xs font-black text-yellow-400">{team.pts}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AdUnit slot={ADSENSE_SLOTS.TAB_BOTTOM_RECTANGLE} format="rectangle" />
    </div>
  );
}
