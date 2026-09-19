import type { LucideIcon } from "lucide-react";

interface StatsCardProps { label: string; value: string; detail?: string; icon: LucideIcon; accent: string; }

export function StatsCard({ label, value, detail, icon: Icon, accent }: StatsCardProps) {
  return <div className="rounded-xl border border-white/[0.07] bg-[#111821] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-colors hover:border-white/[0.14]"><div className="flex items-center justify-between gap-3"><p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">{label}</p><Icon aria-hidden="true" className={`h-4 w-4 ${accent}`} /></div><p className="mt-3 font-mono text-2xl font-bold tracking-tight text-slate-100">{value}</p>{detail && <p className="mt-1 text-xs text-slate-500">{detail}</p>}</div>;
}