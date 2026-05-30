import { useState } from "react";
import { ArrowLeft, ExternalLink, Sparkles, Users } from "lucide-react";
import AdUnit from "../AdUnit";
import BettingSponsors from "../BettingSponsors";
import TeamFlag from "../TeamFlag";
import { ADSENSE_SLOTS } from "../../constants/worldCupData";
import { getMatchPrediction } from "../../utils/predictions";

function buildPredictionKey(match) {
  if (!match) return "";
  return `wc2026-fan-prediction-${String(match.id || `${match.home.name}-${match.away.name}-${match.date}`).toLowerCase()}`;
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

  const model = getMatchPrediction(match);
  return {
    home: Math.max(1, model?.probabilities.home ?? 34),
    draw: Math.max(1, model?.probabilities.draw ?? 28),
    away: Math.max(1, model?.probabilities.away ?? 34),
    voted: "",
  };
}

function OddsBox({ label, team, odds, probability }) {
  return (
    <div className="rounded-lg border border-white/10 bg-zinc-950/70 p-3">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-1 truncate text-xs font-bold text-zinc-300">{team}</p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <p className="text-2xl font-black text-amber-300 tabular-nums">{odds}</p>
        <p className="text-xs font-bold text-zinc-500">{probability}%</p>
      </div>
    </div>
  );
}

function TeamButton({ team, onOpenTeam, align = "left" }) {
  return (
    <button
      type="button"
      onClick={() => onOpenTeam?.(team)}
      className={`group min-w-0 ${align === "right" ? "text-right" : "text-left"}`}
    >
      <span className={`mb-3 flex ${align === "right" ? "justify-end" : "justify-start"}`}>
        <TeamFlag team={team} size="xl" />
      </span>
      <span className="block truncate text-2xl font-black text-white transition group-hover:text-amber-300 sm:text-4xl">{team.name}</span>
    </button>
  );
}

export default function MatchDetailsTab({ match, onBack, relatedNews, matchNewsLoading, matchNewsError, recentHomeMatches, recentAwayMatches, onOpenTeam }) {
  const predictionKey = buildPredictionKey(match);
  const [predictionState, setPredictionState] = useState(() => getInitialPredictionState(match));

  if (!match) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-zinc-400">No match selected.</p>
        <button type="button" onClick={onBack} className="rounded-lg bg-amber-300 px-4 py-2 text-xs font-black uppercase tracking-wide text-zinc-950">
          Back to fixtures
        </button>
      </div>
    );
  }

  const modelPrediction = getMatchPrediction(match);

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
  const fanOptions = [
    { id: "home", label: match.home.name, votes: predictionState.home, pct: Math.round((predictionState.home / totalVotes) * 100) },
    { id: "draw", label: "Draw", votes: predictionState.draw, pct: Math.round((predictionState.draw / totalVotes) * 100) },
    { id: "away", label: match.away.name, votes: predictionState.away, pct: Math.round((predictionState.away / totalVotes) * 100) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-black uppercase tracking-wide text-zinc-200 transition hover:border-amber-300/60"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </button>
        <span className="rounded-md bg-white/5 px-2 py-1 text-xs font-bold text-zinc-500">Match #{match.matchNumber}</span>
      </div>

      <section className="rounded-lg border border-white/10 bg-zinc-900 p-5">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
          <TeamButton team={match.home} onOpenTeam={onOpenTeam} />
          <div className="text-center">
            <div className="rounded-xl bg-amber-300 px-4 py-3 text-zinc-950">
              <p className="text-lg font-black">{match.score ?? "vs"}</p>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] opacity-70">{match.status ?? "Scheduled"}</p>
            </div>
          </div>
          <TeamButton team={match.away} onOpenTeam={onOpenTeam} align="right" />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          {[
            { label: "Date", value: match.date },
            { label: "Time", value: match.time },
            { label: "Stage", value: match.group || match.round },
            { label: "Venue", value: `${match.venue}, ${match.city}` },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-white/10 bg-zinc-950/70 p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">{item.label}</p>
              <p className="mt-1 text-sm font-bold text-zinc-200">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <AdUnit slot={ADSENSE_SLOTS.TAB_TOP_BANNER} />

      <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="rounded-lg border border-white/10 bg-zinc-900 p-5">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-300" aria-hidden="true" />
            <h3 className="text-lg font-black tracking-tight">Prediction and estimated 1X2 odds</h3>
          </div>

          <div className="mb-4 grid grid-cols-3 gap-2">
            <OddsBox label="1" team={match.home.name} odds={modelPrediction.odds.home} probability={modelPrediction.probabilities.home} />
            <OddsBox label="X" team="Draw" odds={modelPrediction.odds.draw} probability={modelPrediction.probabilities.draw} />
            <OddsBox label="2" team={match.away.name} odds={modelPrediction.odds.away} probability={modelPrediction.probabilities.away} />
          </div>

          <div className="rounded-lg border border-white/10 bg-zinc-950/70 p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="rounded-md bg-emerald-300/10 px-2 py-1 text-xs font-black text-emerald-200">{modelPrediction.primaryPick}</span>
              <span className="rounded-md bg-sky-300/10 px-2 py-1 text-xs font-black text-sky-200">{modelPrediction.bttsPick}</span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-400">{modelPrediction.explanation}</p>
          </div>
        </div>

        <BettingSponsors compact />
      </section>

      <section className="rounded-lg border border-white/10 bg-zinc-900 p-5">
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-emerald-300" aria-hidden="true" />
          <h3 className="text-lg font-black tracking-tight">Fan prediction</h3>
        </div>

        <div className="mb-4 grid gap-2 sm:grid-cols-3">
          {fanOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => submitPrediction(option.id)}
              className={`rounded-lg border px-3 py-3 text-xs font-black uppercase tracking-wide transition ${
                predictionState.voted === option.id ? "border-amber-300 bg-amber-300 text-zinc-950" : "border-white/10 bg-zinc-950 text-zinc-200 hover:border-amber-300/60"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {fanOptions.map((item) => (
            <div key={item.label}>
              <div className="mb-1 flex items-center justify-between text-xs text-zinc-300">
                <span>{item.label}</span>
                <span>{item.pct}% ({item.votes})</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                <div className="h-full bg-amber-300" style={{ width: `${item.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-black tracking-tight">Team fixture context</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            [match.home.name, recentHomeMatches],
            [match.away.name, recentAwayMatches],
          ].map(([teamName, matches]) => (
            <div key={teamName} className="rounded-lg border border-white/10 bg-zinc-900 p-4">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-amber-300">{teamName}</p>
              {(matches.length > 0 ? matches : [match]).slice(0, 5).map((item) => (
                <p key={item.id} className="mb-1 text-xs text-zinc-400">
                  {item.date}: {item.home.name} {item.score} {item.away.name}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-black tracking-tight">Match news</h3>
        {matchNewsError && <p className="mb-3 rounded-lg border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-xs text-amber-100">{matchNewsError}</p>}
        <div className="grid gap-3 sm:grid-cols-2">
          {relatedNews.map((item, index) => (
            <article key={`${item.title}-${index}`} className="rounded-lg border border-white/10 bg-zinc-900 p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-md bg-amber-300/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-amber-200">{item.tag}</span>
                <span className="text-xs text-zinc-500">{item.time}</span>
              </div>
              <h4 className="text-sm font-bold leading-snug text-white">{item.title}</h4>
              <p className="mb-3 mt-2 text-xs text-zinc-500">{item.source}</p>
              <a href={item.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wide text-amber-300 hover:text-white">
                Read story
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
        {matchNewsLoading && <p className="mt-3 text-xs text-zinc-500">Loading match news...</p>}
        {!matchNewsLoading && relatedNews.length === 0 && <p className="text-xs text-zinc-500">No match-specific stories found yet.</p>}
      </section>

      <AdUnit slot={ADSENSE_SLOTS.TAB_BOTTOM_RECTANGLE} format="rectangle" />
    </div>
  );
}
