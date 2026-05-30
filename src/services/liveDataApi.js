import { buildTournamentData } from "../utils/tournamentData";

const WORLD_CUP_DATA_ENDPOINT = "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";
const GOOGLE_NEWS_QUERY = "https://news.google.com/rss/search?q=FIFA+World+Cup+2026&hl=en-US&gl=US&ceid=US:en";
const CORS_PROXY_PREFIX = "https://api.allorigins.win/raw?url=";

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
  const data = await fetchJson(WORLD_CUP_DATA_ENDPOINT);
  const matches = Array.isArray(data?.matches) ? data.matches : [];
  if (matches.length === 0) {
    throw new Error("World Cup fixture feed did not include matches.");
  }
  return buildTournamentData(matches);
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
  const text = title.toLowerCase();
  if (text.includes("preview") || text.includes("lineup")) return "PREVIEW";
  if (text.includes("injury")) return "INJURY";
  if (text.includes("analysis") || text.includes("tactical")) return "ANALYSIS";
  if (text.includes("schedule") || text.includes("fixture")) return "SCHEDULE";
  if (text.includes("group") || text.includes("draw")) return "GROUPS";
  return "NEWS";
}

function mapNewsItems(xmlText, limit) {
  const xml = new DOMParser().parseFromString(xmlText, "application/xml");
  const items = Array.from(xml.querySelectorAll("item"));

  return items.slice(0, limit).map((item) => {
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
    };
  });
}

export async function fetchDailyNews() {
  const proxiedUrl = `${CORS_PROXY_PREFIX}${encodeURIComponent(GOOGLE_NEWS_QUERY)}`;
  return mapNewsItems(await fetchText(proxiedUrl), 24);
}

export async function fetchMatchNews(homeTeam, awayTeam) {
  const matchQuery = `https://news.google.com/rss/search?q=${encodeURIComponent(`${homeTeam} ${awayTeam} FIFA World Cup 2026 preview odds news`)}&hl=en-US&gl=US&ceid=US:en`;
  const proxiedUrl = `${CORS_PROXY_PREFIX}${encodeURIComponent(matchQuery)}`;
  return mapNewsItems(await fetchText(proxiedUrl), 12);
}

export async function fetchTeamNews(teamName) {
  const teamQuery = `https://news.google.com/rss/search?q=${encodeURIComponent(`${teamName} FIFA World Cup 2026 team news lineup injury`)}&hl=en-US&gl=US&ceid=US:en`;
  const proxiedUrl = `${CORS_PROXY_PREFIX}${encodeURIComponent(teamQuery)}`;
  return mapNewsItems(await fetchText(proxiedUrl), 12);
}
