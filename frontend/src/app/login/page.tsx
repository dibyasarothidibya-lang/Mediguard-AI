"use client";

import { useState, useEffect, Suspense } from "react";
import * as api from "@/lib/api";
import { auth } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "@/app/components/theme-toggle";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  QrCode,
  ArrowRight,
  Home,
  Shield,
  Mail,
  User,
  Laptop,
  Tablet,
  Smartphone,
  Eye,
  EyeOff,
  Sparkles,
  LogOut,
} from "lucide-react";

function getAuthErrorMessage(error: unknown): string {
  if (error instanceof api.BackendAuthError) {
    return error.message;
  }
  if (!(error instanceof FirebaseError)) {
    return typeof error === "string"
      ? error
      : "An unexpected error occurred. Please try again.";
  }

  switch (error.code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Incorrect email or password. Please verify your credentials.";
    case "auth/email-already-in-use":
      return "An account already exists with this email address. Please sign in instead.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 8 characters.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-disabled":
      return "This account has been suspended. Please contact support.";
    case "auth/too-many-requests":
      return "Too many unsuccessful attempts. Please wait a moment and try again.";
    case "auth/popup-blocked":
      return "Your browser blocked the Google sign-in window. Please enable popups.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with this email using another sign-in method.";
    case "auth/network-request-failed":
      return "Network connection issue. Please check your internet connection.";
    default:
      return error.message || "Authentication failed. Please try again.";
  }
}

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "signin";
  const redirectTarget = searchParams.get("redirect") || "/chat";
  const isRequired =
    searchParams.get("required") === "true" ||
    searchParams.get("redirect") === "/chat";

  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [selectedDevice, setSelectedDevice] = useState<"trio" | "macbook" | "ipad" | "iphone">("trio");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeUser, setActiveUser] = useState<FirebaseUser | null>(null);

  // Track active session
  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setActiveUser(currentUser);
    });
  }, []);

  async function handleGoogleSignIn() {
    setError(null);
    setIsLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const credential = await signInWithPopup(auth, provider);

      try {
        await api.getCurrentBackendUser(credential.user);
      } catch {
        // Allow proceeding if backend is offline/starting up
      }

      router.replace(redirectTarget);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      try {
        await api.getCurrentBackendUser(credential.user);
      } catch {
        // Backend user sync fallback
      }
      router.replace(redirectTarget);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleEmailSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const cleanName = fullName.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      setError("Please enter your full name.");
      return;
    }
    if (!cleanEmail) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-type your password carefully.");
      return;
    }

    setIsLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      await updateProfile(credential.user, {
        displayName: cleanName,
      });

      try {
        await api.getCurrentBackendUser(credential.user);
      } catch {
        // Backend user sync fallback
      }

      router.replace(redirectTarget);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-teal-500 via-cyan-600 to-indigo-700 p-4 sm:p-6 lg:p-10 dark:from-[#06181b] dark:via-[#092226] dark:to-[#0c1222]">
      {/* Ambient Floating Glassmorphic Orbs */}
      <div className="pointer-events-none absolute -top-20 -left-20 size-80 rounded-full bg-teal-300/30 blur-3xl dark:bg-teal-500/10" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 size-96 rounded-full bg-purple-500/30 blur-3xl dark:bg-purple-600/15" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 size-48 rounded-full bg-cyan-300/20 blur-2xl dark:bg-cyan-400/10" />

      {/* Decorative Dot Matrix in Corner */}
      <div className="pointer-events-none absolute bottom-6 left-6 grid grid-cols-8 gap-1.5 opacity-40 sm:bottom-10 sm:left-10">
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} className="size-1.5 rounded-full bg-white/60" />
        ))}
      </div>

      {/* Top Controls: Return Home & Theme Toggle */}
      <div className="absolute top-5 right-5 z-20 flex items-center gap-3">
        <ThemeToggle />
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-white/30 active:scale-95"
          title="Return to Home"
        >
          <Home className="size-3.5" />
          <span>Home</span>
        </Link>
      </div>

      {/* Main Elevated Split-Card Container */}
      <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/50 bg-white/95 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:rounded-[36px] dark:border-white/10 dark:bg-[#18181b]/95 my-8">
        <div className="grid lg:grid-cols-12 min-h-[620px]">
          {/* Left Column: Multi-Device Ecosystem Showcase (MacBook, iPad, iPhone) */}
          <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-50 via-teal-50/50 to-indigo-50/40 p-6 sm:p-8 lg:col-span-6 lg:flex dark:from-neutral-900/90 dark:via-neutral-900/60 dark:to-neutral-950 border-r border-slate-100 dark:border-neutral-800/80">
            {/* Soft Floating Geometric Accents */}
            <div className="pointer-events-none absolute -top-6 -left-6 size-28 rotate-12 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 shadow-xs dark:bg-indigo-500/15" />
            <div className="pointer-events-none absolute bottom-12 -right-8 size-32 rounded-full bg-teal-500/15 blur-sm dark:bg-teal-400/10" />

            {/* Top Bar: Brand Badge & Interactive Device Switcher */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pb-2">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
                  <ShieldCheck className="size-4" />
                </span>
                <span className="text-xs font-bold tracking-wider text-slate-800 uppercase dark:text-white">
                  MediGuard Ecosystem
                </span>
              </div>

              {/* Device Selector Tabs */}
              <div className="inline-flex items-center gap-0.5 rounded-full border border-slate-200/90 bg-white/80 p-0.5 shadow-xs backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/80">
                <button
                  type="button"
                  onClick={() => setSelectedDevice("trio")}
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-semibold transition-all ${
                    selectedDevice === "trio"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white"
                  }`}
                  title="Show all devices"
                >
                  <Sparkles className="size-3" />
                  <span>Trio</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDevice("macbook")}
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-semibold transition-all ${
                    selectedDevice === "macbook"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white"
                  }`}
                  title="MacBook Pro"
                >
                  <Laptop className="size-3" />
                  <span>MacBook</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDevice("ipad")}
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-semibold transition-all ${
                    selectedDevice === "ipad"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white"
                  }`}
                  title="iPad Pro"
                >
                  <Tablet className="size-3" />
                  <span>iPad</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDevice("iphone")}
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-semibold transition-all ${
                    selectedDevice === "iphone"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white"
                  }`}
                  title="iPhone 16"
                >
                  <Smartphone className="size-3" />
                  <span>iPhone</span>
                </button>
              </div>
            </div>

            {/* Central Creative Device Showcase Area */}
            <div className="relative z-10 my-auto py-4 flex flex-col items-center justify-center min-h-[340px]">
              {/* Soothing Ambient Glow */}
              <div className="pointer-events-none absolute size-60 rounded-full bg-cyan-400/15 blur-3xl dark:bg-cyan-500/10 animate-relaxing-breathe" />

              {/* MODE 1: ECOSYSTEM TRIO */}
              {selectedDevice === "trio" && (
                <div className="relative w-full max-w-[430px] flex items-center justify-center animate-fade-in py-2">
                  {/* MacBook Pro (Centerpiece) */}
                  <div
                    onClick={() => setSelectedDevice("macbook")}
                    className="group relative w-[315px] sm:w-[345px] cursor-pointer transition-transform duration-300 hover:scale-[1.03]"
                    title="Click to view MacBook Pro console"
                  >
                    <img
                      src="/macbook.png"
                      alt="MediGuard AI Web Console on MacBook Pro"
                      className="w-full drop-shadow-2xl transition-all duration-300"
                    />
                  </div>

                  {/* iPad Pro (Left Layered Card) */}
                  <div
                    onClick={() => setSelectedDevice("ipad")}
                    className="group absolute -left-2 sm:-left-4 bottom-2 w-[160px] sm:w-[178px] cursor-pointer transition-all duration-300 hover:scale-105 hover:z-30 z-10"
                    title="Click to view iPad clinical interface"
                  >
                    <img
                      src="/ipad.png"
                      alt="MediGuard AI on iPad"
                      className="w-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.35)] transition-all duration-300"
                    />
                    <span className="absolute -bottom-2.5 left-2 inline-flex items-center gap-1 rounded-full bg-slate-900/90 px-2 py-0.5 text-[8.5px] font-bold text-white shadow-md backdrop-blur-md border border-white/10">
                      <Tablet className="size-2.5 text-cyan-400" /> iPad Clinical
                    </span>
                  </div>

                  {/* iPhone 16 Pro (Right Layered Card) */}
                  <div
                    onClick={() => setSelectedDevice("iphone")}
                    className="group absolute -right-2 sm:-right-4 bottom-0 w-[94px] sm:w-[104px] cursor-pointer transition-all duration-300 hover:scale-105 hover:z-30 z-20"
                    title="Click to view iPhone optical scanner"
                  >
                    <img
                      src="/iphone.png"
                      alt="MediGuard AI on iPhone 16"
                      className="w-full drop-shadow-[0_20px_35px_rgba(0,0,0,0.4)] transition-all duration-300"
                    />
                    <span className="absolute -bottom-2.5 right-1 inline-flex items-center gap-1 rounded-full bg-slate-900/90 px-2 py-0.5 text-[8.5px] font-bold text-white shadow-md backdrop-blur-md border border-white/10">
                      <Smartphone className="size-2.5 text-emerald-400" /> Mobile Lens
                    </span>
                  </div>
                </div>
              )}

              {/* MODE 2: MACBOOK PRO DETAILED */}
              {selectedDevice === "macbook" && (
                <div className="relative w-full max-w-[390px] flex flex-col items-center justify-center animate-fade-in">
                  <div className="relative w-full transition-transform duration-300 hover:scale-[1.02]">
                    <img
                      src="/macbook.png"
                      alt="MediGuard AI Desktop Web Console on MacBook Pro"
                      className="w-full drop-shadow-2xl"
                    />
                  </div>
                  <div className="mt-4 w-full rounded-2xl border border-slate-200/80 bg-white/95 p-3.5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/95">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Laptop className="size-3.5 text-indigo-600 dark:text-indigo-400" />
                        MacBook Pro · Web Console
                      </span>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9.5px] font-bold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                        Multi-Source Pipeline
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-neutral-400 leading-snug">
                      Responsive web console with indexed pharmaceutical records and evidence-grounded AI explanations.
                    </p>
                  </div>
                </div>
              )}

              {/* MODE 3: IPAD PRO DETAILED */}
              {selectedDevice === "ipad" && (
                <div className="relative w-full max-w-[370px] flex flex-col items-center justify-center animate-fade-in">
                  <div className="relative w-full max-w-[320px] transition-transform duration-300 hover:scale-[1.02]">
                    <img
                      src="/ipad.png"
                      alt="MediGuard AI Clinical Interface on iPad"
                      className="w-full drop-shadow-2xl"
                    />
                  </div>
                  <div className="mt-4 w-full rounded-2xl border border-slate-200/80 bg-white/95 p-3.5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/95">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Tablet className="size-3.5 text-cyan-600 dark:text-cyan-400" />
                        iPad Pro · Tablet Interface
                      </span>
                      <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[9.5px] font-bold text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                        Responsive Layout
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-neutral-400 leading-snug">
                      Touch-friendly interface with fast medicine lookups, detailed summaries, and accessible packaging reference tools.
                    </p>
                  </div>
                </div>
              )}

              {/* MODE 4: IPHONE 16 PRO DETAILED */}
              {selectedDevice === "iphone" && (
                <div className="relative w-full max-w-[370px] flex flex-col items-center justify-center animate-fade-in">
                  <div className="relative w-full max-w-[170px] transition-transform duration-300 hover:scale-[1.02]">
                    <img
                      src="/iphone.png"
                      alt="MediGuard AI Optical Scanner on iPhone 16"
                      className="w-full drop-shadow-2xl"
                    />
                  </div>
                  <div className="mt-4 w-full rounded-2xl border border-slate-200/80 bg-white/95 p-3.5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/95">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Smartphone className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                        iPhone 16 Pro · Pocket Scanner
                      </span>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9.5px] font-bold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                        Camera Scanner
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-neutral-400 leading-snug">
                      Fast browser-based 2D DataMatrix and barcode scanning to extract GTIN, lot, and expiry details directly from packaging.
                    </p>
                  </div>
                </div>
              )}

              {/* Multi-Device Feature Badges */}
              <div className="mt-5 flex flex-wrap justify-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-0.5 text-[10px] font-semibold text-slate-700 shadow-xs backdrop-blur-md dark:bg-neutral-800/80 dark:text-neutral-300">
                  <Laptop className="size-3 text-indigo-500" /> Web Console
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-0.5 text-[10px] font-semibold text-slate-700 shadow-xs backdrop-blur-md dark:bg-neutral-800/80 dark:text-neutral-300">
                  <Tablet className="size-3 text-cyan-500" /> Clinical Tablet
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-0.5 text-[10px] font-semibold text-slate-700 shadow-xs backdrop-blur-md dark:bg-neutral-800/80 dark:text-neutral-300">
                  <Smartphone className="size-3 text-emerald-500" /> Mobile Vision
                </span>
              </div>
            </div>

            {/* Bottom Note */}
            <div className="relative z-10 flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-neutral-400 pt-3 border-t border-slate-200/60 dark:border-neutral-800">
              <span>Universal Multi-Device Pipeline</span>
              <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                v2.4 SECURE
              </span>
            </div>
          </div>

          {/* Right Column: Authentication Panel (Sign In & Account Creation) */}
          <div className="flex flex-col justify-between p-6 sm:p-10 lg:col-span-6">
            <div>
              {/* Brand Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 text-white shadow-xs">
                    <ShieldCheck className="size-5" />
                  </div>
                  <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                    MediGuard<span className="text-indigo-600 dark:text-indigo-400"> AI</span>
                  </span>
                </div>

                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                  {mode === "signin" ? "Sign In" : "Register"}
                </span>
              </div>

              {/* Title & Subtitle */}
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                {mode === "signin" ? "Welcome Here!" : "Create an Account"}
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed dark:text-neutral-400">
                {mode === "signin"
                  ? "Sign in to access your intelligent medicine assistant and clinical packaging tools."
                  : "Join MediGuard AI to inspect medication packaging, verify batches, and safeguard patient health."}
              </p>

              {/* Active User Session Notice or Mandatory Auth Notice */}
              {activeUser ? (
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-indigo-200 bg-indigo-50/90 p-3.5 text-xs text-indigo-950 shadow-xs dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-200 animate-fade-in">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span className="truncate">
                      Currently signed in as <strong className="font-semibold">{activeUser.email || activeUser.displayName || "User"}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={redirectTarget}
                      className="rounded-lg bg-indigo-600 px-3 py-1.5 font-semibold text-white transition-all hover:bg-indigo-500 active:scale-95"
                    >
                      Continue to Chat
                    </Link>
                    <button
                      type="button"
                      onClick={async () => {
                        await signOut(auth);
                        setActiveUser(null);
                      }}
                      className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-semibold text-slate-700 transition-all hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 active:scale-95"
                    >
                      <LogOut className="size-3 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : isRequired ? (
                <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-900 shadow-xs dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200 animate-fade-in">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 mt-0.5">
                    <Lock className="size-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-amber-950 dark:text-amber-200">
                      Sign In Required to Access Chat
                    </p>
                    <p className="mt-0.5 text-[11.5px] leading-relaxed text-amber-800/90 dark:text-amber-300/80">
                      Please sign in or create an account to access the MediGuard AI Assistant and clinical verification tools.
                    </p>
                  </div>
                </div>
              ) : null}

              {/* Tab Selector: Sign In vs Create Account */}
              <div className="mt-5 flex rounded-xl bg-slate-100 p-1 dark:bg-neutral-800/80">
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setError(null);
                  }}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                    mode === "signin"
                      ? "bg-white text-slate-900 shadow-xs dark:bg-neutral-700 dark:text-white"
                      : "text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError(null);
                  }}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                    mode === "signup"
                      ? "bg-white text-slate-900 shadow-xs dark:bg-neutral-700 dark:text-white"
                      : "text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white"
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="mt-4 animate-fade-in rounded-xl border border-rose-200 bg-rose-50/90 p-3 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
                  <p className="font-semibold">Authentication Notice</p>
                  <p className="mt-0.5">{error}</p>
                </div>
              )}

              {/* Google Sign-In Button */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl border border-slate-300/80 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 shadow-xs transition-all duration-200 hover:scale-[1.01] hover:border-slate-400 hover:bg-slate-50/80 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700/80"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full dark:via-white/10" />

                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="size-4 animate-spin rounded-full border-2 border-slate-400 border-t-indigo-600" />
                      <span>Connecting...</span>
                    </div>
                  ) : (
                    <>
                      {/* Google 4-Color SVG Icon */}
                      <svg className="size-4 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>
                        {mode === "signin"
                          ? "Continue with Google"
                          : "Sign up with Google"}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* OR Divider */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="w-full border-t border-slate-200 dark:border-neutral-800" />
                <span className="absolute bg-white px-2.5 text-[10px] font-medium tracking-wider text-slate-400 uppercase dark:bg-[#18181b] dark:text-neutral-400">
                  or with email
                </span>
              </div>

              {/* Form Content: Sign In or Create Account */}
              {mode === "signin" ? (
                /* SIGN IN FORM */
                <form onSubmit={handleEmailSignIn} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                      Email Address
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="pointer-events-none absolute left-3 size-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@hospital.org"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pr-3 pl-9 text-xs sm:text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-850 dark:text-white dark:focus:border-indigo-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                      Password
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="pointer-events-none absolute left-3 size-4 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pr-10 pl-9 text-xs sm:text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-850 dark:text-white dark:focus:border-indigo-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-indigo-600 py-2.5 px-4 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:bg-indigo-700 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                  >
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        <span>Signing In...</span>
                      </div>
                    ) : (
                      <>
                        <span>Sign In to MediGuard</span>
                        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* CREATE ACCOUNT FORM */
                <form onSubmit={handleEmailSignUp} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                      Full Name
                    </label>
                    <div className="relative flex items-center">
                      <User className="pointer-events-none absolute left-3 size-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Dr. Sarah Chen"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pr-3 pl-9 text-xs sm:text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-850 dark:text-white dark:focus:border-indigo-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                      Email Address
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="pointer-events-none absolute left-3 size-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="sarah.chen@hospital.org"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pr-3 pl-9 text-xs sm:text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-850 dark:text-white dark:focus:border-indigo-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                      Password (min. 8 characters)
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="pointer-events-none absolute left-3 size-4 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pr-10 pl-9 text-xs sm:text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-850 dark:text-white dark:focus:border-indigo-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                      Re-type Password
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="pointer-events-none absolute left-3 size-4 text-slate-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pr-10 pl-9 text-xs sm:text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-850 dark:text-white dark:focus:border-indigo-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200"
                        title={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-indigo-600 py-2.5 px-4 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:bg-indigo-700 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                  >
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      <>
                        <Sparkles className="size-4 text-indigo-200" />
                        <span>Create Account</span>
                        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Switch Mode Prompt */}
              <div className="mt-4 text-center text-xs text-slate-600 dark:text-neutral-400">
                {mode === "signin" ? (
                  <p>
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signup");
                        setError(null);
                      }}
                      className="font-bold text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                      Create one
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signin");
                        setError(null);
                      }}
                      className="font-bold text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </div>

              {/* Security Features */}
              <div className="mt-6 space-y-1.5 border-t border-slate-100 pt-4 text-[11px] text-slate-500 dark:border-neutral-800 dark:text-neutral-400">
                <div className="flex items-center gap-2">
                  <Lock className="size-3.5 text-emerald-500" />
                  <span>256-bit Firebase Encrypted Authentication</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="size-3.5 text-indigo-500" />
                  <span>HIPAA & Patient Data Privacy Standards</span>
                </div>
              </div>
            </div>

            {/* Footer Legal Disclaimer */}
            <div className="mt-6 pt-3 border-t border-slate-100 text-center text-[10.5px] text-slate-400 dark:border-neutral-800 dark:text-neutral-400">
              <p>
                By signing in or registering, you agree to our{" "}
                <Link
                  href="/about"
                  className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/about"
                  className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
          <div className="size-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}

