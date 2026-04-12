const WORLD_CUP_DATA_ENDPOINT = "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";
const WORLD_CUP_TEAMS_META_ENDPOINT = "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.teams_meta.json";
const GOOGLE_NEWS_QUERY = "https://news.google.com/rss/search?q=FIFA+World+Cup+2026&hl=en-US&gl=US&ceid=US:en";
const CORS_PROXY_PREFIX = "https://api.allorigins.win/raw?url=";

const FALLBACK_TEAM_FLAGS = {
  "United States": "🇺🇸",
  USA: "🇺🇸",
  "South Korea": "🇰🇷",
  "Korea Republic": "🇰🇷",
  "Czech Republic": "🇨🇿",
  Czechia: "🇨🇿",
};

const DEFAULT_FLAG = { emoji: "🏳️", flagUrl: "" };

function decodeFlagUnicode(value = "") {
  return value.replace(/\\u\{([0-9a-fA-F]+)\}/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)));
}

function normalizeTeamName(value = "") {
  return value.trim().toLowerCase();
}

function emojiToCountryCode(flagEmoji = "") {
  const points = [...flagEmoji].map((char) => char.codePointAt(0));
  const regionalPoints = points.filter((point) => point >= 0x1f1e6 && point <= 0x1f1ff);
  if (regionalPoints.length < 2) return "";

  return regionalPoints
    .slice(0, 2)
    .map((point) => String.fromCharCode(65 + (point - 0x1f1e6)))
    .join("")
    .toLowerCase();
}

function buildFlagAsset(emoji) {
  const countryCode = emojiToCountryCode(emoji);
  return {
    emoji,
    flagUrl: countryCode ? `https://flagcdn.com/w40/${countryCode}.png` : "",
  };
}

function buildTeamFlagLookup(teamsMeta = []) {
  const map = new Map();

  teamsMeta.forEach((team) => {
    const decodedFlag = decodeFlagUnicode(team.flag_unicode || "").trim();
    const flag = decodedFlag || FALLBACK_TEAM_FLAGS[team.name] || "🏳️";
    const flagAsset = buildFlagAsset(flag);

    [team.name, team.name_normalised, team.fifa_code]
      .filter(Boolean)
      .forEach((name) => {
        map.set(normalizeTeamName(name), flagAsset);
      });
  });

  Object.entries(FALLBACK_TEAM_FLAGS).forEach(([name, emoji]) => {
    map.set(normalizeTeamName(name), buildFlagAsset(emoji));
  });

  return map;
}

function getTeamFlag(teamName, teamFlags) {
  return teamFlags.get(normalizeTeamName(teamName)) || DEFAULT_FLAG;
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
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function splitGround(ground = "") {
  const parts = ground.split(",").map((part) => part.trim()).filter(Boolean);
  if (parts.length === 0) return { venue: "TBD", city: "TBD" };
  if (parts.length === 1) return { venue: parts[0], city: "TBD" };
  return { venue: parts[0], city: parts.slice(1).join(", ") };
}

function sortTeams(a, b) {
  if (b.pts !== a.pts) return b.pts - a.pts;
  if (b.gd !== a.gd) return b.gd - a.gd;
  if (b.gf !== a.gf) return b.gf - a.gf;
  return a.name.localeCompare(b.name);
}

function buildGroups(matches, teamFlags) {
  const groupMaps = new Map();

  matches.forEach((match) => {
    const groupName = match.group;
    if (!groupName || !groupName.startsWith("Group ")) return;

    const letter = groupName.replace("Group ", "").trim();
    if (!groupMaps.has(letter)) {
      groupMaps.set(letter, new Map());
    }

    const teams = groupMaps.get(letter);
    const finalScore = getFullTimeScore(match);

    const ensureTeam = (name) => {
      if (!teams.has(name)) {
        const teamFlag = getTeamFlag(name, teamFlags);
        teams.set(name, {
          name,
          flag: teamFlag.emoji,
          flagUrl: teamFlag.flagUrl,
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

    if (!finalScore) {
      return;
    }

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

function buildFixtures(matches, teamFlags) {
  const parseKickoffTimestamp = (match) => {
    if (!match?.date) return Number.POSITIVE_INFINITY;

    const timeMatch = String(match.time || "").match(/(\d{1,2}):(\d{2})/);
    const hour = timeMatch ? Number(timeMatch[1]) : 0;
    const minute = timeMatch ? Number(timeMatch[2]) : 0;
    const parsed = Date.parse(`${match.date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00Z`);
    return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed;
  };

  const getStageOrder = (match) => {
    if (match?.group && String(match.group).startsWith("Group ")) return 0;
    return 1;
  };

  return matches
    .map((match) => {
      const [homeScore, awayScore] = getFullTimeScore(match) ?? [null, null];
      const { venue, city } = splitGround(match.ground);
      const homeFlag = getTeamFlag(match.team1, teamFlags);
      const awayFlag = getTeamFlag(match.team2, teamFlags);

      return {
        id: `${match.date || "unknown"}-${(match.team1 || "home").replace(/\s+/g, "-")}-vs-${(match.team2 || "away").replace(/\s+/g, "-")}-${(match.round || "round").replace(/\s+/g, "-")}`.toLowerCase(),
        date: formatDateLabel(match.date),
        time: match.time ?? "--:--",
        sortKey: parseKickoffTimestamp(match),
        stageOrder: getStageOrder(match),
        round: match.round ?? "Match",
        group: match.group ?? "Knockout",
        status: homeScore === null ? "Scheduled" : "FT",
        score: homeScore === null ? "vs" : `${homeScore} - ${awayScore}`,
        venue,
        city,
        home: { name: match.team1, flag: homeFlag.emoji, flagUrl: homeFlag.flagUrl },
        away: { name: match.team2, flag: awayFlag.emoji, flagUrl: awayFlag.flagUrl },
      };
    })
    .sort((a, b) => {
      if (a.stageOrder !== b.stageOrder) return a.stageOrder - b.stageOrder;
      if (a.sortKey !== b.sortKey) return a.sortKey - b.sortKey;
      return `${a.round} ${a.home.name} ${a.away.name}`.localeCompare(`${b.round} ${b.home.name} ${b.away.name}`);
    })
    .map((fixture) => {
      const cleaned = { ...fixture };
      delete cleaned.sortKey;
      delete cleaned.stageOrder;
      return cleaned;
    });
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  return response.json();
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  return response.text();
}

export async function fetchWorldCupTournamentData() {
  const [data, teamsMeta] = await Promise.all([
    fetchJson(WORLD_CUP_DATA_ENDPOINT),
    fetchJson(WORLD_CUP_TEAMS_META_ENDPOINT),
  ]);

  const matches = Array.isArray(data?.matches) ? data.matches : [];
  const teamFlags = buildTeamFlagLookup(Array.isArray(teamsMeta) ? teamsMeta : []);

  return {
    groups: buildGroups(matches, teamFlags),
    fixtures: buildFixtures(matches, teamFlags),
  };
}

function computeRelativeTime(isoDateString) {
  const date = new Date(isoDateString);
  if (Number.isNaN(date.getTime())) return "Recently";

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

function getNewsTag(title) {
  const t = title.toLowerCase();
  if (t.includes("preview") || t.includes("lineup")) return "PREVIEW";
  if (t.includes("transfer") || t.includes("sign")) return "TRANSFER";
  if (t.includes("injury")) return "INJURY";
  if (t.includes("analysis") || t.includes("tactical")) return "ANALYSIS";
  if (t.includes("schedule") || t.includes("fixture")) return "SCHEDULE";
  return "NEWS";
}

function getNewsEmoji(tag) {
  if (tag === "PREVIEW") return "⚡";
  if (tag === "TRANSFER") return "🔁";
  if (tag === "INJURY") return "🚑";
  if (tag === "ANALYSIS") return "📊";
  if (tag === "SCHEDULE") return "📅";
  return "🗞️";
}

export async function fetchDailyNews() {
  const proxiedUrl = `${CORS_PROXY_PREFIX}${encodeURIComponent(GOOGLE_NEWS_QUERY)}`;
  const xmlText = await fetchText(proxiedUrl);

  const xml = new DOMParser().parseFromString(xmlText, "application/xml");
  const items = Array.from(xml.querySelectorAll("item"));

  return items.slice(0, 24).map((item) => {
    const title = item.querySelector("title")?.textContent?.trim() ?? "Untitled story";
    const link = item.querySelector("link")?.textContent?.trim() ?? "#";
    const source = item.querySelector("source")?.textContent?.trim() ?? "World Cup News";
    const pubDate = item.querySelector("pubDate")?.textContent?.trim() ?? "";
    const tag = getNewsTag(title);

    return {
      title,
      link,
      source,
      time: computeRelativeTime(pubDate),
      tag,
      emoji: getNewsEmoji(tag),
    };
  });
}

export async function fetchMatchNews(homeTeam, awayTeam) {
  const matchQuery = `https://news.google.com/rss/search?q=${encodeURIComponent(`${homeTeam} ${awayTeam} FIFA World Cup 2026`)}&hl=en-US&gl=US&ceid=US:en`;
  const proxiedUrl = `${CORS_PROXY_PREFIX}${encodeURIComponent(matchQuery)}`;
  const xmlText = await fetchText(proxiedUrl);

  const xml = new DOMParser().parseFromString(xmlText, "application/xml");
  const items = Array.from(xml.querySelectorAll("item"));

  return items.slice(0, 12).map((item) => {
    const title = item.querySelector("title")?.textContent?.trim() ?? "Untitled story";
    const link = item.querySelector("link")?.textContent?.trim() ?? "#";
    const source = item.querySelector("source")?.textContent?.trim() ?? "World Cup News";
    const pubDate = item.querySelector("pubDate")?.textContent?.trim() ?? "";
    const tag = getNewsTag(title);

    return {
      title,
      link,
      source,
      time: computeRelativeTime(pubDate),
      tag,
      emoji: getNewsEmoji(tag),
    };
  });
}

export async function fetchTeamNews(teamName) {
  const teamQuery = `https://news.google.com/rss/search?q=${encodeURIComponent(`${teamName} FIFA World Cup 2026 team news lineup injury`)}&hl=en-US&gl=US&ceid=US:en`;
  const proxiedUrl = `${CORS_PROXY_PREFIX}${encodeURIComponent(teamQuery)}`;
  const xmlText = await fetchText(proxiedUrl);

  const xml = new DOMParser().parseFromString(xmlText, "application/xml");
  const items = Array.from(xml.querySelectorAll("item"));

  return items.slice(0, 12).map((item) => {
    const title = item.querySelector("title")?.textContent?.trim() ?? "Untitled story";
    const link = item.querySelector("link")?.textContent?.trim() ?? "#";
    const source = item.querySelector("source")?.textContent?.trim() ?? "World Cup News";
    const pubDate = item.querySelector("pubDate")?.textContent?.trim() ?? "";
    const tag = getNewsTag(title);

    return {
      title,
      link,
      source,
      time: computeRelativeTime(pubDate),
      tag,
      emoji: getNewsEmoji(tag),
    };
  });
}
