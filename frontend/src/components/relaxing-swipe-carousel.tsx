"use client";

import { useRef, useState, useEffect } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  QrCode,
  Pill,
} from "lucide-react";


interface VerifiedMedication {
  id: string;
  name: string;
  dosage: string;
  category: string;
  manufacturer: string;
  registryId: string;
  lot: string;
  safetyScore: string;
  carrier: string;
  verifiedAt: string;
}

const VERIFIED_MEDS: VerifiedMedication[] = [
  {
    id: "med-1",
    name: "Amoxicillin",
    dosage: "500mg Capsules",
    category: "Broad-Spectrum Antibiotic",
    manufacturer: "Square Pharmaceuticals Ltd.",
    registryId: "DGDA #102-04 · Gazette Active",
    lot: "B2026-X89",
    safetyScore: "99.8%",
    carrier: "GS1 DataMatrix",
    verifiedAt: "2s ago",
  },
  {
    id: "med-2",
    name: "Omeprazole",
    dosage: "20mg Delayed-Release",
    category: "Proton Pump Inhibitor",
    manufacturer: "Beximco Pharmaceuticals Ltd.",
    registryId: "US FDA NDC #68180-514",
    lot: "OMP-4410",
    safetyScore: "99.9%",
    carrier: "GS1 QR Code",
    verifiedAt: "12s ago",
  },
  {
    id: "med-3",
    name: "Metformin HCl",
    dosage: "850mg Extended-Release",
    category: "Oral Antidiabetic Agent",
    manufacturer: "Incepta Pharmaceuticals Ltd.",
    registryId: "DGDA #210-91 · Active License",
    lot: "MF-9901-B",
    safetyScore: "99.7%",
    carrier: "2D Composite",
    verifiedAt: "24s ago",
  },
  {
    id: "med-4",
    name: "Atorvastatin Calcium",
    dosage: "20mg Film-Coated",
    category: "HMG-CoA Reductase Statin",
    manufacturer: "Healthcare Pharmaceuticals Ltd.",
    registryId: "US FDA NDC #50458-140",
    lot: "AT-502-K",
    safetyScore: "99.9%",
    carrier: "GS1 DataMatrix",
    verifiedAt: "38s ago",
  },
  {
    id: "med-5",
    name: "Paracetamol",
    dosage: "650mg Extra Relief",
    category: "Analgesic & Antipyretic",
    manufacturer: "Opsonin Pharma Ltd.",
    registryId: "DGDA #011-33 · Valid Standard",
    lot: "PC-884-Z",
    safetyScore: "100%",
    carrier: "GS1 DataMatrix",
    verifiedAt: "52s ago",
  },
  {
    id: "med-6",
    name: "Azithromycin",
    dosage: "500mg Tablets",
    category: "Macrolide Antibacterial",
    manufacturer: "Renata Limited",
    registryId: "DGDA #304-12 · Gazette Active",
    lot: "AZ-108-M",
    safetyScore: "99.6%",
    carrier: "GS1 DataMatrix",
    verifiedAt: "1m ago",
  },
];

export function RelaxingSwipeCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  function checkScrollPosition() {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScrollPosition();
    el.addEventListener("scroll", checkScrollPosition, { passive: true });
    return () => el.removeEventListener("scroll", checkScrollPosition);
  }, []);

  function handleScroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const scrollAmount = 360;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }

  function handleMouseDown(e: React.MouseEvent) {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.6;
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  }

  function handleMouseUp() {
    setIsDragging(false);
  }

  return (
    <div className="relative my-8 overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-b from-slate-50/70 via-white/80 to-slate-50/70 p-6 sm:p-8 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-neutral-800/80 dark:from-[#111113] dark:via-[#141416] dark:to-[#111113]">
      {/* Ambient Breathing Light Orbs */}
      <div className="pointer-events-none absolute -top-16 left-1/4 size-72 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-500/10 animate-relaxing-breathe" />
      <div className="pointer-events-none absolute -bottom-16 right-1/4 size-72 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/15 animate-relaxing-breathe" />

      {/* Header with Live Ticker Beacon & Swipe Controls */}
      <div className="relative z-10 mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-5 dark:border-neutral-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-neutral-400">
              Sample Indexed Records
            </span>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
              Evidence-Grounded AI
            </span>
          </div>
          <h3 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
            Supported Medicine Records
          </h3>
          <p className="mt-0.5 text-xs text-slate-600 dark:text-neutral-400">
            Swipe or drag through sample medicine records indexed from structured local and international pharmaceutical catalogues.
          </p>
        </div>

        {/* Carousel Navigation Buttons & Swipe Hint */}
        <div className="flex items-center gap-3">
          <span className="hidden md:inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
            <span className="text-indigo-500 font-bold">⟵</span> Swipe or Drag <span className="text-indigo-500 font-bold">⟶</span>
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              className="flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-xs transition-all hover:scale-105 hover:border-indigo-400 hover:text-indigo-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-indigo-500 dark:hover:text-white"
              title="Previous verification"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              className="flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-xs transition-all hover:scale-105 hover:border-indigo-400 hover:text-indigo-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-indigo-500 dark:hover:text-white"
              title="Next verification"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Swipeable Cards Container */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative z-10 flex gap-4 overflow-x-auto py-2 relaxing-snap-scroll ${
          isDragging ? "cursor-grabbing select-none" : "cursor-grab"
        }`}
      >
        {VERIFIED_MEDS.map((med) => (
          <div
            key={med.id}
            className="relaxing-snap-child group relative w-[310px] sm:w-[330px] shrink-0 rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 dark:border-neutral-800/80 dark:bg-neutral-900/90 dark:hover:border-indigo-500/40"
          >
            {/* Top Bar: Brand, Category, Live Verification Badge */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400 transition-transform duration-300 group-hover:scale-110">
                  <Pill className="size-4" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {med.name}
                  </h4>
                  <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                    {med.dosage}
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9.5px] font-bold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 shrink-0">
                <CheckCircle2 className="size-3" />
                Indexed
              </span>
            </div>

            <p className="mt-2.5 text-[11px] text-slate-500 dark:text-neutral-400">
              {med.category}
            </p>

            <div className="mt-3.5 space-y-1.5 rounded-xl bg-slate-50/70 p-2.5 text-[11px] text-slate-600 border border-slate-100 dark:bg-neutral-850/60 dark:text-neutral-400 dark:border-neutral-800/60">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-neutral-500">
                  Manufacturer
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[170px]">
                  {med.manufacturer}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-neutral-500">
                  Registry Sync
                </span>
                <span className="font-medium text-indigo-600 dark:text-indigo-400 truncate max-w-[170px]">
                  {med.registryId}
                </span>
              </div>

              <div className="flex justify-between items-center pt-1 border-t border-slate-200/60 dark:border-neutral-800/60">
                <span className="font-mono text-[10px] text-slate-400">
                  Lot: <strong className="text-slate-700 dark:text-slate-300">{med.lot}</strong>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 dark:text-neutral-400">
                  <QrCode className="size-3 text-cyan-500" /> {med.carrier}
                </span>
              </div>
            </div>

            <div className="mt-3.5 flex items-center justify-between text-[10px] font-semibold text-slate-400 dark:text-neutral-500">
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="size-3.5" /> Authentic Formulation
              </span>
              <span>Verified {med.verifiedAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
