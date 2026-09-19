"use client";

import { ArrowRight, Search, UserRound } from "lucide-react";
import { useSyncExternalStore } from "react";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  username: string;
  onUsernameChange: (value: string) => void;
  onUsernameSubmit: () => void;
  isLoading: boolean;
}

export function Navbar({ searchQuery, onSearchChange, username, onUsernameChange, onUsernameSubmit, isLoading }: NavbarProps) {
  const isMounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  return (
    <header className="border-b border-white/[0.07] bg-[#0d1117]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400 font-mono text-sm font-bold text-[#071014] shadow-[0_0_24px_rgba(34,211,238,0.2)]">&gt;_</div>
          <div><p className="font-mono text-[15px] font-bold tracking-tight text-white">ContestTrack</p><p className="mt-0.5 text-xs text-slate-500">Personal contest progress</p></div>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <form suppressHydrationWarning onSubmit={(event) => { event.preventDefault(); onUsernameSubmit(); }} className="relative flex w-full sm:w-64">
            <UserRound aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <label htmlFor="leetcode-username" className="sr-only">LeetCode username</label>
            {isMounted ? <input id="leetcode-username" value={username} onChange={(event) => onUsernameChange(event.target.value)} placeholder="LeetCode username" className="h-10 w-full rounded-lg border border-white/[0.09] bg-[#111821] pl-10 pr-10 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10" /> : <div aria-hidden="true" className="h-10 w-full rounded-lg border border-white/[0.09] bg-[#111821]" />}
            <button type="submit" aria-label="Load username contest history" disabled={isLoading} className="absolute right-1 top-1 h-8 w-8 rounded-md text-slate-500 transition hover:bg-cyan-400/10 hover:text-cyan-300 disabled:opacity-40"><ArrowRight aria-hidden="true" className="mx-auto h-4 w-4" /></button>
          </form>
          <label className="relative w-full sm:w-56">
            <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <span className="sr-only">Search contests</span>
            {isMounted ? <input value={searchQuery} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search contests..." className="h-10 w-full rounded-lg border border-white/[0.09] bg-[#111821] pl-10 pr-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10" /> : <div aria-hidden="true" className="h-10 w-full rounded-lg border border-white/[0.09] bg-[#111821]" />}
          </label>
        </div>
      </div>
    </header>
  );
}