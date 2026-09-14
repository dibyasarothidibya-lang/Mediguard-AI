import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import {
  ShieldCheck,
  QrCode,
  ScanText,
  Database,
  HeartPulse,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Zap,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 dark:bg-neutral-950 dark:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-8 sm:pt-14 sm:pb-10">
        {/* Soothing Ambient Breathing Glows */}
        <div className="pointer-events-none absolute -top-40 left-1/3 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/20 animate-relaxing-breathe" />
        <div className="pointer-events-none absolute top-1/3 -right-20 -z-10 size-80 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-500/10 animate-relaxing-breathe" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Hero Main Card */}
            <div className="flex flex-col justify-between rounded-3xl bg-indigo-50/70 p-8 sm:p-12 lg:col-span-2 dark:bg-indigo-950/30 dark:border dark:border-indigo-900/40">
              <div>
                <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-100/80 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-indigo-700 uppercase dark:bg-indigo-900/50 dark:text-indigo-300">
                  <span className="size-2 rounded-full bg-indigo-500 animate-pulse" />
                  AI PHARMA SAFETY PLATFORM
                </span>

                <h1 className="mb-6 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                  <span>Verify Your Medicines.</span>
                  <br />
                  <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-indigo-300 dark:to-cyan-400">
                    Stay Safer Every Day.
                  </span>
                </h1>

                <p className="mb-8 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-neutral-400">
                  Multi-source evidence platform combining GS1 DataMatrix barcode decoding, a DGDA-aligned local catalogue, and openFDA retrieval to support safer medicine verification.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/chat"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.03] hover:bg-indigo-500 hover:shadow-indigo-500/40 active:scale-95"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                  <Sparkles className="size-4 text-cyan-300 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                  <span>Open AI Assistant</span>
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/howitworks"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-700 backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:border-indigo-500 hover:text-indigo-600 hover:shadow-xs active:scale-95 dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-300 dark:hover:border-indigo-400 dark:hover:text-indigo-400"
                >
                  See How It Works
                </Link>
              </div>
            </div>

            {/* Right Metric Card */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 p-6 sm:p-7 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-neutral-800/90 dark:bg-neutral-900/80">
              {/* Subtle Ambient Glow */}
              <div className="pointer-events-none absolute -top-12 -right-12 size-44 rounded-full bg-indigo-500/10 blur-2xl dark:bg-indigo-500/15" />

              <div className="relative z-10 space-y-3.5">
                {/* Telemetry Header */}
                <div className="flex items-center justify-between pb-1">
                  <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase dark:text-neutral-500">
                    Platform Telemetry
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Audited
                  </span>
                </div>

                {/* Metric 1: Multi-Source Registry Coverage */}
                <div className="group rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-all duration-200 hover:border-indigo-200 hover:bg-white hover:shadow-xs dark:border-neutral-800/80 dark:bg-neutral-850/60 dark:hover:border-indigo-500/30 dark:hover:bg-neutral-800/70">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                        MULTI-SOURCE
                      </div>
                      <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        Registry Coverage
                      </div>
                      <p className="mt-1.5 text-xs font-medium text-slate-600 dark:text-neutral-400 leading-snug">
                        DGDA-aligned local medicine records<br />and openFDA public datasets
                      </p>
                    </div>
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-transform duration-200 group-hover:scale-110 dark:bg-indigo-950/80 dark:text-indigo-400">
                      <Database className="size-4.5" />
                    </div>
                  </div>
                </div>

                {/* Metric 2: Fast Lookup */}
                <div className="group rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-all duration-200 hover:border-cyan-200 hover:bg-white hover:shadow-xs dark:border-neutral-800/80 dark:bg-neutral-850/60 dark:hover:border-cyan-500/30 dark:hover:bg-neutral-800/70">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                        FAST LOOKUP
                      </div>
                      <p className="mt-1.5 text-xs font-medium text-slate-600 dark:text-neutral-400 leading-snug">
                        Optimized medicine search,<br />matching, and registry retrieval
                      </p>
                    </div>
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 transition-transform duration-200 group-hover:scale-110 dark:bg-cyan-950/80 dark:text-cyan-400">
                      <Zap className="size-4.5" />
                    </div>
                  </div>
                </div>

                {/* Metric 3: 3-TIER */}
                <div className="group rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-all duration-200 hover:border-emerald-200 hover:bg-white hover:shadow-xs dark:border-neutral-800/80 dark:bg-neutral-850/60 dark:hover:border-emerald-500/30 dark:hover:bg-neutral-800/70">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                        3-TIER
                      </div>
                      <p className="mt-1.5 text-xs font-medium text-slate-600 dark:text-neutral-400 leading-snug">
                        Medicine information, packaging analysis,<br />and registry-based verification
                      </p>
                    </div>
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-transform duration-200 group-hover:scale-110 dark:bg-emerald-950/80 dark:text-emerald-400">
                      <ShieldCheck className="size-4.5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Evidence-Grounded AI Disclaimer */}
              <div className="relative z-10 mt-4 rounded-2xl border border-indigo-100/80 bg-indigo-50/60 p-3.5 text-xs text-indigo-950 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-300">
                <div className="flex items-start gap-2.5">
                  <Sparkles className="size-4 text-indigo-600 shrink-0 mt-0.5 dark:text-indigo-400" />
                  <div className="leading-relaxed">
                    <p>
                      <strong className="font-semibold text-slate-900 dark:text-white">Evidence-Grounded AI:</strong>{" "}
                      Responses use retrieved medicine records and trusted source data where available.
                    </p>
                    <p className="mt-1 text-[11px] font-medium text-slate-600 dark:text-neutral-400">
                      Automated outputs may still be incorrect.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Multi-Source Registry & Evidence Status Strip */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-900/60">
            <div className="flex items-center gap-3">
              <span className="flex size-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Evidence Pipeline Active
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                Multi-Source Retrieval
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 dark:text-neutral-400">
              <span className="flex items-center gap-1.5"><Database className="size-3.5 text-indigo-500" /> DGDA-Aligned Catalogue</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="size-3.5 text-cyan-500" /> openFDA Live Connector</span>
              <span className="flex items-center gap-1.5"><QrCode className="size-3.5 text-emerald-500" /> GS1 DataMatrix &amp; Barcode</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview Section */}
      <section className="bg-slate-50/50 py-14 sm:py-18 dark:bg-neutral-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-16">
            <div className="grid items-end gap-8 lg:grid-cols-2">
              <div>
                <span className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
                  Medication Safety Tools
                </span>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
                  Built to Support Safer Medicine Verification
                </h2>
              </div>
              <div className="lg:text-right">
                <p className="text-base text-slate-600 dark:text-neutral-400">
                  From barcode parsing to evidence-grounded medicine explanations, MediGuard provides structured support for medicine transparency.
                </p>
                <Link
                  href="/features"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                >
                  View full feature specifications <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="group lucid-card-hover rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xs hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/5 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 dark:bg-indigo-950 dark:text-indigo-400">
                  <QrCode className="size-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                  GS1 DataMatrix Scanning
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-neutral-400">
                  Extracts GTIN, lot/batch numbers, serial numbers, and expiration dates across 2D DataMatrix and QR standards directly in the browser.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group lucid-card-hover rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xs hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/5 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 dark:bg-cyan-950 dark:text-cyan-400">
                  <ScanText className="size-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                  Packaging OCR & Anomaly Vision
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-neutral-400">
                  Optical character recognition isolates brand names, active ingredients, dosage strengths, and regulatory registration numbers from foil blister packs.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group lucid-card-hover rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xs hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 dark:bg-emerald-950 dark:text-emerald-400">
                  <Database className="size-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                  Regulatory Database Sync
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-neutral-400">
                  Live verification against DGDA (Directorate General of Drug Administration) gazettes and the US FDA National Drug Code Directory.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group lucid-card-hover rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xs hover:border-rose-500/40 hover:shadow-xl hover:shadow-rose-500/5 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 dark:bg-rose-950 dark:text-rose-400">
                  <AlertTriangle className="size-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                  Packaging &amp; Label Verification
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-neutral-400">
                  Cross-references packaging details, manufacturer names, and active ingredients against structured pharmaceutical records.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="group lucid-card-hover rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xs hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 dark:bg-amber-950 dark:text-amber-400">
                  <HeartPulse className="size-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                  Active Ingredient &amp; Safety Guidance
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-neutral-400">
                  Retrieves official openFDA drug label warnings, contraindications, and active ingredient details to support informed review.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="group lucid-card-hover rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xs hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/5 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 dark:bg-purple-950 dark:text-purple-400">
                  <FileCheck className="size-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                  Plain-Language Patient Guide
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-neutral-400">
                  Converts dense pharmacological documentation into readable summaries with dosage directions, storage rules, and side effects.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sleek CTA Banner */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 p-8 text-center text-white sm:p-14 shadow-2xl">
            <div className="relative z-10 mx-auto max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3.5 py-1 text-xs font-semibold text-indigo-300 ring-1 ring-indigo-500/30">
                <Sparkles className="size-3.5 text-cyan-300" /> Start Protecting Your Family Today
              </span>
              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                Ready to verify a medication?
              </h2>
              <p className="mt-3 text-sm text-slate-300 sm:text-base">
                Ask about indications, contraindications, and dosage instructions with our AI-powered clinical assistant.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href="/chat"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.03] hover:bg-indigo-500 hover:shadow-indigo-500/40 active:scale-95"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                  <span>Launch Assistant</span>
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/howitworks"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3.5 text-sm font-semibold text-slate-200 transition-all duration-200 hover:scale-[1.02] hover:bg-slate-800 hover:border-slate-600 active:scale-95"
                >
                  Learn the Pipeline
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
