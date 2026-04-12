export const ADSENSE_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT || "";

export const ADSENSE_SLOTS = {
  TOP_BANNER: import.meta.env.VITE_ADSENSE_SLOT_TOP_BANNER || "",
  HOME_MID_RECTANGLE: import.meta.env.VITE_ADSENSE_SLOT_HOME_MID_RECTANGLE || "",
  HOME_BOTTOM_RECTANGLE: import.meta.env.VITE_ADSENSE_SLOT_HOME_BOTTOM_RECTANGLE || "",
  TAB_TOP_BANNER: import.meta.env.VITE_ADSENSE_SLOT_TAB_TOP_BANNER || "",
  TAB_BOTTOM_RECTANGLE: import.meta.env.VITE_ADSENSE_SLOT_TAB_BOTTOM_RECTANGLE || "",
};

export const TABS = [
  { id: "home", label: "Home" },
  { id: "scores", label: "Fixtures" },
  { id: "groups", label: "Groups" },
  { id: "news", label: "News" },
  { id: "scorers", label: "Top Scorers" },
  { id: "about", label: "About" },
];

export const GROUPS = {
  A: { teams: [
    { name: "USA", flag: "🇺🇸", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { name: "Panama", flag: "🇵🇦", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { name: "Bolivia", flag: "🇧🇴", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { name: "Morocco", flag: "🇲🇦", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
  ]},
  B: { teams: [
    { name: "Argentina", flag: "🇦🇷", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { name: "Chile", flag: "🇨🇱", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { name: "Peru", flag: "🇵🇪", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { name: "Poland", flag: "🇵🇱", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
  ]},
  C: { teams: [
    { name: "Mexico", flag: "🇲🇽", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { name: "Ecuador", flag: "🇪🇨", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { name: "Jamaica", flag: "🇯🇲", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { name: "Senegal", flag: "🇸🇳", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
  ]},
  D: { teams: [
    { name: "France", flag: "🇫🇷", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { name: "England", flag: "🏴", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { name: "Tunisia", flag: "🇹🇳", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { name: "Paraguay", flag: "🇵🇾", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
  ]},
  E: { teams: [
    { name: "Spain", flag: "🇪🇸", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { name: "Germany", flag: "🇩🇪", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { name: "Nigeria", flag: "🇳🇬", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { name: "Costa Rica", flag: "🇨🇷", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
  ]},
  F: { teams: [
    { name: "Brazil", flag: "🇧🇷", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { name: "Colombia", flag: "🇨🇴", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { name: "Japan", flag: "🇯🇵", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { name: "Egypt", flag: "🇪🇬", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
  ]},
  G: { teams: [
    { name: "Portugal", flag: "🇵🇹", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { name: "Netherlands", flag: "🇳🇱", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { name: "South Korea", flag: "🇰🇷", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { name: "Cameroon", flag: "🇨🇲", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
  ]},
  H: { teams: [
    { name: "Belgium", flag: "🇧🇪", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { name: "Uruguay", flag: "🇺🇾", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { name: "Iran", flag: "🇮🇷", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { name: "Canada", flag: "🇨🇦", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
  ]},
  I: { teams: [
    { name: "Italy", flag: "🇮🇹", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { name: "Croatia", flag: "🇭🇷", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { name: "Australia", flag: "🇦🇺", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { name: "Algeria", flag: "🇩🇿", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
  ]},
  J: { teams: [
    { name: "Switzerland", flag: "🇨🇭", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { name: "Denmark", flag: "🇩🇰", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { name: "Saudi Arabia", flag: "🇸🇦", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { name: "Venezuela", flag: "🇻🇪", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
  ]},
  K: { teams: [
    { name: "Turkey", flag: "🇹🇷", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { name: "Austria", flag: "🇦🇹", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { name: "Morocco", flag: "🇲🇦", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { name: "New Zealand", flag: "🇳🇿", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
  ]},
  L: { teams: [
    { name: "Serbia", flag: "🇷🇸", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { name: "Czech Republic", flag: "🇨🇿", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { name: "Ghana", flag: "🇬🇭", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { name: "Honduras", flag: "🇭🇳", played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
  ]},
};

export const SCHEDULE = [
  { date: "Jun 11", time: "19:00", home: { name: "Mexico", flag: "🇲🇽" }, away: { name: "Ecuador", flag: "🇪🇨" }, venue: "Estadio Azteca", city: "Mexico City" },
  { date: "Jun 12", time: "16:00", home: { name: "USA", flag: "🇺🇸" }, away: { name: "Panama", flag: "🇵🇦" }, venue: "SoFi Stadium", city: "Los Angeles" },
  { date: "Jun 12", time: "19:00", home: { name: "Canada", flag: "🇨🇦" }, away: { name: "Iran", flag: "🇮🇷" }, venue: "BC Place", city: "Vancouver" },
  { date: "Jun 13", time: "13:00", home: { name: "Argentina", flag: "🇦🇷" }, away: { name: "Chile", flag: "🇨🇱" }, venue: "MetLife Stadium", city: "New York" },
  { date: "Jun 13", time: "16:00", home: { name: "France", flag: "🇫🇷" }, away: { name: "Tunisia", flag: "🇹🇳" }, venue: "AT&T Stadium", city: "Dallas" },
  { date: "Jun 14", time: "13:00", home: { name: "Brazil", flag: "🇧🇷" }, away: { name: "Egypt", flag: "🇪🇬" }, venue: "Hard Rock Stadium", city: "Miami" },
  { date: "Jun 14", time: "16:00", home: { name: "Spain", flag: "🇪🇸" }, away: { name: "Nigeria", flag: "🇳🇬" }, venue: "Lumen Field", city: "Seattle" },
  { date: "Jun 14", time: "19:00", home: { name: "England", flag: "🏴" }, away: { name: "Paraguay", flag: "🇵🇾" }, venue: "Arrowhead Stadium", city: "Kansas City" },
  { date: "Jun 15", time: "13:00", home: { name: "Germany", flag: "🇩🇪" }, away: { name: "Costa Rica", flag: "🇨🇷" }, venue: "Lincoln Financial Field", city: "Philadelphia" },
  { date: "Jun 15", time: "16:00", home: { name: "Portugal", flag: "🇵🇹" }, away: { name: "Cameroon", flag: "🇨🇲" }, venue: "Gillette Stadium", city: "Boston" },
  { date: "Jun 15", time: "19:00", home: { name: "Netherlands", flag: "🇳🇱" }, away: { name: "South Korea", flag: "🇰🇷" }, venue: "Allegiant Stadium", city: "Las Vegas" },
  { date: "Jun 16", time: "13:00", home: { name: "Belgium", flag: "🇧🇪" }, away: { name: "Uruguay", flag: "🇺🇾" }, venue: "NRG Stadium", city: "Houston" },
];

export const SCORERS = [
  { name: "Erling Haaland", team: "Norway", flag: "🇳🇴", goals: 0, assists: 0, img: "EH" },
  { name: "Kylian Mbappe", team: "France", flag: "🇫🇷", goals: 0, assists: 0, img: "KM" },
  { name: "Vinicius Jr.", team: "Brazil", flag: "🇧🇷", goals: 0, assists: 0, img: "VJ" },
  { name: "Lionel Messi", team: "Argentina", flag: "🇦🇷", goals: 0, assists: 0, img: "LM" },
  { name: "Harry Kane", team: "England", flag: "🏴", goals: 0, assists: 0, img: "HK" },
  { name: "Lamine Yamal", team: "Spain", flag: "🇪🇸", goals: 0, assists: 0, img: "LY" },
  { name: "Bukayo Saka", team: "England", flag: "🏴", goals: 0, assists: 0, img: "BS" },
  { name: "Rodri", team: "Spain", flag: "🇪🇸", goals: 0, assists: 0, img: "RD" },
];

export const NEWS_FALLBACK = [
  { title: "Argentina vs France: The Dream Final Nobody Can Stop Talking About", tag: "PREVIEW", time: "2 hours ago", emoji: "⚡", link: "#", source: "WC2026.live" },
  { title: "Top 10 Players to Watch at World Cup 2026 - Full Breakdown", tag: "ANALYSIS", time: "5 hours ago", emoji: "🌟", link: "#", source: "WC2026.live" },
  { title: "World Cup 2026 Venues: Inside the 16 Stadiums Hosting the Biggest Show on Earth", tag: "GUIDE", time: "1 day ago", emoji: "🏟️", link: "#", source: "WC2026.live" },
  { title: "Group of Death 2026: Which Group Will Produce the Shock Exit?", tag: "FEATURES", time: "1 day ago", emoji: "💀", link: "#", source: "WC2026.live" },
  { title: "Messi's Last Dance? Why Argentina 2026 Feels Different This Time", tag: "OPINION", time: "2 days ago", emoji: "🐐", link: "#", source: "WC2026.live" },
  { title: "Complete World Cup 2026 Schedule: Every Match, Every Kickoff Time", tag: "SCHEDULE", time: "3 days ago", emoji: "📅", link: "#", source: "WC2026.live" },
];
