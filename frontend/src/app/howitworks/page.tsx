import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Camera,
  Cpu,
  Database,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
  FileSearch,
} from "lucide-react";
import Link from "next/link";

const PIPELINE_STAGES = [
  {
    step: "01",
    name: "Capture & Preprocessing",
    icon: Camera,
    subtitle: "Perspective correction & Dual-ROI segmentation",
    description:
      "The user captures packaging via camera or uploaded image. Edge-detection algorithms isolate the packaging plane, correcting skew, perspective distortion, and blister-pack flash glare. The frame is segmented into two parallel processing streams: 2D data carrier zone (GS1 DataMatrix / Barcode) and typography zone (printed text).",
    details: [
      "Sub-50ms edge detection & plane isolation",
      "Adaptive contrast & glare suppression on foil blister packs",
      "Dual-ROI splitting for concurrent parallel processing",
    ],
  },
  {
    step: "02",
    name: "Optical Extraction & Carrier Parsing",
    icon: Cpu,
    subtitle: "GS1 AI syntax parsing & typography OCR",
    description:
      "A high-speed 2D decoder parses standard GS1 Application Identifiers: GTIN (01), Serial Number (21), Expiration Date (17), and Batch / Lot (10). In parallel, an optical character recognition (OCR) engine extracts printed brand names, active molecules, dosage strengths (e.g. 500mg), and DAR regulatory codes.",
    details: [
      "GS1-128 and GS1 DataMatrix standard compliance",
      "Optical character recognition tuned for medical typography",
      "Normalization of brand and generic molecule names",
    ],
  },
  {
    step: "03",
    name: "Multi-Vector Cross-Verification",
    icon: Database,
    subtitle: "Internal consistency, registry check & duplicate velocity",
    description:
      "The extracted data passes through three rigorous validation layers: (1) Internal Consistency: confirms printed batch and expiry match the digital 2D barcode payload; (2) Regulatory Sync: queries the DGDA Gazette and US FDA NDC Directory; (3) Velocity Analysis: flags duplicate serial scans across conflicting geographic vectors.",
    details: [
      "Physical vs digital mismatch detection (catches relabeled expired stock)",
      "Live DGDA & FDA National Drug Code validation",
      "Serial anomaly flagging for suspected counterfeit clones",
    ],
  },
  {
    step: "04",
    name: "Clinical Intelligence & Actionable Verdict",
    icon: ShieldCheck,
    subtitle: "RxNorm mapping, patient guidance & incident reporting",
    description:
      "Once verified, the engine maps the active molecules via NLM RxNorm and openFDA endpoints. It delivers a consolidated status HUD: Authenticity Status (Authentic, Tampered, or Expired), plain-language dosage instructions, boxed warnings, food/drug interactions, and an immediate incident reporting pathway.",
    details: [
      "Clear status HUD: Authentic, Unverified, or Suspicious",
      "Drug-drug interactions and critical boxed warnings",
      "One-click incident submission for regulatory review",
    ],
  },
];

export default function HowItWorks() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 dark:bg-neutral-950 dark:text-white">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <Sparkles className="size-3.5" /> Optical & Clinical Pipeline
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              How MediGuard AI Works
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg dark:text-neutral-400">
              Explore the 4-stage optical and clinical verification architecture engineered to ensure every medicine you evaluate is authentic, verified, and safe.
            </p>
          </div>

          {/* 4 Pipeline Stages */}
          <div className="mt-16 space-y-8">
            {PIPELINE_STAGES.map((stage, idx) => {
              const Icon = stage.icon;
              return (
                <div
                  key={stage.step}
                  className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-50/60 p-8 shadow-xs transition-all duration-300 hover:border-indigo-500/40 hover:bg-white hover:shadow-lg sm:p-10 dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:bg-neutral-900"
                >
                  <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                    {/* Left Step Header */}
                    <div className="lg:col-span-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">
                          {stage.step}
                        </span>
                        <div className="flex size-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                          <Icon className="size-5" />
                        </div>
                      </div>

                      <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        {stage.name}
                      </h3>
                      <p className="mt-1 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {stage.subtitle}
                      </p>
                    </div>

                    {/* Right Content */}
                    <div className="lg:col-span-8">
                      <p className="text-sm leading-relaxed text-slate-600 sm:text-base dark:text-neutral-400">
                        {stage.description}
                      </p>

                      <div className="mt-6 border-t border-slate-200/80 pt-5 dark:border-neutral-800">
                        <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                          Key Technical Safeguards:
                        </span>
                        <ul className="mt-3 grid gap-2 sm:grid-cols-2 text-xs font-medium text-slate-700 dark:text-neutral-300">
                          {stage.details.map((detail) => (
                            <li key={detail} className="flex items-start gap-2">
                              <CheckCircle2 className="size-4 text-indigo-500 shrink-0 mt-0.5" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Banner */}
          <div className="mt-20 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 p-8 text-center text-white sm:p-14">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Try the AI Assistant on your medicines
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-300 sm:text-base">
              Identify packaging labels, check potential drug interactions, and get clear plain-language guidance.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-indigo-600"
              >
                Open Assistant <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
