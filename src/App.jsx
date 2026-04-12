import { useEffect, useMemo, useState } from "react";
import Footer from "./components/Footer";
import HeaderNav from "./components/HeaderNav";
import AdUnit from "./components/AdUnit";
import AboutTab from "./components/tabs/AboutTab";
import GroupsTab from "./components/tabs/GroupsTab";
import HomeTab from "./components/tabs/HomeTab";
import MatchDetailsTab from "./components/tabs/MatchDetailsTab";
import NewsTab from "./components/tabs/NewsTab";
import ScoresTab from "./components/tabs/ScoresTab";
import ScorersTab from "./components/tabs/ScorersTab";
import TeamDetailsTab from "./components/tabs/TeamDetailsTab";
import { ADSENSE_CLIENT, ADSENSE_SLOTS, GROUPS, NEWS_FALLBACK, SCORERS, SCHEDULE, TABS } from "./constants/worldCupData";
import { fetchDailyNews, fetchMatchNews, fetchTeamNews, fetchWorldCupTournamentData } from "./services/liveDataApi";

export default function WorldCup2026() {
  const [activeTab, setActiveTab] = useState("home");
  const [activeGroup, setActiveGroup] = useState("A");
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [groupsData, setGroupsData] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(true);
  const [groupsError, setGroupsError] = useState("");
  const [fixturesData, setFixturesData] = useState([]);
  const [fixturesLoading, setFixturesLoading] = useState(true);
  const [fixturesError, setFixturesError] = useState("");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamBackTab, setTeamBackTab] = useState("scores");
  const [matchNews, setMatchNews] = useState([]);
  const [matchNewsLoading, setMatchNewsLoading] = useState(false);
  const [matchNewsError, setMatchNewsError] = useState("");
  const [teamNews, setTeamNews] = useState([]);
  const [teamNewsLoading, setTeamNewsLoading] = useState(false);
  const [teamNewsError, setTeamNewsError] = useState("");
  const [newsItems, setNewsItems] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState("");

  useEffect(() => {
    if (!document.querySelector(`script[src*="${ADSENSE_CLIENT}"]`)) {
      const script = document.createElement("script");
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const target = new Date("2026-06-11T19:00:00-06:00");
    const tick = () => {
      const now = new Date();
      const diff = target - now;
      if (diff <= 0) return;

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
        setGroupsData(tournamentData.groups ?? []);
        setFixturesData(tournamentData.fixtures ?? []);
        setGroupsError("");
        setFixturesError("");
      } catch {
        if (cancelled) return;
        setGroupsError("Real World Cup groups are unavailable right now. Showing fallback groups.");
        setFixturesError("Real World Cup fixtures are unavailable right now. Showing fallback fixtures.");
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
        setNewsError("Daily feed unavailable right now. Please try again shortly.");
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

  const fallbackGroups = useMemo(
    () => Object.entries(GROUPS).map(([letter, group]) => ({ letter, title: `Group ${letter}`, teams: group.teams })),
    [],
  );

  const groupCollection = groupsData.length > 0 ? groupsData : fallbackGroups;
  const groupMap = useMemo(() => Object.fromEntries(groupCollection.map((group) => [group.letter, group])), [groupCollection]);

  useEffect(() => {
    if (!groupMap[activeGroup] && groupCollection.length > 0) {
      setActiveGroup(groupCollection[0].letter);
    }
  }, [activeGroup, groupCollection, groupMap]);

  useEffect(() => {
    if (!selectedMatch) return;

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
    if (!selectedTeam) return;

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

  const featuredNews = newsItems.length > 0 ? newsItems.slice(0, 24) : NEWS_FALLBACK;
  const fixturesCollection = fixturesData.length > 0 ? fixturesData : SCHEDULE;

  const getRecentTeamMatches = (teamName) => {
    if (!selectedMatch) return [];
    return fixturesCollection
      .filter((fixture) => fixture.id !== selectedMatch.id)
      .filter((fixture) => fixture.home.name === teamName || fixture.away.name === teamName)
      .slice(0, 5);
  };

  const openMatchDetails = (match) => {
    setSelectedMatch(match);
    setActiveTab("match");
  };

  const openTeamDetails = (team, backTab = "scores") => {
    setSelectedTeam(team);
    setTeamBackTab(backTab);
    setActiveTab("team");
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
    if (activeTab === "home") {
      return (
        <HomeTab
          countdown={countdown}
          onOpenFixtures={() => setActiveTab("scores")}
          onOpenGroups={() => setActiveTab("groups")}
          onOpenNews={() => setActiveTab("news")}
          fixtures={fixturesCollection}
          featuredNews={featuredNews}
          newsError={newsError}
          newsLoading={newsLoading}
        />
      );
    }

    if (activeTab === "scores") {
      return (
        <ScoresTab
          fixtures={fixturesCollection}
          fixturesLoading={fixturesLoading}
          fixturesError={fixturesError}
          onSelectMatch={openMatchDetails}
        />
      );
    }

    if (activeTab === "match") {
      return (
        <MatchDetailsTab
          key={selectedMatch?.id || "match-details"}
          match={selectedMatch}
          onBack={() => setActiveTab("scores")}
          onOpenTeam={(team) => openTeamDetails(team, "match")}
          relatedNews={matchNews}
          matchNewsLoading={matchNewsLoading}
          matchNewsError={matchNewsError}
          recentHomeMatches={selectedMatch ? getRecentTeamMatches(selectedMatch.home.name) : []}
          recentAwayMatches={selectedMatch ? getRecentTeamMatches(selectedMatch.away.name) : []}
        />
      );
    }

    if (activeTab === "team") {
      const teamName = selectedTeam?.name || "";
      const { groupTitle, stats } = getTeamGroupInfo(teamName);
      return (
        <TeamDetailsTab
          team={selectedTeam}
          onBack={() => setActiveTab(teamBackTab)}
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

    if (activeTab === "groups") {
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

    if (activeTab === "news") {
      return <NewsTab featuredNews={featuredNews} newsLoading={newsLoading} newsError={newsError} />;
    }

    if (activeTab === "scorers") {
      return <ScorersTab scorers={SCORERS} />;
    }

    if (activeTab === "about") {
      return <AboutTab />;
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white" style={{ fontFamily: "'Trebuchet MS', sans-serif" }}>
      <div className="max-w-6xl mx-auto px-4 pt-3">
        <AdUnit slot={ADSENSE_SLOTS.TOP_BANNER} />
      </div>

      <HeaderNav tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-6xl mx-auto px-4 py-6">{renderActiveTab()}</main>

      <Footer />
    </div>
  );
}
