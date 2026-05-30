import { COUNTRY_FLAGS, VENUE_BY_GROUND } from "../constants/worldCupData";
import { OFFICIAL_MATCHES } from "../constants/officialMatches";

export function normalizeName(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export function slugify(value = "") {
  return normalizeName(value)
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isPlaceholderTeam(teamName = "") {
  const value = String(teamName).trim();
  return /^(?:[123][A-L]|W\d+|L\d+|3[A-L](?:\/[A-L])+|TBD)$/i.test(value);
}

const COUNTRY_FLAG_LOOKUP = Object.fromEntries(
  Object.entries(COUNTRY_FLAGS).map(([teamName, code]) => [normalizeName(teamName), code]),
);

export function getFlagAsset(teamName = "") {
  const countryCode = COUNTRY_FLAG_LOOKUP[normalizeName(teamName)] || "";
  return {
    countryCode,
    flagUrl: countryCode ? `https://flagcdn.com/${countryCode}.svg` : "",
  };
}

function getTeam(teamName = "") {
  const flag = getFlagAsset(teamName);
  return {
    name: teamName,
    countryCode: flag.countryCode,
    flagUrl: flag.flagUrl,
    placeholder: isPlaceholderTeam(teamName),
  };
}

function getFullTimeScore(match) {
  const score = match?.score?.ft;
  if (!Array.isArray(score) || score.length < 2) {
    return null;
  }
  return [Number(score[0]) || 0, Number(score[1]) || 0];
}

function formatDateLabel(dateString) {
  const date = new Date(`${dateString}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return dateString || "TBD";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatTimeLabel(time = "") {
  const match = String(time).match(/^(\d{1,2}):(\d{2})(?:\s+(UTC[+-]\d{1,2}))?/i);
  if (!match) return time || "TBD";
  return `${match[1].padStart(2, "0")}:${match[2]}${match[3] ? ` ${match[3].toUpperCase()}` : ""}`;
}

function parseKickoffTimestamp(match) {
  if (!match?.date) return Number.POSITIVE_INFINITY;

  const timeMatch = String(match.time || "").match(/^(\d{1,2}):(\d{2})(?:\s+UTC([+-]\d{1,2}))?/i);
  const hour = timeMatch ? Number(timeMatch[1]) : 0;
  const minute = timeMatch ? Number(timeMatch[2]) : 0;
  const offsetNumber = timeMatch?.[3] ? Number(timeMatch[3]) : 0;
  const sign = offsetNumber < 0 ? "-" : "+";
  const offset = `${sign}${String(Math.abs(offsetNumber)).padStart(2, "0")}:00`;
  const parsed = Date.parse(`${match.date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00${offset}`);

  return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed;
}

function getStageOrder(match) {
  if (match?.group && String(match.group).startsWith("Group ")) return 0;
  const round = String(match?.round || "").toLowerCase();
  if (round.includes("round of 32")) return 1;
  if (round.includes("round of 16")) return 2;
  if (round.includes("quarter")) return 3;
  if (round.includes("semi")) return 4;
  if (round.includes("third")) return 5;
  if (round.includes("final")) return 6;
  return 7;
}

function splitGround(ground = "") {
  const cleanGround = ground || "TBD";
  return {
    venue: VENUE_BY_GROUND[cleanGround] || "Venue TBD",
    city: cleanGround,
  };
}

function sortTeams(a, b) {
  if (b.pts !== a.pts) return b.pts - a.pts;
  if (b.gd !== a.gd) return b.gd - a.gd;
  if (b.gf !== a.gf) return b.gf - a.gf;
  return a.name.localeCompare(b.name);
}

export function buildGroups(matches = []) {
  const groupMaps = new Map();

  matches.forEach((match) => {
    const groupName = match.group;
    if (!groupName || !String(groupName).startsWith("Group ")) return;

    const letter = String(groupName).replace("Group ", "").trim();
    if (!groupMaps.has(letter)) {
      groupMaps.set(letter, new Map());
    }

    const teams = groupMaps.get(letter);
    const finalScore = getFullTimeScore(match);

    const ensureTeam = (name) => {
      if (!teams.has(name)) {
        teams.set(name, {
          ...getTeam(name),
          played: 0,
          w: 0,
          d: 0,
          l: 0,
          gf: 0,
          ga: 0,
          gd: 0,
          pts: 0,
        });
      }
      return teams.get(name);
    };

    const home = ensureTeam(match.team1);
    const away = ensureTeam(match.team2);

    if (!finalScore) return;

    const [homeGoals, awayGoals] = finalScore;

    home.played += 1;
    away.played += 1;
    home.gf += homeGoals;
    home.ga += awayGoals;
    away.gf += awayGoals;
    away.ga += homeGoals;
    home.gd = home.gf - home.ga;
    away.gd = away.gf - away.ga;

    if (homeGoals > awayGoals) {
      home.w += 1;
      away.l += 1;
      home.pts += 3;
    } else if (awayGoals > homeGoals) {
      away.w += 1;
      home.l += 1;
      away.pts += 3;
    } else {
      home.d += 1;
      away.d += 1;
      home.pts += 1;
      away.pts += 1;
    }
  });

  return [...groupMaps.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letter, teamsMap]) => {
      const teams = [...teamsMap.values()].sort(sortTeams).map((team, index) => ({ ...team, rank: index + 1 }));
      return { letter, title: `Group ${letter}`, teams };
    });
}

export function buildFixtures(matches = []) {
  return matches
    .map((match, index) => {
      const [homeScore, awayScore] = getFullTimeScore(match) ?? [null, null];
      const { venue, city } = splitGround(match.ground);
      const idBase = match.num ? `match-${match.num}` : `${match.date}-${match.group || match.round}-${match.team1}-vs-${match.team2}`;

      return {
        id: slugify(idBase) || `match-${index + 1}`,
        matchNumber: match.num ?? index + 1,
        isoDate: match.date,
        date: formatDateLabel(match.date),
        time: formatTimeLabel(match.time),
        kickoffTimestamp: parseKickoffTimestamp(match),
        stageOrder: getStageOrder(match),
        round: match.round ?? "Match",
        group: match.group ?? "",
        status: homeScore === null ? "Scheduled" : "FT",
        score: homeScore === null ? "vs" : `${homeScore} - ${awayScore}`,
        venue,
        city,
        home: getTeam(match.team1),
        away: getTeam(match.team2),
      };
    })
    .sort((a, b) => {
      if (a.stageOrder !== b.stageOrder) return a.stageOrder - b.stageOrder;
      if (a.kickoffTimestamp !== b.kickoffTimestamp) return a.kickoffTimestamp - b.kickoffTimestamp;
      return a.matchNumber - b.matchNumber;
    })
    .map((fixture) => {
      const cleaned = { ...fixture };
      delete cleaned.kickoffTimestamp;
      delete cleaned.stageOrder;
      return cleaned;
    });
}

export function buildTournamentData(matches = []) {
  const cleanMatches = Array.isArray(matches) ? matches : [];
  return {
    groups: buildGroups(cleanMatches),
    fixtures: buildFixtures(cleanMatches),
  };
}

export const FALLBACK_TOURNAMENT_DATA = buildTournamentData(OFFICIAL_MATCHES);
