import { useMemo, useState } from "react";
import { Award, Check, Flag, Gamepad2, RotateCcw, Sparkles, X } from "lucide-react";
import AdUnit from "../AdUnit";
import { ADSENSE_SLOTS } from "../../constants/worldCupData";

const TRIVIA_QUESTIONS = [
  { q: "Which three countries co-host the 2026 World Cup?", options: ["USA, Canada & Mexico", "USA, Mexico & Brazil", "Canada, Mexico & Costa Rica", "USA, Canada & Jamaica"], answer: 0 },
  { q: "How many teams play at the 2026 World Cup?", options: ["32", "40", "48", "64"], answer: 2 },
  { q: "How many matches will be played in 2026?", options: ["64", "80", "104", "128"], answer: 2 },
  { q: "Who plays in the Group A opening match on June 11, 2026?", options: ["USA vs Wales", "Mexico vs South Africa", "Canada vs Belgium", "Mexico vs USA"], answer: 1 },
  { q: "Which country has won the most World Cups?", options: ["Germany", "Italy", "Argentina", "Brazil"], answer: 3 },
  { q: "Who won the 2022 World Cup in Qatar?", options: ["France", "Argentina", "Brazil", "Croatia"], answer: 1 },
  { q: "How many groups are there in the 2026 group stage?", options: ["8", "10", "12", "16"], answer: 2 },
  { q: "Who won the Golden Boot at the 2022 World Cup?", options: ["Lionel Messi", "Kylian Mbappé", "Julián Álvarez", "Olivier Giroud"], answer: 1 },
  { q: "In which month is the 2026 World Cup final scheduled?", options: ["June", "July", "August", "May"], answer: 1 },
  { q: "How many host cities will stage matches in 2026?", options: ["12", "14", "16", "20"], answer: 2 },
];

const FLAG_NATIONS = [
  { name: "Argentina", code: "ar" }, { name: "Brazil", code: "br" }, { name: "France", code: "fr" },
  { name: "Spain", code: "es" }, { name: "England", code: "gb-eng" }, { name: "Portugal", code: "pt" },
  { name: "Germany", code: "de" }, { name: "Netherlands", code: "nl" }, { name: "Belgium", code: "be" },
  { name: "Croatia", code: "hr" }, { name: "Uruguay", code: "uy" }, { name: "Mexico", code: "mx" },
  { name: "USA", code: "us" }, { name: "Canada", code: "ca" }, { name: "Japan", code: "jp" },
  { name: "Morocco", code: "ma" }, { name: "Senegal", code: "sn" }, { name: "Switzerland", code: "ch" },
  { name: "Colombia", code: "co" }, { name: "South Korea", code: "kr" }, { name: "Australia", code: "au" },
  { name: "Norway", code: "no" }, { name: "Ghana", code: "gh" }, { name: "Egypt", code: "eg" },
];

const FLAG_ROUNDS = 10;

function readBestScore(key) {
  try {
    return Number(localStorage.getItem(key)) || 0;
  } catch {
    return 0;
  }
}

function writeBestScore(key, value) {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // Ignore storage errors (private mode, etc.).
  }
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function ScoreBanner({ score, total, best, onRestart }) {
  return (
    <div className="rounded-lg border border-amber-300/30 bg-amber-300/10 p-5 text-center">
      <Award className="mx-auto h-8 w-8 text-amber-300" aria-hidden="true" />
      <p className="mt-3 text-2xl font-black text-white">{score} / {total}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-amber-200">Personal best: {best}</p>
      <button
        type="button"
        onClick={onRestart}
        className="mx-auto mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-300 px-4 py-2 text-xs font-black uppercase tracking-wide text-zinc-950 transition hover:bg-white"
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        Play again
      </button>
    </div>
  );
}

function TriviaGame() {
  const bestKey = "wc2026-trivia-best";
  const [questions, setQuestions] = useState(() => shuffle(TRIVIA_QUESTIONS));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [best, setBest] = useState(() => readBestScore(bestKey));

  const current = questions[index];

  const choose = (optionIndex) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === current.answer) setScore((value) => value + 1);
  };

  const next = () => {
    if (index + 1 >= questions.length) {
      const finalScore = score;
      if (finalScore > best) {
        setBest(finalScore);
        writeBestScore(bestKey, finalScore);
      }
      setFinished(true);
      return;
    }
    setIndex((value) => value + 1);
    setSelected(null);
  };

  const restart = () => {
    setQuestions(shuffle(TRIVIA_QUESTIONS));
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    return <ScoreBanner score={score} total={questions.length} best={best} onRestart={restart} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
        <span>Question {index + 1} / {questions.length}</span>
        <span className="text-amber-300">Score {score}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
        <div className="h-full bg-amber-300 transition-all" style={{ width: `${((index) / questions.length) * 100}%` }} />
      </div>

      <h3 className="text-lg font-black leading-snug text-white">{current.q}</h3>

      <div className="grid gap-2 sm:grid-cols-2">
        {current.options.map((option, optionIndex) => {
          const isAnswer = optionIndex === current.answer;
          const isPicked = optionIndex === selected;
          const revealed = selected !== null;
          const tone = revealed
            ? isAnswer
              ? "border-emerald-400 bg-emerald-400/15 text-emerald-100"
              : isPicked
                ? "border-rose-400 bg-rose-400/15 text-rose-100"
                : "border-white/10 bg-zinc-950 text-zinc-400"
            : "border-white/10 bg-zinc-950 text-zinc-200 hover:border-amber-300/60";
          return (
            <button
              key={option}
              type="button"
              onClick={() => choose(optionIndex)}
              disabled={revealed}
              className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-3 text-left text-sm font-bold transition ${tone}`}
            >
              {option}
              {revealed && isAnswer && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
              {revealed && isPicked && !isAnswer && <X className="h-4 w-4 shrink-0" aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <button
          type="button"
          onClick={next}
          className="inline-flex w-full items-center justify-center rounded-lg bg-white px-4 py-3 text-xs font-black uppercase tracking-wide text-zinc-950 transition hover:bg-amber-300 sm:w-auto"
        >
          {index + 1 >= questions.length ? "See result" : "Next question"}
        </button>
      )}
    </div>
  );
}

function buildFlagRound() {
  const correct = FLAG_NATIONS[Math.floor(Math.random() * FLAG_NATIONS.length)];
  const distractors = shuffle(FLAG_NATIONS.filter((nation) => nation.code !== correct.code)).slice(0, 3);
  return { correct, options: shuffle([correct, ...distractors]) };
}

function FlagGame() {
  const bestKey = "wc2026-flag-best";
  const [round, setRound] = useState(() => buildFlagRound());
  const [roundNumber, setRoundNumber] = useState(1);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [best, setBest] = useState(() => readBestScore(bestKey));

  const choose = (code) => {
    if (selected !== null) return;
    setSelected(code);
    if (code === round.correct.code) setScore((value) => value + 1);
  };

  const next = () => {
    if (roundNumber >= FLAG_ROUNDS) {
      // score already reflects this round's result (applied in choose()).
      if (score > best) {
        setBest(score);
        writeBestScore(bestKey, score);
      }
      setFinished(true);
      return;
    }
    setRound(buildFlagRound());
    setRoundNumber((value) => value + 1);
    setSelected(null);
  };

  const restart = () => {
    setRound(buildFlagRound());
    setRoundNumber(1);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    return <ScoreBanner score={score} total={FLAG_ROUNDS} best={best} onRestart={restart} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
        <span>Round {roundNumber} / {FLAG_ROUNDS}</span>
        <span className="text-amber-300">Score {score}</span>
      </div>

      <div className="flex justify-center rounded-lg border border-white/10 bg-zinc-950 p-6">
        <img
          src={`https://flagcdn.com/${round.correct.code}.svg`}
          alt="Guess this national flag"
          className="h-28 w-44 rounded-md object-cover ring-1 ring-white/10"
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {round.options.map((nation) => {
          const isAnswer = nation.code === round.correct.code;
          const isPicked = nation.code === selected;
          const revealed = selected !== null;
          const tone = revealed
            ? isAnswer
              ? "border-emerald-400 bg-emerald-400/15 text-emerald-100"
              : isPicked
                ? "border-rose-400 bg-rose-400/15 text-rose-100"
                : "border-white/10 bg-zinc-950 text-zinc-400"
            : "border-white/10 bg-zinc-950 text-zinc-200 hover:border-amber-300/60";
          return (
            <button
              key={nation.code}
              type="button"
              onClick={() => choose(nation.code)}
              disabled={revealed}
              className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-3 text-left text-sm font-bold transition ${tone}`}
            >
              {nation.name}
              {revealed && isAnswer && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
              {revealed && isPicked && !isAnswer && <X className="h-4 w-4 shrink-0" aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <button
          type="button"
          onClick={next}
          className="inline-flex w-full items-center justify-center rounded-lg bg-white px-4 py-3 text-xs font-black uppercase tracking-wide text-zinc-950 transition hover:bg-amber-300 sm:w-auto"
        >
          {roundNumber >= FLAG_ROUNDS ? "See result" : "Next flag"}
        </button>
      )}
    </div>
  );
}

export default function GamesTab() {
  const [activeGame, setActiveGame] = useState("trivia");
  const games = useMemo(
    () => [
      { id: "trivia", label: "Trivia Quiz", icon: Sparkles },
      { id: "flags", label: "Guess the Flag", icon: Flag },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/10 bg-zinc-900 p-5">
        <p className="mb-2 inline-flex items-center gap-2 rounded-md bg-emerald-300/10 px-2 py-1 text-xs font-black uppercase tracking-[0.18em] text-emerald-200">
          <Gamepad2 className="h-3.5 w-3.5" aria-hidden="true" />
          Fan games
        </p>
        <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">World Cup 2026 games</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
          Test your football knowledge with our free World Cup 2026 trivia quiz and guess-the-flag challenge. Your best score is saved on this device.
        </p>
      </section>

      <AdUnit slot={ADSENSE_SLOTS.TAB_TOP_BANNER} />

      <div className="flex gap-2">
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <button
              key={game.id}
              type="button"
              onClick={() => setActiveGame(game.id)}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-black uppercase tracking-wide transition ${
                activeGame === game.id ? "bg-amber-300 text-zinc-950" : "border border-white/10 bg-white/5 text-zinc-300 hover:text-white"
              }`}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {game.label}
            </button>
          );
        })}
      </div>

      <section className="rounded-lg border border-white/10 bg-zinc-900 p-5">
        {activeGame === "trivia" ? <TriviaGame /> : <FlagGame />}
      </section>

      <AdUnit slot={ADSENSE_SLOTS.TAB_BOTTOM_RECTANGLE} format="rectangle" />
    </div>
  );
}
