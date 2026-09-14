import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  QrCode,
  Database,
  ShieldAlert,
  HeartPulse,
  FileCheck,
  ArrowRight,
  Sparkles,
  Cpu,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

const FEATURES_LIST = [
  {
    icon: QrCode,
    badge: "Browser-Based Decoding",
    title: "GS1 DataMatrix & Barcode Reader",
    description:
      "Extracts product identifiers, lot numbers, and expiration details from 2D GS1 DataMatrix codes, QR codes, and linear barcodes directly in the browser without sending camera feeds to external servers.",
    specs: [
      "Client-side optical barcode decoding",
      "GS1 standard DataMatrix compliance",
      "Direct camera capture & manual upload",
    ],
  },
  {
    icon: Database,
    badge: "Dual-Source Pipeline",
    title: "Local Catalogue & openFDA Evidence",
    description:
      "Combines a structured DGDA-aligned local medicine catalogue for domestic brand and generic lookups with the live openFDA Drug Label API for official international pharmaceutical documentation.",
    specs: [
      "DGDA-aligned generic & brand indexing",
      "Live openFDA Drug Label API connector",
      "Extensible trusted-source architecture",
    ],
  },
  {
    icon: Cpu,
    badge: "Evidence-Grounded AI",
    title: "Controlled AI Explanation Engine",
    description:
      "Uses pre-retrieved medicine records as the strict foundation for model outputs, reducing unsupported AI claims and keeping explanations grounded in verified pharmaceutical data.",
    specs: [
      "Evidence retrieved before generation",
      "Google Gemini 2.5 Flash orchestration",
      "Structured JSON output contract",
    ],
  },
  {
    icon: FileCheck,
    badge: "Server-Verified References",
    title: "Controlled Citation Integrity",
    description:
      "Citation identifiers are minted, validated, and rendered by the backend. The model cannot invent arbitrary links, ensuring all sources lead to official documentation.",
    specs: [
      "Backend-controlled citation identifiers",
      "Arbitrary URL hallucination filtering",
      "Full source metadata & listing status",
    ],
  },
  {
    icon: ShieldAlert,
    badge: "Safety & Guardrails",
    title: "Domain Filtering & Defensive Throttling",
    description:
      "Classifies incoming user questions to maintain strict medicine verification boundaries, applying server-side rate limiting and graceful failure handling.",
    specs: [
      "Domain query classifier",
      "Token-bucket rate limiting",
      "Resilient timeout & error handling",
    ],
  },
  {
    icon: HeartPulse,
    badge: "Patient-First Clarity",
    title: "Plain-Language Medicine Summaries",
    description:
      "Translates dense pharmaceutical inserts and technical packaging terminology into clear explanations of active ingredients, general precautions, and proper storage.",
    specs: [
      "Accessible active ingredient breakdowns",
      "General precautions & storage guidance",
      "Prominent clinician-verification notices",
    ],
  },
];

export default function Features() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 dark:bg-neutral-950 dark:text-white">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <Sparkles className="size-3.5" /> Engine Capabilities
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Medication Safety Tools
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg dark:text-neutral-400">
              Built to help users cross-reference medicine information against available evidence and understand pharmaceutical packaging.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES_LIST.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-slate-50/60 p-8 transition-all duration-300 hover:border-indigo-500/40 hover:bg-white hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:bg-neutral-900"
                >
                  <div>
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-950 dark:text-indigo-400">
                      <Icon className="size-6" />
                    </div>

                    <span className="mt-5 inline-block font-mono text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {feat.badge}
                    </span>

                    <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                      {feat.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-neutral-400">
                      {feat.description}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-slate-200/80 pt-5 dark:border-neutral-800">
                    <ul className="space-y-2 text-xs text-slate-700 dark:text-neutral-300">
                      {feat.specs.map((spec) => (
                        <li key={spec} className="flex items-center gap-2">
                          <CheckCircle2 className="size-3.5 text-indigo-500 shrink-0" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Call to Action */}
          <div className="mt-20 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 p-8 text-center text-white sm:p-14">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Experience the verification assistant live
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-300 sm:text-base">
              Test queries about medicine packaging, scan GS1 barcodes, and receive evidence-grounded insights.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-indigo-600"
              >
                Launch MediGuard Assistant <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
