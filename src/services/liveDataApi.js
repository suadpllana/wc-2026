import { buildTournamentData } from "../utils/tournamentData";

const WORLD_CUP_DATA_ENDPOINT = "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";
const NEWS_FUNCTION_ENDPOINT = "/.netlify/functions/news";
// Public CORS proxy used only as a backup if the same-origin function is unavailable.
const CORS_PROXY_PREFIX = "https://api.allorigins.win/raw?url=";
const REQUEST_TIMEOUT_MS = 9000;

async function fetchWithTimeout(url, options = {}, timeout = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchJson(url) {
  const response = await fetchWithTimeout(url);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  return response.json();
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
  if (diffMs < 0) return "Just now";
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
  if (text.includes("odds") || text.includes("bet")) return "ODDS";
  return "NEWS";
}

// Normalizes a raw feed item ({ title, link, source, pubDate }) into the shape the UI uses.
function mapRawItem(raw) {
  const title = String(raw.title || "Untitled story").trim();
  return {
    title,
    link: raw.link || "#",
    source: raw.source || "World Cup News",
    time: computeRelativeTime(raw.pubDate),
    tag: getNewsTag(title),
  };
}

function parseXmlItems(xmlText, limit) {
  const xml = new DOMParser().parseFromString(xmlText, "application/xml");
  return Array.from(xml.querySelectorAll("item"))
    .slice(0, limit)
    .map((item) => ({
      title: item.querySelector("title")?.textContent?.trim() ?? "Untitled story",
      link: item.querySelector("link")?.textContent?.trim() ?? "#",
      source: item.querySelector("source")?.textContent?.trim() ?? "World Cup News",
      pubDate: item.querySelector("pubDate")?.textContent?.trim() ?? "",
    }));
}

function googleNewsSearchUrl(query) {
  return `https://news.google.com/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
}

// A single always-clickable card so a section never sits on an endless spinner if every feed is down.
function fallbackNewsCard(query, label) {
  return [
    {
      title: `Latest ${label} coverage on Google News`,
      link: googleNewsSearchUrl(query),
      source: "Google News",
      time: "Live search",
      tag: "NEWS",
    },
  ];
}

// Tries the same-origin function first (reliable, no CORS), then a public proxy as backup.
async function loadNews(query, limit) {
  try {
    const response = await fetchWithTimeout(`${NEWS_FUNCTION_ENDPOINT}?q=${encodeURIComponent(query)}&n=${limit}`);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data.items) && data.items.length > 0) {
        return data.items.slice(0, limit).map(mapRawItem);
      }
    }
  } catch {
    // Fall through to the public proxy backup below.
  }

  const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
  const response = await fetchWithTimeout(`${CORS_PROXY_PREFIX}${encodeURIComponent(feedUrl)}`);
  if (!response.ok) {
    throw new Error(`News proxy failed (${response.status})`);
  }
  const items = parseXmlItems(await response.text(), limit).map(mapRawItem);
  if (items.length === 0) {
    throw new Error("News feed returned no items.");
  }
  return items;
}

export async function fetchDailyNews() {
  return loadNews("FIFA World Cup 2026", 24);
}

export async function fetchMatchNews(homeTeam, awayTeam) {
  const query = `${homeTeam} ${awayTeam} FIFA World Cup 2026 preview odds news`;
  try {
    return await loadNews(query, 12);
  } catch {
    return fallbackNewsCard(query, `${homeTeam} vs ${awayTeam}`);
  }
}

export async function fetchTeamNews(teamName) {
  const query = `${teamName} FIFA World Cup 2026 team news lineup injury`;
  try {
    return await loadNews(query, 12);
  } catch {
    return fallbackNewsCard(query, teamName);
  }
}
