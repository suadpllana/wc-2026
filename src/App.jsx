import { useEffect, useMemo, useState } from "react";
import Footer from "./components/Footer";
import HeaderNav from "./components/HeaderNav";
import AdUnit from "./components/AdUnit";
import AboutTab from "./components/tabs/AboutTab";
import GamesTab from "./components/tabs/GamesTab";
import GroupsTab from "./components/tabs/GroupsTab";
import HomeTab from "./components/tabs/HomeTab";
import MatchDetailsTab from "./components/tabs/MatchDetailsTab";
import NewsTab from "./components/tabs/NewsTab";
import PredictionsTab from "./components/tabs/PredictionsTab";
import ScoresTab from "./components/tabs/ScoresTab";
import ScorersTab from "./components/tabs/ScorersTab";
import TeamDetailsTab from "./components/tabs/TeamDetailsTab";
import { ADSENSE_CLIENT, ADSENSE_SLOTS, NEWS_FALLBACK, SCORERS, TABS } from "./constants/worldCupData";
import { fetchDailyNews, fetchMatchNews, fetchTeamNews, fetchWorldCupTournamentData } from "./services/liveDataApi";
import { FALLBACK_TOURNAMENT_DATA, slugify } from "./utils/tournamentData";

const TAB_PATH_TO_ID = Object.fromEntries(TABS.map((tab) => [tab.path, tab.id]));
TAB_PATH_TO_ID.home = "home";
const TAB_ID_TO_PATH = Object.fromEntries(TABS.map((tab) => [tab.id, tab.path]));

function normalizeTabId(tabId) {
  return tabId === "fixtures" ? "scores" : tabId;
}

function getMatchRouteKey(match) {
  if (!match) return "";
  if (match.id) return String(match.id);
  return slugify(`${match.date}-${match.home?.name ?? ""}-${match.away?.name ?? ""}`);
}

function cleanPath(path = "") {
  return String(path).replace(/^\/+|\/+$/g, "");
}

function buildAppPath(path = "", query = "") {
  const normalizedPath = cleanPath(path);
  return `/${normalizedPath}${query ? `?${query}` : ""}`;
}

function parseRouteFromLocation(pathname, search) {
  const pathPart = cleanPath(pathname);
  const segments = pathPart ? pathPart.split("/") : [];
  const [root = "", detail = ""] = segments;
  const query = new URLSearchParams(search || "");

  if (root === "match") {
    return {
      kind: "match",
      matchKey: decodeURIComponent(detail),
      backRoute: query.has("back") ? decodeURIComponent(query.get("back") || "") : "fixtures",
    };
  }

  if (root === "team") {
    return {
      kind: "team",
      teamName: decodeURIComponent(detail),
      backRoute: query.has("back") ? decodeURIComponent(query.get("back") || "") : "groups",
    };
  }

  const tabId = normalizeTabId(TAB_PATH_TO_ID[root] ?? root ?? "home");
  return { kind: "tab", tab: TAB_ID_TO_PATH[tabId] !== undefined ? tabId : "home" };
}

function parseLegacyHash(hashValue) {
  const normalizedHash = (hashValue || "").replace(/^#\/?/, "");
  const [pathPart = "", queryPart = ""] = normalizedHash.split("?");
  return { pathPart, queryPart };
}

function parseCurrentRoute() {
  if (window.location.hash?.startsWith("#/")) {
    const legacy = parseLegacyHash(window.location.hash);
    const nextPath = buildAppPath(legacy.pathPart, legacy.queryPart);
    window.history.replaceState(null, "", nextPath);
  }

  return parseRouteFromLocation(window.location.pathname, window.location.search);
}

function getActiveTabFromRoute(route) {
  if (route.kind === "tab") {
    return route.tab;
  }

  const backRoot = cleanPath(route.backRoute || "").split("/")[0];
  if (backRoot === "match" || backRoot === "fixtures") return "scores";
  if (backRoot === "predictions") return "predictions";
  if (backRoot === "team" || backRoot === "groups") return "groups";

  return normalizeTabId(TAB_PATH_TO_ID[backRoot] ?? backRoot) || "home";
}

function upsertMeta(selector, createAttrs, content) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    Object.entries(createAttrs).forEach(([key, value]) => element.setAttribute(key, value));
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function updateSeo({ title, description }) {
  document.title = title;
  upsertMeta('meta[name="description"]', { name: "description" }, description);
  upsertMeta('meta[property="og:title"]', { property: "og:title" }, title);
  upsertMeta('meta[property="og:description"]', { property: "og:description" }, description);
  upsertMeta('meta[name="twitter:title"]', { name: "twitter:title" }, title);
  upsertMeta('meta[name="twitter:description"]', { name: "twitter:description" }, description);

  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", `${window.location.origin}${window.location.pathname}`);
}

// Injects (or clears) page-specific JSON-LD so match and team pages can earn rich
// results in Google. A single managed <script> tag is reused across navigations.
function setRouteJsonLd(data) {
  const id = "wc2026-route-jsonld";
  let script = document.getElementById(id);
  if (!data) {
    if (script) script.remove();
    return;
  }
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

function buildMatchJsonLd(match) {
  const canonicalUrl = `${window.location.origin}${window.location.pathname}`;
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${match.home.name} vs ${match.away.name} — World Cup 2026`,
    sport: "Association football",
    startDate: match.isoDate || undefined,
    eventStatus: "https://schema.org/EventScheduled",
    homeTeam: { "@type": "SportsTeam", name: match.home.name },
    awayTeam: { "@type": "SportsTeam", name: match.away.name },
    location: { "@type": "Place", name: [match.venue, match.city].filter(Boolean).join(", ") || "TBD" },
    superEvent: { "@type": "SportsEvent", name: "FIFA World Cup 2026" },
    url: canonicalUrl,
  };
}

export default function WorldCup2026() {
  const [route, setRoute] = useState(() => parseCurrentRoute());
  const [activeGroup, setActiveGroup] = useState("A");
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [groupsData, setGroupsData] = useState(FALLBACK_TOURNAMENT_DATA.groups);
  const [groupsLoading, setGroupsLoading] = useState(true);
  const [groupsError, setGroupsError] = useState("");
  const [fixturesData, setFixturesData] = useState(FALLBACK_TOURNAMENT_DATA.fixtures);
  const [fixturesLoading, setFixturesLoading] = useState(true);
  const [fixturesError, setFixturesError] = useState("");
  const [matchNews, setMatchNews] = useState([]);
  const [matchNewsLoading, setMatchNewsLoading] = useState(false);
  const [matchNewsError, setMatchNewsError] = useState("");
  const [teamNews, setTeamNews] = useState([]);
  const [teamNewsLoading, setTeamNewsLoading] = useState(false);
  const [teamNewsError, setTeamNewsError] = useState("");
  const [newsItems, setNewsItems] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState("");

  const groupCollection = groupsData.length > 0 ? groupsData : FALLBACK_TOURNAMENT_DATA.groups;
  const groupMap = useMemo(() => Object.fromEntries(groupCollection.map((group) => [group.letter, group])), [groupCollection]);
  const fixturesCollection = fixturesData.length > 0 ? fixturesData : FALLBACK_TOURNAMENT_DATA.fixtures;
  const activeTab = getActiveTabFromRoute(route);

  const selectedMatch = useMemo(() => {
    if (route.kind !== "match" || !route.matchKey) return null;

    return fixturesCollection.find((fixture) => {
      const routeKey = getMatchRouteKey(fixture);
      return routeKey === route.matchKey || String(fixture.id ?? "") === route.matchKey;
    }) ?? null;
  }, [fixturesCollection, route]);

  const selectedTeam = useMemo(() => {
    if (route.kind !== "team" || !route.teamName) return null;

    for (const group of groupCollection) {
      const found = (group.teams || []).find((team) => team.name === route.teamName);
      if (found) return found;
    }

    if (selectedMatch?.home?.name === route.teamName) return selectedMatch.home;
    if (selectedMatch?.away?.name === route.teamName) return selectedMatch.away;

    return null;
  }, [groupCollection, route, selectedMatch]);

  useEffect(() => {
    const handleNavigation = () => setRoute(parseCurrentRoute());
    window.addEventListener("popstate", handleNavigation);
    window.addEventListener("hashchange", handleNavigation);
    return () => {
      window.removeEventListener("popstate", handleNavigation);
      window.removeEventListener("hashchange", handleNavigation);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  useEffect(() => {
    if (!ADSENSE_CLIENT) return;
    if (!document.querySelector(`script[src*="${ADSENSE_CLIENT}"]`)) {
      const script = document.createElement("script");
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const target = new Date("2026-06-11T13:00:00-06:00");
    const tick = () => {
      const now = new Date();
      const diff = target - now;
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };

    tick();
    const intervalId = setInterval(tick, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadTournamentData = async () => {
      try {
        const tournamentData = await fetchWorldCupTournamentData();
        if (cancelled) return;
        setGroupsData(tournamentData.groups ?? FALLBACK_TOURNAMENT_DATA.groups);
        setFixturesData(tournamentData.fixtures ?? FALLBACK_TOURNAMENT_DATA.fixtures);
        setGroupsError("");
        setFixturesError("");
      } catch {
        if (cancelled) return;
        setGroupsData(FALLBACK_TOURNAMENT_DATA.groups);
        setFixturesData(FALLBACK_TOURNAMENT_DATA.fixtures);
        setGroupsError("Live fixture sync is unavailable right now. Showing the local 2026 schedule fallback.");
        setFixturesError("Live fixture sync is unavailable right now. Showing the local 2026 schedule fallback.");
      } finally {
        if (!cancelled) {
          setGroupsLoading(false);
          setFixturesLoading(false);
        }
      }
    };

    loadTournamentData();
    const intervalId = setInterval(loadTournamentData, 3600000);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadNews = async () => {
      try {
        const items = await fetchDailyNews();
        if (cancelled) return;
        setNewsItems(items);
        setNewsError("");
      } catch {
        if (cancelled) return;
        setNewsError("Daily feed unavailable right now. Showing editorial fallback stories.");
      } finally {
        if (!cancelled) setNewsLoading(false);
      }
    };

    loadNews();
    const intervalId = setInterval(loadNews, 900000);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!groupMap[activeGroup] && groupCollection.length > 0) {
      setActiveGroup(groupCollection[0].letter);
    }
  }, [activeGroup, groupCollection, groupMap]);

  useEffect(() => {
    if (!selectedMatch) {
      setMatchNews([]);
      setMatchNewsError("");
      setMatchNewsLoading(false);
      return;
    }

    let cancelled = false;
    const loadMatchNews = async () => {
      setMatchNewsLoading(true);
      try {
        const items = await fetchMatchNews(selectedMatch.home.name, selectedMatch.away.name);
        if (cancelled) return;
        setMatchNews(items);
        setMatchNewsError("");
      } catch {
        if (cancelled) return;
        setMatchNews([]);
        setMatchNewsError("Could not load match-specific news right now.");
      } finally {
        if (!cancelled) setMatchNewsLoading(false);
      }
    };

    loadMatchNews();
    return () => {
      cancelled = true;
    };
  }, [selectedMatch]);

  useEffect(() => {
    if (!selectedTeam) {
      setTeamNews([]);
      setTeamNewsError("");
      setTeamNewsLoading(false);
      return;
    }

    let cancelled = false;
    const loadTeamNews = async () => {
      setTeamNewsLoading(true);
      try {
        const items = await fetchTeamNews(selectedTeam.name);
        if (cancelled) return;
        setTeamNews(items);
        setTeamNewsError("");
      } catch {
        if (cancelled) return;
        setTeamNews([]);
        setTeamNewsError("Could not load team-specific news right now.");
      } finally {
        if (!cancelled) setTeamNewsLoading(false);
      }
    };

    loadTeamNews();
    return () => {
      cancelled = true;
    };
  }, [selectedTeam]);

  useEffect(() => {
    if (route.kind === "match" && selectedMatch) {
      updateSeo({
        title: `${selectedMatch.home.name} vs ${selectedMatch.away.name} prediction, odds, fixture | World Cup 2026`,
        description: `World Cup 2026 ${selectedMatch.home.name} vs ${selectedMatch.away.name}: kickoff time, venue, news, 1X2 estimated odds, and match prediction.`,
      });
      setRouteJsonLd(buildMatchJsonLd(selectedMatch));
      return;
    }

    if (route.kind === "team" && selectedTeam) {
      updateSeo({
        title: `${selectedTeam.name} World Cup 2026 fixtures, group, news | WC2026.live`,
        description: `${selectedTeam.name} World Cup 2026 team page with group table, upcoming fixtures, recent form, and latest news.`,
      });
      setRouteJsonLd({
        "@context": "https://schema.org",
        "@type": "SportsTeam",
        name: selectedTeam.name,
        sport: "Association football",
        url: `${window.location.origin}${window.location.pathname}`,
      });
      return;
    }

    setRouteJsonLd(null);

    const titles = {
      home: ["World Cup 2026 fixtures, predictions, odds and news | WC2026.live", "Live World Cup 2026 dashboard with fixtures, groups, predictions, estimated 1X2 odds, host cities, and breaking news."],
      scores: ["World Cup 2026 fixtures and match schedule | WC2026.live", "Every World Cup 2026 fixture, date, kickoff time, group, city, venue, and match detail link."],
      predictions: ["World Cup 2026 predictions and 1X2 odds for every match", "Model-based World Cup 2026 match predictions, both-teams-to-score leans, explanations, and estimated 1X2 odds for all 104 games."],
      groups: ["World Cup 2026 groups and standings | WC2026.live", "World Cup 2026 group tables, teams, flags, points, goal difference, and team profile links."],
      news: ["World Cup 2026 news, previews and analysis | WC2026.live", "Latest World Cup 2026 news, fixture updates, team stories, previews, injury reports, and analysis."],
      games: ["World Cup 2026 games: trivia quiz and guess the flag | WC2026.live", "Play free World Cup 2026 games: test your football knowledge with our trivia quiz and guess-the-flag challenge, then chase your high score."],
      scorers: ["World Cup 2026 top scorers and players to watch", "Track the Golden Boot race and the star players expected to shape World Cup 2026."],
    };
    const [title, description] = titles[activeTab] || titles.home;
    updateSeo({ title, description });
  }, [activeTab, route, selectedMatch, selectedTeam]);

  const featuredNews = newsItems.length > 0 ? newsItems.slice(0, 24) : NEWS_FALLBACK;

  const navigateToPath = (path = "", query = "") => {
    window.history.pushState(null, "", buildAppPath(path, query));
    setRoute(parseCurrentRoute());
  };

  const navigateToTab = (tabId) => {
    navigateToPath(TAB_ID_TO_PATH[tabId] ?? "");
  };

  const openMatchDetails = (match, backRoute = TAB_ID_TO_PATH[activeTab] ?? "fixtures") => {
    if (!match) return;
    const matchRouteKey = getMatchRouteKey(match);
    navigateToPath(`match/${encodeURIComponent(matchRouteKey)}`, `back=${encodeURIComponent(backRoute || "")}`);
  };

  const openTeamDetails = (team, backRoute = "groups") => {
    if (!team?.name) return;
    navigateToPath(`team/${encodeURIComponent(team.name)}`, `back=${encodeURIComponent(backRoute)}`);
  };

  const getTeamGroupInfo = (teamName) => {
    for (const group of groupCollection) {
      const found = (group.teams || []).find((team) => team.name === teamName);
      if (found) {
        return { groupTitle: group.title, stats: found };
      }
    }
    return { groupTitle: "FIFA World Cup 2026", stats: {} };
  };

  const getRecentTeamMatches = (teamName) => {
    if (!selectedMatch) return [];
    return fixturesCollection
      .filter((fixture) => getMatchRouteKey(fixture) !== getMatchRouteKey(selectedMatch))
      .filter((fixture) => fixture.home.name === teamName || fixture.away.name === teamName)
      .slice(0, 5);
  };

  const getTeamRecentMatches = (teamName) => {
    return fixturesCollection
      .filter((fixture) => fixture.score && fixture.score !== "vs")
      .filter((fixture) => fixture.home.name === teamName || fixture.away.name === teamName)
      .slice(0, 6);
  };

  const getTeamUpcomingMatches = (teamName) => {
    return fixturesCollection
      .filter((fixture) => !fixture.score || fixture.score === "vs")
      .filter((fixture) => fixture.home.name === teamName || fixture.away.name === teamName)
      .slice(0, 6);
  };

  const renderActiveTab = () => {
    if (route.kind === "tab" && activeTab === "home") {
      return (
        <HomeTab
          countdown={countdown}
          onOpenFixtures={() => navigateToTab("scores")}
          onOpenGroups={() => navigateToTab("groups")}
          onOpenNews={() => navigateToTab("news")}
          onOpenPredictions={() => navigateToTab("predictions")}
          onSelectMatch={(match) => openMatchDetails(match, "home")}
          fixtures={fixturesCollection}
          featuredNews={featuredNews}
          newsError={newsError}
          newsLoading={newsLoading}
        />
      );
    }

    if (route.kind === "tab" && activeTab === "scores") {
      return (
        <ScoresTab
          fixtures={fixturesCollection}
          fixturesLoading={fixturesLoading}
          fixturesError={fixturesError}
          onSelectMatch={(match) => openMatchDetails(match, "fixtures")}
        />
      );
    }

    if (route.kind === "tab" && activeTab === "predictions") {
      return (
        <PredictionsTab
          fixtures={fixturesCollection}
          fixturesLoading={fixturesLoading}
          fixturesError={fixturesError}
          onSelectMatch={(match) => openMatchDetails(match, "predictions")}
        />
      );
    }

    if (route.kind === "match") {
      return (
        <MatchDetailsTab
          key={getMatchRouteKey(selectedMatch) || route.matchKey || "match-details"}
          match={selectedMatch}
          onBack={() => navigateToPath(route.backRoute ?? "fixtures")}
          onOpenTeam={(team) => openTeamDetails(team, `match/${getMatchRouteKey(selectedMatch)}`)}
          relatedNews={matchNews}
          matchNewsLoading={matchNewsLoading}
          matchNewsError={matchNewsError}
          recentHomeMatches={selectedMatch ? getRecentTeamMatches(selectedMatch.home.name) : []}
          recentAwayMatches={selectedMatch ? getRecentTeamMatches(selectedMatch.away.name) : []}
        />
      );
    }

    if (route.kind === "team") {
      const teamName = selectedTeam?.name || route.teamName || "";
      const { groupTitle, stats } = getTeamGroupInfo(teamName);
      return (
        <TeamDetailsTab
          team={selectedTeam}
          onBack={() => navigateToPath(route.backRoute ?? "groups")}
          stats={stats}
          groupTitle={groupTitle}
          recentMatches={getTeamRecentMatches(teamName)}
          upcomingMatches={getTeamUpcomingMatches(teamName)}
          teamNews={teamNews}
          teamNewsLoading={teamNewsLoading}
          teamNewsError={teamNewsError}
        />
      );
    }

    if (route.kind === "tab" && activeTab === "groups") {
      return (
        <GroupsTab
          groupCollection={groupCollection}
          groupMap={groupMap}
          activeGroup={activeGroup}
          setActiveGroup={setActiveGroup}
          groupsLoading={groupsLoading}
          groupsError={groupsError}
          onSelectTeam={(team) => openTeamDetails(team, "groups")}
        />
      );
    }

    if (route.kind === "tab" && activeTab === "news") {
      return <NewsTab featuredNews={featuredNews} newsLoading={newsLoading} newsError={newsError} />;
    }

    if (route.kind === "tab" && activeTab === "games") {
      return <GamesTab />;
    }

    if (route.kind === "tab" && activeTab === "scorers") {
      return <ScorersTab scorers={SCORERS} />;
    }

    if (route.kind === "tab" && activeTab === "about") {
      return <AboutTab />;
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-white">
      <div className="mx-auto max-w-7xl px-4 pt-3">
        <AdUnit slot={ADSENSE_SLOTS.TOP_BANNER} />
      </div>

      <HeaderNav tabs={TABS} activeTab={activeTab} onNavigate={(path) => navigateToPath(path)} />

      <main className="mx-auto max-w-7xl px-4 py-6">{renderActiveTab()}</main>

      <Footer />
    </div>
  );
}
