"use client";

import { CheckCircle2, CircleDot, ListChecks, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ContestCard } from "@/components/ContestCard";
import { ContestFilters, type StatusFilter } from "@/components/ContestFilters";
import { EmptyState } from "@/components/EmptyState";
import { Navbar } from "@/components/Navbar";
import { ContestPagination } from "@/components/ContestPagination";
import { StatsCard } from "@/components/StatsCard";
import type { Contest, ContestType } from "@/types/contest";

export function ContestDashboard({ contests, username }: { contests: Contest[]; username: string }) {
  const pageSize = 8;
  const [activeContests, setActiveContests] = useState(contests);
  const [activeUsername, setActiveUsername] = useState(username);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [totalContests, setTotalContests] = useState(contests.length);
  const [contestSummary, setContestSummary] = useState({ totalQuestions: contests.length * 4, solvedQuestions: 0, completedContests: 0 });
  const [userError, setUserError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | ContestType>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const stats = useMemo(() => {
    const totalQuestions = contestSummary.totalQuestions;
    const solvedQuestions = contestSummary.solvedQuestions;
    const completedContests = contestSummary.completedContests;
    return { totalQuestions, solvedQuestions, completedContests, completionPercentage: totalQuestions ? Math.round((solvedQuestions / totalQuestions) * 100) : 0 };
  }, [contestSummary]);
  const filteredContests = useMemo(() => activeContests.filter((contest) => {
    const matchesType = typeFilter === "ALL" || contest.type === typeFilter;
    const solvedCount = contest.solvedCount ?? contest.questions.filter((question) => question.solved).length;
    const matchesStatus = statusFilter === "ALL" || (statusFilter === "COMPLETED" ? solvedCount >= contest.questions.length : solvedCount < contest.questions.length);
    const query = searchQuery.trim().toLowerCase();
    return matchesType && matchesStatus && (!query || contest.name.toLowerCase().includes(query) || String(contest.contestNumber).includes(query));
  }), [activeContests, searchQuery, statusFilter, typeFilter]);
  const totalPages = Math.max(1, Math.ceil(totalContests / pageSize));
  const visibleContests = filteredContests;
  const resetPage = () => setCurrentPage(1);
  const loadProfile = async () => {
    if (isLoadingUser) return;
    setIsLoadingUser(true);
    setUserError("");
    try {
      const response = await fetch("/api/contests?page=1", { cache: "no-store" });
      const result = (await response.json()) as { contests?: typeof contests; totalContests?: number; totalQuestions?: number; solvedQuestions?: number; completedContests?: number; username?: string; error?: string };
      if (!response.ok || !result.contests || !result.username || result.totalContests === undefined || result.totalQuestions === undefined || result.solvedQuestions === undefined || result.completedContests === undefined) throw new Error(result.error ?? "Could not load this profile.");
      setActiveContests(result.contests);
      setTotalContests(result.totalContests);
      setContestSummary({ totalQuestions: result.totalQuestions, solvedQuestions: result.solvedQuestions, completedContests: result.completedContests });
      setActiveUsername(result.username);
      setSearchQuery("");
      setTypeFilter("ALL");
      setStatusFilter("ALL");
      resetPage();
    } catch (error) {
      setUserError(error instanceof Error ? error.message : "Could not load this profile.");
    } finally {
      setIsLoadingUser(false);
    }
  };
  useEffect(() => {
    const loadInitialProfile = async () => {
      await Promise.resolve();
      await loadProfile();
    };
    void loadInitialProfile();
    // The initial profile is loaded once from the server-backed session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const loadPage = async (page: number) => {
    if (page === currentPage || isLoadingPage || !activeUsername) return;
    setIsLoadingPage(true);
    setUserError("");
    try {
      const response = await fetch(`/api/contests?page=${page}`, { cache: "no-store" });
      const result = (await response.json()) as { contests?: typeof contests; error?: string };
      if (!response.ok || !result.contests) throw new Error(result.error ?? "Could not load this contest page.");
      setActiveContests(result.contests);
      setCurrentPage(page);
    } catch (error) {
      setUserError(error instanceof Error ? error.message : "Could not load this contest page.");
    } finally {
      setIsLoadingPage(false);
    }
  };

  return <div className="min-h-screen bg-[#0b0f14] text-slate-100">
    <Navbar searchQuery={searchQuery} onSearchChange={(value) => { setSearchQuery(value); resetPage(); }} />
    <main className="mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 lg:px-10">
      <section className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-cyan-400">{"// progress dashboard"}</p><h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Your contest history</h1><p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">{activeUsername ? <>Tracking LeetCode progress for <span className="font-mono text-slate-300">@{activeUsername}</span>.</> : "Loading the account connected through your server credentials."}</p></div><p className="font-mono text-xs text-slate-600">{totalContests} contests tracked</p></section>
      {userError && <p role="alert" className="mb-5 rounded-lg border border-rose-400/20 bg-rose-400/[0.06] px-4 py-3 text-sm text-rose-300">{userError}</p>}
      <section aria-label="Contest statistics" className="grid grid-cols-2 gap-3 lg:grid-cols-4"><StatsCard label="Total contests" value={String(totalContests)} icon={Trophy} accent="text-cyan-400" /><StatsCard label="Completed" value={String(stats.completedContests)} detail={`of ${totalContests} contests`} icon={CheckCircle2} accent="text-emerald-400" /><StatsCard label="Questions solved" value={`${stats.solvedQuestions} / ${stats.totalQuestions}`} icon={ListChecks} accent="text-violet-400" /><StatsCard label="Completion" value={`${stats.completionPercentage}%`} detail="across all contests" icon={CircleDot} accent="text-amber-400" /></section>
      <section className="mt-10"><ContestFilters typeFilter={typeFilter} statusFilter={statusFilter} onTypeChange={(value) => { setTypeFilter(value); resetPage(); }} onStatusChange={(value) => { setStatusFilter(value); resetPage(); }} /><div className="mt-5 flex items-center justify-between border-b border-white/[0.07] pb-4"><h2 className="text-sm font-semibold text-slate-200">Contests <span className="ml-1 font-mono text-xs font-normal text-slate-600">({totalContests})</span></h2><span className="text-xs text-slate-600">Select a question to open LeetCode</span></div>{isLoadingUser || isLoadingPage ? <div className="mt-5 grid gap-4 xl:grid-cols-2">{Array.from({ length: pageSize }, (_, index) => <div key={index} className="h-64 animate-pulse rounded-xl border border-white/[0.07] bg-[#111821]/60" />)}</div> : <><div className="mt-5 grid gap-4 xl:grid-cols-2">{visibleContests.map((contest) => <ContestCard key={contest.id} contest={contest} />)}</div>{filteredContests.length === 0 && <div className="mt-5"><EmptyState /></div>}</>}<ContestPagination currentPage={currentPage} totalPages={totalPages} onPageChange={loadPage} /></section>
    </main>
  </div>;
}