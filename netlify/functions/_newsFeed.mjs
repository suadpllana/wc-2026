// Shared news-feed core used by both the Netlify production function (news.mjs)
// and the Vite dev-server middleware (vite.config.js). Fetches a Google News RSS
// feed server-side (no browser CORS limits) and returns clean item objects.
// Files prefixed with "_" are treated by Netlify as helpers, not as endpoints.

export const DEFAULT_QUERY = "FIFA World Cup 2026";

function decodeEntities(value = "") {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .trim();
}

function pick(block, tag) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return match ? decodeEntities(match[1]) : "";
}

function parseRssItems(xml, limit) {
  const blocks = xml.match(/<item\b[\s\S]*?<\/item>/gi) || [];
  return blocks.slice(0, limit).map((block) => {
    const source = pick(block, "source");
    let title = pick(block, "title");
    if (source && title.endsWith(` - ${source}`)) {
      title = title.slice(0, -(source.length + 3)).trim();
    }
    return {
      title: title || "Untitled story",
      link: pick(block, "link") || "#",
      source: source || "World Cup News",
      pubDate: pick(block, "pubDate"),
    };
  });
}

function buildFeedUrl(query) {
  const q = encodeURIComponent(query || DEFAULT_QUERY);
  return `https://news.google.com/rss/search?q=${q}&hl=en-US&gl=US&ceid=US:en`;
}

export async function fetchNewsItems(query, limit = 24) {
  const safeLimit = Math.min(Math.max(Number(limit) || 24, 1), 30);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(buildFeedUrl(query), {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; WC2026Bot/1.0)" },
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`Upstream ${response.status}`);
    }
    return parseRssItems(await response.text(), safeLimit);
  } finally {
    clearTimeout(timer);
  }
}
