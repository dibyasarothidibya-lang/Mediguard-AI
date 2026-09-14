"use client";

import { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Database,
  QrCode,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  ScanText,
  Check,
  X,
  FileCheck2,
} from "lucide-react";

export function HeroScannerDemo() {
  const [activeTab, setActiveTab] = useState<"authentic" | "anomaly">("authentic");
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  function handleTouchStart(e: React.TouchEvent) {
    setTouchStartX(e.touches[0].clientX);
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 40) {
      setActiveTab("anomaly");
    } else if (diff < -40) {
      setActiveTab("authentic");
    }
    setTouchStartX(null);
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 p-6 sm:p-8 text-slate-900 shadow-xl shadow-slate-900/5 backdrop-blur-xl lg:col-span-2 dark:border-neutral-800/90 dark:bg-[#111113] dark:text-white select-none transition-all duration-300"
    >
      {/* Soothing Breathing Ambient Backglow */}
      <div className="pointer-events-none absolute -top-24 -left-24 size-64 rounded-full bg-indigo-500/15 blur-3xl dark:bg-indigo-500/20 animate-relaxing-breathe" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 size-64 rounded-full bg-cyan-500/15 blur-3xl dark:bg-cyan-500/15 animate-relaxing-breathe" />

      {/* Top Header: Platform HUD Beacon & Sample Switcher */}
      <div className="relative z-10 mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4 dark:border-neutral-800/80">
        <div className="flex items-center gap-2.5">
          <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-neutral-300">
            Multimodal Optical Inspection HUD
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400">
            Swipe ⟷ or Click
          </span>
        </div>

        {/* Tab switcher with fluid sliding indicator */}
        <div className="relative flex rounded-xl bg-slate-100 p-1 text-xs border border-slate-200/70 dark:bg-neutral-900 dark:border-neutral-800 w-[270px]">
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-white shadow-xs transition-transform duration-300 cubic-bezier(0.16,1,0.3,1) dark:bg-neutral-800 ${
              activeTab === "authentic" ? "left-1" : "left-[calc(50%+2px)]"
            }`}
          />
          <button
            type="button"
            onClick={() => setActiveTab("authentic")}
            className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 font-semibold transition-colors duration-200 ${
              activeTab === "authentic"
                ? "text-slate-900 dark:text-white"
                : "text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white"
            }`}
          >
            <Check className="size-3 text-emerald-500" />
            <span>Verified Sample</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("anomaly")}
            className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 font-semibold transition-colors duration-200 ${
              activeTab === "anomaly"
                ? "text-rose-600 dark:text-rose-400"
                : "text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white"
            }`}
          >
            <AlertTriangle className="size-3 text-amber-500" />
            <span>Tampered Sample</span>
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      {activeTab === "authentic" ? (
        <div className="relative z-10 grid gap-6 lg:grid-cols-12 items-center">
          {/* Left Column: Simulated Visual Packaging & Computer Vision Bounding Boxes */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-900 via-slate-950 to-neutral-950 p-5 text-white shadow-lg lg:col-span-6 dark:border-neutral-700/80">
            {/* Animated Laser Scanning Beam */}
            <div className="pointer-events-none absolute inset-x-0 top-1/3 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse shadow-[0_0_10px_#22d3ee] z-20" />

            {/* Packaging Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-md bg-indigo-600 text-[10px] font-bold">
                  Rx
                </span>
                <div>
                  <h4 className="text-xs font-bold tracking-tight text-white">Amoxicillin 500mg</h4>
                  <p className="text-[10px] text-slate-400">Oral Capsules · IP Standard</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="size-3" /> GS1 AUTHENTIC
              </span>
            </div>

            {/* Packaging Mockup: Blister Pack & AI Vision Reticles */}
            <div className="my-4 grid grid-cols-3 gap-2 p-2 rounded-xl bg-slate-850/60 border border-slate-800">
              {/* 6 Simulated Blister Bubbles */}
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex h-10 items-center justify-center rounded-lg bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/60 shadow-inner"
                >
                  <div className="h-4 w-7 rounded-full bg-gradient-to-r from-indigo-400/70 via-cyan-300/80 to-indigo-500/70 shadow-xs opacity-90" />
                </div>
              ))}
            </div>

            {/* AI Computer Vision Bounding Reticles */}
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              {/* Box 1: Barcode Reticle */}
              <div className="relative rounded-lg border border-cyan-500/50 bg-cyan-950/30 p-2 text-cyan-200">
                <span className="absolute -top-2 left-2 rounded-sm bg-cyan-600 px-1 text-[8px] font-bold text-white uppercase">
                  GS1 DataMatrix AI(01)
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <QrCode className="size-5 text-cyan-400 shrink-0" />
                  <div className="font-mono text-[9px] truncate">
                    <span>GTIN: 08901030384102</span>
                  </div>
                </div>
              </div>

              {/* Box 2: Optical Expiry OCR Reticle */}
              <div className="relative rounded-lg border border-emerald-500/50 bg-emerald-950/30 p-2 text-emerald-200">
                <span className="absolute -top-2 left-2 rounded-sm bg-emerald-600 px-1 text-[8px] font-bold text-white uppercase">
                  OCR Text Match
                </span>
                <div className="mt-0.5 font-mono text-[9px] flex justify-between items-center">
                  <span>EXP: 11/2028</span>
                  <span className="font-bold text-emerald-400">VALID</span>
                </div>
              </div>
            </div>

            {/* Bottom Manufacturer Registry Strip */}
            <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-2">
              <span>MFR: Square Pharmaceuticals Ltd.</span>
              <span className="font-mono text-emerald-400 font-semibold">DGDA #102-04</span>
            </div>
          </div>

          {/* Right Column: Telemetry Analysis Pipeline Feed */}
          <div className="space-y-3 lg:col-span-6">
            {/* Step 1 */}
            <div className="group rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5 transition-all hover:bg-white hover:shadow-xs dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:bg-neutral-850">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                    <ScanText className="size-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Optical Typography OCR
                  </span>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                  99.4% Match
                </span>
              </div>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed dark:text-neutral-400">
                Extracted brand typography, dosage (500mg), and physical expiry stamp without distortion from foil glare.
              </p>
            </div>

            {/* Step 2 */}
            <div className="group rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5 transition-all hover:bg-white hover:shadow-xs dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:bg-neutral-850">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400">
                    <QrCode className="size-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    GS1 2D DataMatrix Decoding
                  </span>
                </div>
                <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400">
                  38ms Decode
                </span>
              </div>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed dark:text-neutral-400">
                Decoded cryptographically encoded batch <code className="font-mono text-[11px] text-slate-800 dark:text-slate-200">B2026-X89</code> matching the printed expiration date.
              </p>
            </div>

            {/* Step 3 */}
            <div className="group rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5 transition-all hover:bg-white hover:shadow-xs dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:bg-neutral-850">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                    <Database className="size-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    DGDA & FDA Registry Handshake
                  </span>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                  Active Sync
                </span>
              </div>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed dark:text-neutral-400">
                Verified against national gazette filings. Drug formulation is fully active, licensed, and safe to dispense.
              </p>
            </div>

            {/* Overall Verdict Banner */}
            <div className="flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-50/70 p-3.5 dark:border-emerald-500/20 dark:bg-emerald-950/40">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                    Authentic Formulation Confirmed
                  </p>
                  <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80">
                    Zero physical-to-digital tampering detected
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-black tracking-tight text-emerald-600 dark:text-emerald-400">
                  99.8%
                </span>
                <p className="text-[9px] font-bold text-emerald-600/80 uppercase">Safety Score</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* TAMPERED ANOMALY VIEW */
        <div className="relative z-10 grid gap-6 lg:grid-cols-12 items-center">
          {/* Left Column: Packaging Tamper Alert View */}
          <div className="relative overflow-hidden rounded-2xl border border-rose-500/50 bg-gradient-to-br from-slate-900 via-slate-950 to-neutral-950 p-5 text-white shadow-lg lg:col-span-6 dark:border-rose-500/40">
            {/* Warning Laser Beam */}
            <div className="pointer-events-none absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent animate-pulse shadow-[0_0_10px_#f43f5e] z-20" />

            {/* Packaging Header with Warning Badge */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-md bg-amber-600 text-[10px] font-bold">
                  Rx
                </span>
                <div>
                  <h4 className="text-xs font-bold tracking-tight text-white">Azithromycin 250mg</h4>
                  <p className="text-[10px] text-slate-400">Film-coated tablets · Suspect Stock</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/40 animate-pulse">
                <AlertTriangle className="size-3" /> TAMPER ALERT
              </span>
            </div>

            {/* Packaging Mockup */}
            <div className="my-4 grid grid-cols-3 gap-2 p-2 rounded-xl bg-slate-850/60 border border-rose-900/40">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex h-10 items-center justify-center rounded-lg bg-gradient-to-b from-slate-800 to-slate-900 border border-rose-500/20 shadow-inner"
                >
                  <div className="h-4 w-7 rounded-full bg-gradient-to-r from-amber-500/50 via-rose-400/60 to-amber-600/50 shadow-xs" />
                </div>
              ))}
            </div>

            {/* AI Bounding Boxes Showing The Discrepancy */}
            <div className="space-y-2 text-[10px]">
              {/* Printed Altered Expiry */}
              <div className="relative rounded-lg border border-rose-500/70 bg-rose-950/40 p-2 text-rose-200">
                <span className="absolute -top-2 left-2 rounded-sm bg-rose-600 px-1 text-[8px] font-bold text-white uppercase">
                  Optical OCR Detected
                </span>
                <div className="mt-0.5 flex justify-between items-center font-mono">
                  <span>Physical Printed Expiry:</span>
                  <span className="font-bold text-rose-400">08/2027 (Tampered)</span>
                </div>
              </div>

              {/* Cryptographic 2D Barcode Payload */}
              <div className="relative rounded-lg border border-amber-500/50 bg-amber-950/30 p-2 text-amber-200">
                <span className="absolute -top-2 left-2 rounded-sm bg-amber-600 px-1 text-[8px] font-bold text-white uppercase">
                  Hardware GS1 Barcode
                </span>
                <div className="mt-0.5 flex justify-between items-center font-mono">
                  <span>Cryptographic Expiry:</span>
                  <span className="font-bold text-amber-400">01/2024 (EXPIRED)</span>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[10px] text-rose-400 border-t border-slate-800/80 pt-2 font-semibold">
              <span>Discrepancy: Expired medication relabeled</span>
              <span className="font-mono">FLAG: CRITICAL</span>
            </div>
          </div>

          {/* Right Column: Tamper Alert Investigation */}
          <div className="space-y-3 lg:col-span-6">
            <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 dark:border-rose-900/60 dark:bg-rose-950/40">
              <div className="flex items-center gap-2">
                <ShieldAlert className="size-5 text-rose-600 dark:text-rose-400" />
                <h5 className="text-xs font-bold text-rose-900 dark:text-rose-200">
                  Relabeled Expired Medication Detected
                </h5>
              </div>
              <p className="mt-2 text-xs text-rose-800/90 leading-relaxed dark:text-rose-300/90">
                The optical OCR pipeline detected packaging print showing <strong className="underline">08/2027</strong>, but the GS1 DataMatrix signed payload encodes <strong className="underline">01/2024</strong>. This packaging was relabeled to disguise expired formulation.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5 dark:border-neutral-800 dark:bg-neutral-900/60">
              <span className="text-[11px] font-bold text-slate-700 uppercase dark:text-neutral-300">
                Automated Safety Protocol
              </span>
              <ul className="mt-2 space-y-1.5 text-xs text-slate-600 dark:text-neutral-400">
                <li className="flex items-center gap-2">
                  <X className="size-3.5 text-rose-500 shrink-0" />
                  <span>Immediate dispensation lockout triggered</span>
                </li>
                <li className="flex items-center gap-2">
                  <FileCheck2 className="size-3.5 text-indigo-500 shrink-0" />
                  <span>DGDA incident report draft compiled with lot #B104-Z</span>
                </li>
              </ul>
            </div>

            {/* Tampered Verdict Bar */}
            <div className="flex items-center justify-between rounded-2xl border border-rose-500/30 bg-rose-50/70 p-3.5 dark:border-rose-500/20 dark:bg-rose-950/40">
              <div>
                <p className="text-xs font-bold text-rose-900 dark:text-rose-300">
                  Verdict: DO NOT DISPENSE
                </p>
                <p className="text-[11px] text-rose-700/80 dark:text-rose-400/80">
                  Quarantine immediately and notify supplier
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black tracking-tight text-rose-600 dark:text-rose-400">
                  12.4%
                </span>
                <p className="text-[9px] font-bold text-rose-600/80 uppercase">Compromised</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

