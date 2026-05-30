export default function CountdownBox({ value, label }) {
  return (
    <div className="flex min-w-16 flex-col items-center">
      <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-lg border border-white/10 bg-zinc-950/70 sm:h-20 sm:w-20">
        <span className="text-2xl font-black leading-none text-amber-300 tabular-nums sm:text-4xl">{String(value).padStart(2, "0")}</span>
      </div>
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500 sm:text-xs">{label}</span>
    </div>
  );
}
