import { getFlagAsset, isPlaceholderTeam } from "../utils/tournamentData";

const sizes = {
  sm: "h-4 w-6 text-[9px]",
  md: "h-5 w-7 text-[10px]",
  lg: "h-8 w-11 text-xs",
  xl: "h-11 w-16 text-sm",
};

function getInitials(name = "") {
  if (isPlaceholderTeam(name)) return "TBD";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function TeamFlag({ team, size = "md", className = "" }) {
  const teamName = typeof team === "string" ? team : team?.name;
  const providedUrl = typeof team === "object" ? team?.flagUrl : "";
  const asset = providedUrl ? { flagUrl: providedUrl, countryCode: team?.countryCode } : getFlagAsset(teamName);
  const sizeClass = sizes[size] || sizes.md;

  if (asset.flagUrl) {
    return (
      <img
        src={asset.flagUrl}
        alt={`${teamName} flag`}
        className={`${sizeClass} shrink-0 rounded-[3px] object-cover ring-1 ring-black/20 ${className}`}
        loading="lazy"
      />
    );
  }

  return (
    <span className={`${sizeClass} inline-flex shrink-0 items-center justify-center rounded-[3px] bg-zinc-700 text-zinc-300 ring-1 ring-white/10 ${className}`}>
      {getInitials(teamName)}
    </span>
  );
}
