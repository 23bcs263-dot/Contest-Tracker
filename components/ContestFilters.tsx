import type { ContestType } from "@/types/contest";

export type StatusFilter = "ALL" | "INCOMPLETE" | "COMPLETED";
interface ContestFiltersProps { typeFilter: "ALL" | ContestType; statusFilter: StatusFilter; onTypeChange: (value: "ALL" | ContestType) => void; onStatusChange: (value: StatusFilter) => void; }
const typeOptions: Array<{ label: string; value: "ALL" | ContestType }> = [{ label: "All", value: "ALL" }, { label: "Weekly", value: "WEEKLY" }, { label: "Biweekly", value: "BIWEEKLY" }];
const statusOptions: Array<{ label: string; value: StatusFilter }> = [{ label: "All contests", value: "ALL" }, { label: "Incomplete only", value: "INCOMPLETE" }, { label: "Completed", value: "COMPLETED" }];

export function ContestFilters({ typeFilter, statusFilter, onTypeChange, onStatusChange }: ContestFiltersProps) {
  return <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><div className="flex w-fit rounded-lg border border-white/[0.08] bg-[#111821] p-1">{typeOptions.map((option) => <button key={option.value} onClick={() => onTypeChange(option.value)} className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${typeFilter === option.value ? "bg-cyan-400 text-[#071014]" : "text-slate-400 hover:text-slate-100"}`}>{option.label}</button>)}</div><div className="flex flex-wrap gap-2">{statusOptions.map((option) => <button key={option.value} onClick={() => onStatusChange(option.value)} className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${statusFilter === option.value ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300" : "border-white/[0.08] text-slate-500 hover:border-white/[0.16] hover:text-slate-300"}`}>{option.label}</button>)}</div></div>;
}