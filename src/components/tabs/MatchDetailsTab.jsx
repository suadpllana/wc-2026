import { useState } from "react";
import AdUnit from "../AdUnit";
import { ADSENSE_SLOTS } from "../../constants/worldCupData";

const EXPECTED_LINEUPS = {
  Mexico: ["Ochoa", "Sanchez", "Montes", "Vasquez", "Gallardo", "Alvarez", "Chavez", "Pineda", "Lozano", "Martin", "Quinones"],
  "South Africa": ["Williams", "Mudau", "Mvala", "Kekana", "Modiba", "Mokoena", "Adams", "Tau", "Maseko", "Zwane", "Lepasa"],
  Brazil: ["Alisson", "Danilo", "Marquinhos", "Militao", "Arana", "Bruno Guimaraes", "Paqueta", "Rodrygo", "Neymar", "Vinicius Jr.", "Endrick"],
  England: ["Pickford", "Walker", "Stones", "Guehi", "Shaw", "Rice", "Bellingham", "Saka", "Foden", "Rashford", "Kane"],
  Argentina: ["Martinez", "Molina", "Romero", "Otamendi", "Tagliafico", "De Paul", "Enzo Fernandez", "Mac Allister", "Di Maria", "Alvarez", "Messi"],
};

function TeamFlag({ team }) {
  if (team.flagUrl) {
    return <img src={team.flagUrl} alt={team.name} className="w-7 h-7 rounded-full object-cover" loading="lazy" />;
  }
  return <span className="flag-emoji text-2xl">{team.flag ?? "🏳️"}</span>;
}

function LineupCard({ team, onOpenTeam }) {
  const players = EXPECTED_LINEUPS[team.name] ?? [];

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <TeamFlag team={team} />
        <button onClick={() => onOpenTeam?.(team)} className="font-black text-sm uppercase tracking-wide text-left hover:text-yellow-400 transition-colors">{team.name}</button>
      </div>
      {players.length > 0 ? (
        <div className="grid grid-cols-2 gap-1.5">
          {players.map((player) => (
            <p key={player} className="text-xs text-slate-300">• {player}</p>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400">Expected lineup not published yet.</p>
      )}
    </div>
  );
}

function buildPredictionKey(match) {
  if (!match) return "";
  const idPart = match.id || `${match.home.name}-${match.away.name}-${match.date}`;
  return `wc2026-prediction-${String(idPart).toLowerCase()}`;
}

function getInitialPredictionState(match) {
  const predictionKey = buildPredictionKey(match);
  if (!predictionKey) return { home: 0, draw: 0, away: 0, voted: "" };

  try {
    const saved = localStorage.getItem(predictionKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        home: Number(parsed.home) || 0,
        draw: Number(parsed.draw) || 0,
        away: Number(parsed.away) || 0,
        voted: parsed.voted || "",
      };
    }
  } catch {
    // Ignore localStorage read issues.
  }

  return {
    home: 34 + Math.floor(Math.random() * 12),
    draw: 20 + Math.floor(Math.random() * 10),
    away: 28 + Math.floor(Math.random() * 14),
    voted: "",
  };
}

export default function MatchDetailsTab({ match, onBack, relatedNews, matchNewsLoading, matchNewsError, recentHomeMatches, recentAwayMatches, onOpenTeam }) {
  const predictionKey = buildPredictionKey(match);
  const [predictionState, setPredictionState] = useState(() => getInitialPredictionState(match));

  const persistPrediction = (nextState) => {
    setPredictionState(nextState);
    if (!predictionKey) return;
    try {
      localStorage.setItem(predictionKey, JSON.stringify(nextState));
    } catch {
      // Ignore localStorage write issues.
    }
  };

  const submitPrediction = (side) => {
    if (!side) return;
    const previousVote = predictionState.voted;
    const updated = { ...predictionState };

    if (previousVote && updated[previousVote] > 0) {
      updated[previousVote] -= 1;
    }
    updated[side] += 1;
    updated.voted = side;
    persistPrediction(updated);
  };

  const totalVotes = Math.max(1, predictionState.home + predictionState.draw + predictionState.away);
  const homePct = Math.round((predictionState.home / totalVotes) * 100);
  const drawPct = Math.round((predictionState.draw / totalVotes) * 100);
  const awayPct = Math.round((predictionState.away / totalVotes) * 100);

  if (!match) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-400">No match selected.</p>
        <button onClick={onBack} className="px-4 py-2 rounded-lg bg-yellow-400 text-slate-900 font-bold text-xs uppercase tracking-wide">Back to Fixtures</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <button onClick={onBack} className="px-3 py-1.5 rounded-lg border border-slate-600 text-slate-200 text-xs font-bold uppercase tracking-wide hover:bg-slate-800">
          ← Back to Fixtures
        </button>
        <span className="text-xs text-slate-400">Match Details</span>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <div className="flex items-center justify-center gap-4 sm:gap-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <TeamFlag team={match.home} />
            <button onClick={() => onOpenTeam?.(match.home)} className="font-black text-base sm:text-lg hover:text-yellow-400 transition-colors">{match.home.name}</button>
          </div>
          <div className="px-3 py-2 rounded-lg bg-slate-700 text-center">
            <p className="font-black text-sm text-yellow-400">{match.score ?? "vs"}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wide">{match.status ?? "Scheduled"}</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <TeamFlag team={match.away} />
            <button onClick={() => onOpenTeam?.(match.away)} className="font-black text-base sm:text-lg hover:text-yellow-400 transition-colors">{match.away.name}</button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          {[
            { label: "Date", value: match.date },
            { label: "Time", value: match.time },
            { label: "Stage", value: match.group ?? match.round },
            { label: "Venue", value: `${match.venue}, ${match.city}` },
          ].map((item) => (
            <div key={item.label} className="bg-slate-700/40 border border-slate-700 rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-wider text-slate-500">{item.label}</p>
              <p className="text-xs text-slate-200 mt-1">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <AdUnit slot={ADSENSE_SLOTS.TAB_TOP_BANNER} />

      <section>
        <h3 className="font-black text-base uppercase tracking-tight mb-3">Expected Lineups</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <LineupCard team={match.home} onOpenTeam={onOpenTeam} />
          <LineupCard team={match.away} onOpenTeam={onOpenTeam} />
        </div>
      </section>

      <section className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
        <h3 className="font-black text-base uppercase tracking-tight mb-3">Fan Prediction</h3>
        <p className="text-xs text-slate-400 mb-3">Who do you think will win this match?</p>

        <div className="grid sm:grid-cols-3 gap-2 mb-4">
          {[
            { id: "home", label: match.home.name },
            { id: "draw", label: "Draw" },
            { id: "away", label: match.away.name },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => submitPrediction(option.id)}
              className={`px-3 py-2 rounded-lg border text-xs font-black uppercase tracking-wide transition-all ${predictionState.voted === option.id ? "bg-yellow-400 text-slate-900 border-yellow-400" : "bg-slate-700/50 text-slate-200 border-slate-600 hover:border-yellow-400/50"}`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {[
            { label: match.home.name, votes: predictionState.home, pct: homePct },
            { label: "Draw", votes: predictionState.draw, pct: drawPct },
            { label: match.away.name, votes: predictionState.away, pct: awayPct },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                <span>{item.label}</span>
                <span>{item.pct}% ({item.votes})</span>
              </div>
              <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                <div className="h-full bg-yellow-400" style={{ width: `${item.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-black text-base uppercase tracking-tight mb-3">Recent Form</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <p className="text-xs uppercase tracking-widest text-yellow-400 mb-2">{match.home.name} recent fixtures</p>
            {(recentHomeMatches.length > 0 ? recentHomeMatches : [match]).map((item) => (
              <p key={item.id} className="text-xs text-slate-300 mb-1">{item.date} • {item.home.name} {item.score} {item.away.name}</p>
            ))}
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <p className="text-xs uppercase tracking-widest text-yellow-400 mb-2">{match.away.name} recent fixtures</p>
            {(recentAwayMatches.length > 0 ? recentAwayMatches : [match]).map((item) => (
              <p key={item.id} className="text-xs text-slate-300 mb-1">{item.date} • {item.home.name} {item.score} {item.away.name}</p>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h3 className="font-black text-base uppercase tracking-tight mb-3">Match News</h3>
        {matchNewsError && <p className="text-xs text-amber-300 mb-3">{matchNewsError}</p>}
        <div className="grid sm:grid-cols-2 gap-3">
          {relatedNews.map((item, index) => (
            <article key={`${item.title}-${index}`} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">{item.emoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded">{item.tag}</span>
                    <span className="text-xs text-slate-500">{item.time}</span>
                  </div>
                  <h4 className="font-bold text-sm leading-snug text-white">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 mb-2">{item.source}</p>
                  <a href={item.link} target="_blank" rel="noreferrer" className="text-xs font-bold uppercase tracking-wide text-yellow-400 hover:text-yellow-300">Read story →</a>
                </div>
              </div>
            </article>
          ))}
        </div>
        {matchNewsLoading && <p className="text-xs text-slate-500 mt-3">Loading match news...</p>}
        {!matchNewsLoading && relatedNews.length === 0 && <p className="text-xs text-slate-500">No match-specific stories found yet.</p>}
      </section>

      <AdUnit slot={ADSENSE_SLOTS.TAB_BOTTOM_RECTANGLE} format="rectangle" />
    </div>
  );
}
