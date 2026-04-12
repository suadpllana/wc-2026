import AdUnit from "../AdUnit";
import { ADSENSE_SLOTS } from "../../constants/worldCupData";

export default function ScheduleTab({ schedule }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black uppercase tracking-tight">Full Match Schedule</h2>
        <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">All times Eastern</span>
      </div>

      <AdUnit slot={ADSENSE_SLOTS.TAB_TOP_BANNER} />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { phase: "Group Stage", dates: "Jun 11 - Jul 2", matches: 72 },
          { phase: "Round of 32", dates: "Jul 4 - Jul 7", matches: 16 },
          { phase: "Round of 16", dates: "Jul 9 - Jul 11", matches: 8 },
          { phase: "QF / SF / Final", dates: "Jul 13 - Jul 19", matches: 8 },
        ].map((phase) => (
          <div key={phase.phase} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <p className="font-black text-white text-xs">{phase.phase}</p>
            <p className="text-yellow-400 text-xs mt-1">{phase.dates}</p>
            <p className="text-slate-500 text-xs mt-1">{phase.matches} matches</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
        <div className="bg-slate-700/50 px-5 py-3 border-b border-slate-700">
          <h3 className="font-black text-sm uppercase tracking-widest text-yellow-400">Group Stage - Opening Fixtures</h3>
        </div>

        {schedule.map((match, index) => (
          <div key={index} className="border-b border-slate-700/40 last:border-0 hover:bg-slate-700/20 transition-all">
            <div className="flex items-center px-5 py-4 gap-4">
              <div className="w-24 shrink-0">
                <p className="text-yellow-400 font-black text-xs">{match.date}</p>
                <p className="text-slate-500 text-xs">{match.time} ET</p>
              </div>
              <div className="flex-1 flex items-center justify-center gap-4">
                <div className="flex items-center gap-2 justify-end flex-1">
                  <span className="font-bold text-sm text-right hidden sm:inline">{match.home.name}</span>
                  <span className="text-2xl">{match.home.flag}</span>
                </div>
                <div className="bg-slate-700 rounded-lg w-14 h-8 flex items-center justify-center shrink-0">
                  <span className="text-slate-300 text-xs font-black">vs</span>
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-2xl">{match.away.flag}</span>
                  <span className="font-bold text-sm hidden sm:inline">{match.away.name}</span>
                </div>
              </div>
              <div className="w-36 shrink-0 text-right hidden md:block">
                <p className="text-white text-xs font-medium">{match.venue}</p>
                <p className="text-slate-500 text-xs">{match.city}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AdUnit slot={ADSENSE_SLOTS.TAB_BOTTOM_RECTANGLE} format="rectangle" />
    </div>
  );
}
