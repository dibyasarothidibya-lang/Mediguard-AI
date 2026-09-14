"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "@/app/components/theme-toggle";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { ShieldCheck, Menu, X, Sparkles, ArrowRight, LogOut } from "lucide-react";

const NAV_LINKS = [
  { href: "/features", label: "Features" },
  { href: "/howitworks", label: "How It Works" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch {
      // Sign-out error fallback
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-950/80">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-3 outline-none">
          <div className="relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white shadow-md shadow-indigo-500/20 transition-transform duration-300 group-hover:scale-105">
            <ShieldCheck className="size-5 transition-transform duration-300 group-hover:rotate-6" />
            <span className="absolute -top-1 -right-1 flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-cyan-500" />
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              MediGuard<span className="text-indigo-600 dark:text-indigo-400"> AI</span>
            </span>
            <span className="text-[10px] font-medium tracking-wider text-slate-400 uppercase dark:text-neutral-500">
              Pharma Safety Engine
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 rounded-full border border-slate-200/70 bg-slate-50/60 p-1.5 shadow-xs backdrop-blur-md md:flex dark:border-neutral-800/70 dark:bg-neutral-900/60">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 hover:scale-[1.03] active:scale-95 ${
                  isActive
                    ? "bg-white text-indigo-600 shadow-xs dark:bg-neutral-800 dark:text-indigo-400"
                    : "text-slate-600 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/chat"
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs font-semibold text-slate-700 backdrop-blur-md transition-all hover:bg-slate-100 hover:border-slate-300 dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-200 dark:hover:bg-neutral-800"
                title="Go to Chat"
              >
                <div className="flex size-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white uppercase">
                  {user.displayName?.[0] || user.email?.[0] || "U"}
                </div>
                <span className="max-w-[100px] truncate">
                  {user.displayName || user.email?.split("@")[0] || "Account"}
                </span>
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-2xs transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-rose-900/60 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 active:scale-95"
                title="Sign out of MediGuard"
              >
                <LogOut className="size-3.5" />
                <span>Sign Out</span>
              </button>

              <Link
                href="/chat"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-700 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-indigo-500/35 active:scale-95"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                <Sparkles className="size-4 text-cyan-300 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                <span>Launch Assistant</span>
                <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-600 transition-colors hover:text-indigo-600 dark:text-neutral-300 dark:hover:text-white"
              >
                Sign In
              </Link>

              <Link
                href="/login?redirect=/chat&required=true"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-700 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-indigo-500/35 active:scale-95"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                <Sparkles className="size-4 text-cyan-300 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                <span>Launch Assistant</span>
                <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex size-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition-transform duration-200 hover:scale-105 active:scale-90 md:hidden dark:border-neutral-800 dark:text-neutral-300"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="size-5 transition-transform duration-200 rotate-90" /> : <Menu className="size-5 transition-transform duration-200" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="animate-fade-in border-b border-slate-200 bg-white/95 px-4 py-6 shadow-xl backdrop-blur-2xl md:hidden dark:border-neutral-800 dark:bg-neutral-950/95">
          <div className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-xl px-4 py-2.5 text-base font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
                    : "text-slate-700 hover:bg-slate-50 dark:text-neutral-300 dark:hover:bg-neutral-900"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="mt-2 flex flex-col gap-2 pt-2 border-t border-slate-200 dark:border-neutral-800">
                <div className="flex items-center justify-between px-2 py-1">
                  <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white uppercase">
                      {user.displayName?.[0] || user.email?.[0] || "U"}
                    </div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-[180px]">
                      {user.displayName || user.email}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex items-center gap-1 text-xs text-rose-600 hover:underline dark:text-rose-400"
                  >
                    <LogOut className="size-3.5" /> Sign Out
                  </button>
                </div>
                <Link
                  href="/chat"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-center text-base font-semibold text-white shadow-md"
                >
                  <Sparkles className="size-4 text-cyan-300" />
                  Launch Assistant
                </Link>
              </div>
            ) : (
              <div className="mt-2 flex flex-col gap-2 pt-2 border-t border-slate-200 dark:border-neutral-800">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-center text-sm font-semibold text-slate-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200"
                >
                  Sign In / Create Account
                </Link>
                <Link
                  href="/login?redirect=/chat&required=true"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-center text-base font-semibold text-white shadow-md"
                >
                  <Sparkles className="size-4 text-cyan-300" />
                  Launch Assistant
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
