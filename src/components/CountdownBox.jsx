export default function CountdownBox({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-slate-800 border border-slate-700 rounded-xl w-20 h-20 flex items-center justify-center mb-2">
        <span className="text-4xl font-black text-yellow-400 tabular-nums leading-none">{String(value).padStart(2, "0")}</span>
      </div>
      <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">{label}</span>
    </div>
  );
}
