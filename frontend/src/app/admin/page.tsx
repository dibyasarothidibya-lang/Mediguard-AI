"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/app/components/theme-toggle";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { fetchAdminOverview, type AdminOverviewData } from "@/lib/api";
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  LogOut,
  ArrowRight,
  Users,
  MessageSquare,
  Activity,
  RefreshCw,
  Search,
  Download,
  Home,
  MessageCircle,
  Clock,
  Sparkles,
  Database,
  CheckCircle2,
  AlertCircle,
  Eye,
} from "lucide-react";

const ADMIN_FIREBASE_UIDS = (process.env.NEXT_PUBLIC_ADMIN_FIREBASE_UIDS || "")
  .split(",")
  .map((u) => u.trim())
  .filter(Boolean);

function isUserAdmin(user: User | null): boolean {
  if (!user) return false;
  if (ADMIN_FIREBASE_UIDS.length > 0) {
    return ADMIN_FIREBASE_UIDS.includes(user.uid);
  }
  return true;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isForbidden, setIsForbidden] = useState(false);

  const [data, setData] = useState<AdminOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"queries" | "users" | "project">("queries");
  const [searchFilter, setSearchFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [selectedQuery, setSelectedQuery] = useState<{
    question: string;
    answer: string;
    user_email: string;
    created_at: string;
  } | null>(null);

  const loadData = useCallback(async (isManualRefresh = false, userToUse?: User | null) => {
    const targetUser = userToUse || currentUser;
    if (!targetUser || !isUserAdmin(targetUser)) return;

    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const overview = await fetchAdminOverview(targetUser);
      setData(overview);
      setIsForbidden(false);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to load admin analytics.";
      if (errMsg.includes("Access denied") || errMsg.includes("administrator permissions")) {
        setIsForbidden(true);
      } else {
        setError(errMsg);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentUser]);

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthReady(true);
      if (user && isUserAdmin(user)) {
        await loadData(false, user);
      } else {
        setLoading(false);
      }
    });
  }, [loadData]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut(auth);
      router.push("/login?redirect=/admin");
    } finally {
      setIsSigningOut(false);
    }
  };

  // Filter queries based on search query
  const allQueries = data?.queries ?? [];
  const filteredQueries = searchFilter.trim()
    ? allQueries.filter((q) => {
        const term = searchFilter.toLowerCase();
        return (
          q.question.toLowerCase().includes(term) ||
          q.user_email.toLowerCase().includes(term) ||
          q.user_name.toLowerCase().includes(term) ||
          q.answer.toLowerCase().includes(term)
        );
      })
    : allQueries;

  // Filter users based on user search query
  const allUsers = data?.users ?? [];
  const filteredUsers = userFilter.trim()
    ? allUsers.filter((u) => {
        const term = userFilter.toLowerCase();
        return (
          u.email.toLowerCase().includes(term) ||
          u.display_name.toLowerCase().includes(term) ||
          u.firebase_uid.toLowerCase().includes(term)
        );
      })
    : allUsers;

  // CSV Export utility for university presentation submission
  const exportToCSV = () => {
    if (!data?.queries || data.queries.length === 0) return;
    const headers = ["ID", "Timestamp", "User Email", "User Name", "Question Asked", "AI Answer Preview", "Client IP"];
    const rows = data.queries.map((q) => [
      q.id,
      `"${new Date(q.created_at).toLocaleString()}"`,
      `"${q.user_email}"`,
      `"${q.user_name}"`,
      `"${q.question.replace(/"/g, '""')}"`,
      `"${q.answer.replace(/"/g, '""').slice(0, 300)}"`,
      `"${q.client_ip || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mediguard_user_query_audit_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (isoStr: string) => {
    if (!isoStr) return "N/A";
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoStr;
    }
  };

  // 1. Verifying Authentication & Credentials State
  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900 dark:bg-[#0d0f14] dark:text-[#ececec]">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-xl backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-900/80">
          <div className="relative flex size-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
            <RefreshCw className="size-7 animate-spin" />
          </div>
          <div className="text-center">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Authenticating Administrator
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-neutral-400">
              Verifying security credentials & university project privileges...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Anonymous Visitor Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0d0f14] dark:text-[#ececec] flex flex-col">
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/85">
          <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-500/20">
                <ShieldCheck className="size-5" />
              </div>
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                MediGuard<span className="text-indigo-600 dark:text-indigo-400"> AI</span>
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link
                href="/"
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900"
              >
                <Home className="size-3.5" />
                <span>Home</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-900/90 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/25">
              <Lock className="size-8" />
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400 mb-3">
              <ShieldAlert className="size-3.5" />
              Restricted Staff Console
            </div>
            <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl text-slate-900 dark:text-white">
              Administrator Access Required
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-neutral-300 leading-relaxed">
              This cockpit contains real-time university project telemetry, live tester counts, and clinical search audit logs. You must sign in with an authorized administrator account to enter.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/login?redirect=/admin&required=true"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500 active:scale-[0.99]"
              >
                <span>Sign In as Administrator</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
              >
                <span>Return to MediGuard AI Home</span>
              </Link>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-4 text-[11px] text-slate-400 dark:border-neutral-800 dark:text-neutral-500">
              Authorized Administrator: <span className="font-mono text-indigo-500 dark:text-indigo-400">Restricted Access (System Administrator)</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 3. Authenticated Non-Admin User (403 Forbidden Screen)
  if (currentUser && (!isUserAdmin(currentUser) || isForbidden)) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0d0f14] dark:text-[#ececec] flex flex-col">
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/85">
          <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-500/20">
                <ShieldCheck className="size-5" />
              </div>
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                MediGuard<span className="text-indigo-600 dark:text-indigo-400"> AI</span>
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-900/40"
              >
                <LogOut className="size-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-rose-200 bg-white/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl dark:border-rose-900/40 dark:bg-neutral-900/90 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white shadow-lg shadow-rose-500/25">
              <ShieldAlert className="size-8" />
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-700 dark:text-rose-400 mb-3">
              HTTP 403 Forbidden
            </div>
            <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl text-slate-900 dark:text-white">
              Access Restricted
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-neutral-300 leading-relaxed">
              You are signed in as <span className="font-semibold text-slate-900 dark:text-white">{currentUser.email}</span>. This account does not have university administrative privileges to view MediGuard telemetry or audit logs.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-600/25 transition-all hover:bg-rose-500 active:scale-[0.99]"
              >
                <LogOut className="size-4" />
                <span>Switch to Administrator Account</span>
              </button>
              <Link
                href="/chat"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/25 transition-all hover:bg-indigo-500"
              >
                <MessageCircle className="size-3.5" />
                <span>Continue to MediGuard AI Chat</span>
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
              >
                <span>Return to Home</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 4. Authorized Administrator View
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-[#0d0f14] dark:text-[#ececec]">
      {/* Top Admin Control Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/85">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-500/20">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                  MediGuard<span className="text-indigo-600 dark:text-indigo-400"> AI</span>
                </span>
                <span className="ml-2 rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                  Admin Audit Cockpit
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {currentUser?.email && (
              <span className="hidden lg:inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                <ShieldCheck className="size-3.5 text-indigo-500" />
                <span>Admin: {currentUser.email}</span>
              </span>
            )}

            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              Live DB Handshake
            </span>

            <button
              type="button"
              onClick={() => loadData(true)}
              disabled={refreshing || loading}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-100 disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
              title="Refresh telemetry"
            >
              <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin text-indigo-500" : ""}`} />
              <span>Refresh</span>
            </button>

            <ThemeToggle />

            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-100 disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
              title="Sign Out"
            >
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>

            <Link
              href="/chat"
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/25 transition-all hover:bg-indigo-500"
            >
              <MessageCircle className="size-3.5" />
              <span className="hidden sm:inline">Open Chat</span>
            </Link>

            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900"
            >
              <Home className="size-3.5" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Academic Presentation Banner */}
        <div className="relative mb-8 overflow-hidden rounded-3xl border border-indigo-200/80 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 p-6 sm:p-8 text-white shadow-xl">
          <div className="pointer-events-none absolute -right-12 -top-12 size-64 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-cyan-300 backdrop-blur-md mb-3">
                <Sparkles className="size-3.5" />
                University Project Evaluation Console
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-white">
                Live Engagement & Audit Analytics
              </h1>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                Real-time tracking of registered testers, active evaluation sessions, and medicine information queries processed by MediGuard AI&apos;s evidence-grounded verification engine.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={exportToCSV}
                className="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-xs font-bold text-white shadow-md backdrop-blur-md transition-all hover:bg-white/25 active:scale-95"
              >
                <Download className="size-4 text-cyan-300" />
                <span>Export Query Audit (CSV)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Alert if any */}
        {error && (
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="size-5 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => loadData(true)}
              className="font-bold underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* 4 Stat Overview Metric Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Total Registered Users */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                Total Users
              </span>
              <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                <Users className="size-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                {loading ? "..." : data?.stats.total_registered_users ?? 0}
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Registered
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-neutral-400">
              Verified patient & clinician accounts
            </p>
          </div>

          {/* Card 2: Active Clinical Inquirers */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                Active Testers
              </span>
              <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <Activity className="size-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                {loading ? "..." : data?.stats.active_users ?? 0}
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {data && data.stats.total_registered_users > 0
                  ? `${Math.round((data.stats.active_users / data.stats.total_registered_users) * 100)}% active`
                  : "Active"}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-neutral-400">
              Users with at least 1 verified search
            </p>
          </div>

          {/* Card 3: Total Verified Queries */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                Total Queries
              </span>
              <div className="flex size-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400">
                <MessageSquare className="size-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                {loading ? "..." : data?.stats.total_queries ?? 0}
              </span>
              <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                Questions
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-neutral-400">
              Clinical drug lookups & interaction checks
            </p>
          </div>

          {/* Card 4: Audit & Engine Status */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                System Status
              </span>
              <div className="flex size-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                <Database className="size-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                PostgreSQL + DGDA
              </span>
            </div>
            <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="size-3" />
              Audit Trail Synchronized
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex border-b border-slate-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={() => setActiveTab("queries")}
            className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-all ${
              activeTab === "queries"
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white"
            }`}
          >
            <MessageSquare className="size-4" />
            <span>Search Queries & Inquiries</span>
            {data && (
              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-700 dark:bg-neutral-800 dark:text-neutral-300">
                {data.queries.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-all ${
              activeTab === "users"
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white"
            }`}
          >
            <Users className="size-4" />
            <span>Registered User Directory</span>
            {data && (
              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-700 dark:bg-neutral-800 dark:text-neutral-300">
                {data.users.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("project")}
            className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-all ${
              activeTab === "project"
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white"
            }`}
          >
            <Sparkles className="size-4" />
            <span>Academic Evaluation Summary</span>
          </button>
        </div>

        {/* TAB 1: Search Queries & Inquiries Feed */}
        {activeTab === "queries" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search by medicine, keyword, user email..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500"
                />
              </div>

              <div className="text-xs text-slate-500 dark:text-neutral-400">
                Showing {filteredQueries.length} of {data?.queries.length ?? 0} queries
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-neutral-400">
                    <tr>
                      <th className="px-4 py-3.5">Time</th>
                      <th className="px-4 py-3.5">User</th>
                      <th className="px-4 py-3.5">Question / Search Query</th>
                      <th className="px-4 py-3.5">Assistant Response Preview</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400">
                          <div className="flex items-center justify-center gap-2">
                            <div className="size-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                            <span>Loading query records...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredQueries.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400 dark:text-neutral-500">
                          No inquiries found matching your filter.
                        </td>
                      </tr>
                    ) : (
                      filteredQueries.map((q) => (
                        <tr
                          key={q.id}
                          className="transition-colors hover:bg-slate-50/80 dark:hover:bg-neutral-800/40"
                        >
                          <td className="whitespace-nowrap px-4 py-3.5 text-xs text-slate-500 dark:text-neutral-400">
                            <div className="flex items-center gap-1.5">
                              <Clock className="size-3 text-slate-400" />
                              <span>{formatDate(q.created_at)}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex flex-col">
                              <span className="font-semibold text-xs text-slate-900 dark:text-white">
                                {q.user_name || "Tester"}
                              </span>
                              <span className="text-[11px] text-indigo-600 dark:text-indigo-400">
                                {q.user_email}
                              </span>
                            </div>
                          </td>
                          <td className="max-w-md px-4 py-3.5">
                            <p className="line-clamp-2 text-xs font-medium text-slate-800 dark:text-neutral-200">
                              {q.question}
                            </p>
                          </td>
                          <td className="max-w-xs px-4 py-3.5 text-xs text-slate-500 dark:text-neutral-400">
                            <p className="line-clamp-2 leading-snug">
                              {q.answer || "No response text."}
                            </p>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedQuery(q)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-indigo-400 dark:hover:bg-neutral-700"
                            >
                              <Eye className="size-3" />
                              <span>View</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Registered User Directory */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  placeholder="Filter users by name, email, or UID..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500"
                />
              </div>

              <div className="text-xs text-slate-500 dark:text-neutral-400">
                {filteredUsers.length} total users registered
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-neutral-400">
                    <tr>
                      <th className="px-4 py-3.5">User</th>
                      <th className="px-4 py-3.5">Email Address</th>
                      <th className="px-4 py-3.5 text-center">Searches Made</th>
                      <th className="px-4 py-3.5">Joined Date</th>
                      <th className="px-4 py-3.5">Last Active</th>
                      <th className="px-4 py-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          Loading user directory...
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400 dark:text-neutral-500">
                          No users found matching your filter.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr
                          key={u.id}
                          className="transition-colors hover:bg-slate-50/80 dark:hover:bg-neutral-800/40"
                        >
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white uppercase">
                                {u.display_name?.[0] || u.email?.[0] || "U"}
                              </div>
                              <span className="font-semibold text-xs text-slate-900 dark:text-white">
                                {u.display_name || "Tester"}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-xs text-slate-600 dark:text-neutral-300">
                            {u.email}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                              {u.query_count}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-xs text-slate-500 dark:text-neutral-400">
                            {formatDate(u.created_at)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-xs text-slate-500 dark:text-neutral-400">
                            {formatDate(u.last_active_at)}
                          </td>
                          <td className="px-4 py-3.5">
                            {u.query_count > 0 ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                <span className="size-1.5 rounded-full bg-emerald-500" /> Active Tester
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-neutral-800 dark:text-neutral-400">
                                Registered
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Academic Evaluation Summary */}
        {activeTab === "project" && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                MediGuard AI · University Project Evaluation Brief
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-neutral-400">
                Summary of software architecture, engineering standards, and real-world evaluation telemetry.
              </p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-neutral-800 dark:bg-neutral-800/40">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    Engineering Stack & Architecture
                  </h3>
                  <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-neutral-300">
                    <li>• <strong>Frontend:</strong> Next.js 16 (App Router, Turbopack, TailwindCSS v4)</li>
                    <li>• <strong>Backend:</strong> Django 6.1 REST Framework on Python 3.13</li>
                    <li>• <strong>Database:</strong> PostgreSQL with relational catalog and audit trails</li>
                    <li>• <strong>Authentication:</strong> Firebase Auth with cryptographically verified JWT claims</li>
                    <li>• <strong>AI Engine:</strong> Google Gemini 3.1 Flash with strict grounded verification</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-neutral-800 dark:bg-neutral-800/40">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-indigo-500" />
                    Key Innovations & Regulatory Rigor
                  </h3>
                  <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-neutral-300">
                    <li>• <strong>Evidence Grounding:</strong> Pre-retrieval pipeline cross-referencing structured medicine records.</li>
                    <li>• <strong>Multi-Carrier Scanning:</strong> GS1 DataMatrix + barcode extraction directly in the browser.</li>
                    <li>• <strong>Mandatory Auth Gating:</strong> User access auditability protecting platform safety.</li>
                    <li>• <strong>Candidate Matching:</strong> Multi-source retrieval across DGDA-aligned records and openFDA.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal for viewing detailed query and answer */}
        {selectedQuery && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <MessageSquare className="size-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    Inquiry Audit Detail
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedQuery(null)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-neutral-800 dark:hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    User & Timestamp
                  </span>
                  <p className="text-xs text-slate-700 dark:text-neutral-300">
                    {selectedQuery.user_email} · {formatDate(selectedQuery.created_at)}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Question / Search Query
                  </span>
                  <div className="mt-1 rounded-xl bg-slate-50 p-3 text-xs font-semibold text-slate-900 dark:bg-neutral-800 dark:text-white">
                    {selectedQuery.question}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    AI Clinical Response Preview
                  </span>
                  <div className="mt-1 max-h-60 overflow-y-auto rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-700 dark:bg-neutral-800 dark:text-neutral-300 whitespace-pre-wrap">
                    {selectedQuery.answer || "No response recorded."}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedQuery(null)}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                  Close Detail
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
