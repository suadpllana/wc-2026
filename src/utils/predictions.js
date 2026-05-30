import { TEAM_RATINGS } from "../constants/worldCupData";
import { isPlaceholderTeam, normalizeName } from "./tournamentData";

const HOST_BOOSTS = {
  mexico: 4,
  usa: 4,
  canada: 4,
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function getRating(teamName = "") {
  const key = Object.keys(TEAM_RATINGS).find((team) => normalizeName(team) === normalizeName(teamName));
  return key ? TEAM_RATINGS[key] : 70;
}

function decimalOdds(probability) {
  if (!probability) return "-";
  const withMargin = 1 / probability * 1.06;
  return clamp(withMargin, 1.18, 17.5).toFixed(2);
}

function percent(value) {
  return Math.round(value * 100);
}

function getHostBoost(match, side) {
  const teamName = side === "home" ? match?.home?.name : match?.away?.name;
  return HOST_BOOSTS[normalizeName(teamName)] || 0;
}

function getWinnerLabel(match, side) {
  if (side === "draw") return "Draw";
  return `${side === "home" ? match.home.name : match.away.name} to win`;
}

function buildExplanation(match, side, bttsPick, confidence, diff) {
  if (match.home.placeholder || match.away.placeholder) {
    return "The teams are not set yet, so this market stays balanced until the bracket is known.";
  }

  const favorite = side === "away" ? match.away.name : match.home.name;
  const opponent = side === "away" ? match.home.name : match.away.name;
  const tone = confidence >= 62 ? "clearer edge" : confidence >= 54 ? "small edge" : "narrow edge";
  const matchupNote = Math.abs(diff) > 12 ? `${favorite} rate higher in the model` : `${favorite} have the slightly better profile`;

  return `${matchupNote}, but ${opponent} should keep the game competitive. ${bttsPick} is the lean because both attacking profiles and the rating gap point that way. Confidence: ${tone}.`;
}

export function getMatchPrediction(match) {
  if (!match) return null;

  const hasPlaceholder = isPlaceholderTeam(match.home?.name) || isPlaceholderTeam(match.away?.name);
  if (hasPlaceholder) {
    return {
      probabilities: { home: 36, draw: 28, away: 36 },
      odds: { home: "2.94", draw: "3.79", away: "2.94" },
      primaryPick: "Wait for confirmed teams",
      bttsPick: "Both teams to score: Lean No",
      bttsProbability: 48,
      confidence: 40,
      explanation: "The bracket slot is still unresolved, so this is a placeholder price until the matchup is confirmed.",
    };
  }

  const homeRating = getRating(match.home.name) + getHostBoost(match, "home");
  const awayRating = getRating(match.away.name) + getHostBoost(match, "away");
  const diff = homeRating - awayRating;
  const homeShare = 1 / (1 + Math.exp(-diff / 11));
  const drawProbability = clamp(0.28 - Math.abs(diff) * 0.0035, 0.16, 0.3);
  const remaining = 1 - drawProbability;
  const homeProbability = clamp(remaining * homeShare, 0.08, 0.82);
  const awayProbability = clamp(remaining - homeProbability, 0.08, 0.82);
  const total = homeProbability + drawProbability + awayProbability;

  const probabilities = {
    home: homeProbability / total,
    draw: drawProbability / total,
    away: awayProbability / total,
  };

  const strongestSide = Object.entries(probabilities).sort(([, a], [, b]) => b - a)[0][0];
  const confidence = percent(probabilities[strongestSide]);
  const balanceScore = 100 - Math.min(35, Math.abs(diff));
  const attackAverage = (getRating(match.home.name) + getRating(match.away.name)) / 2;
  const bttsProbability = Math.round(clamp(43 + (attackAverage - 72) * 0.75 + balanceScore * 0.08, 36, 68));
  const bttsPick = `Both teams to score: ${bttsProbability >= 52 ? "Yes" : "No"}`;

  return {
    probabilities: {
      home: percent(probabilities.home),
      draw: percent(probabilities.draw),
      away: percent(probabilities.away),
    },
    odds: {
      home: decimalOdds(probabilities.home),
      draw: decimalOdds(probabilities.draw),
      away: decimalOdds(probabilities.away),
    },
    primaryPick: getWinnerLabel(match, strongestSide),
    bttsPick,
    bttsProbability,
    confidence,
    explanation: buildExplanation(match, strongestSide, bttsPick, confidence, diff),
  };
}
