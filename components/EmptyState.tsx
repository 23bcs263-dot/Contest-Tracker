import { SearchX } from "lucide-react";

export function EmptyState() {
  return <div className="rounded-xl border border-dashed border-white/[0.12] bg-[#111821]/60 px-6 py-16 text-center"><SearchX aria-hidden="true" className="mx-auto h-8 w-8 text-slate-600" /><h2 className="mt-4 text-sm font-semibold text-slate-200">No contests found</h2><p className="mt-1 text-sm text-slate-500">Try adjusting your search or filters.</p></div>;
}