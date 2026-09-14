import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  QrCode,
  ScanText,
  Database,
  ShieldAlert,
  HeartPulse,
  FileCheck,
  ArrowRight,
  Sparkles,
  Layers,
  Cpu,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

const FEATURES_LIST = [
  {
    icon: QrCode,
    badge: "Sub-50ms Decode Latency",
    title: "Multi-Carrier Barcode & GS1 Decoder",
    description:
      "High-speed extraction of GS1 Application Identifiers across 2D GS1 DataMatrix, standard QR codes, and 1D EAN/UPC linear barcodes. Instantly decodes GTIN (01), Serial Number (21), Expiration Date (17), and Lot / Batch Number (10).",
    specs: [
      "Hardware-accelerated capture",
      "Full GS1 AI syntax parser",
      "Support for curved & blister packaging",
    ],
  },
  {
    icon: ScanText,
    badge: "Neural Vision OCR",
    title: "Multimodal Packaging OCR & Anomaly Vision",
    description:
      "Advanced optical character recognition trained to handle foil reflections, typography defects, and skewed blister-pack geometry. Isolates printed brand names, active molecules, dosage strengths (e.g., 500mg), and regulatory DAR numbers.",
    specs: [
      "Glare and perspective skew mitigation",
      "Multi-field dosage extraction",
      "Packaging seal anomaly detection",
    ],
  },
  {
    icon: Database,
    badge: "Live Regulatory Sync",
    title: "Direct Pharmaceutical Registry Cross-Check",
    description:
      "Real-time synchronization against national and international pharmaceutical gazettes, including the Directorate General of Drug Administration (DGDA) and US FDA National Drug Code (NDC) Directory.",
    specs: [
      "Live market authorization status",
      "Licensed manufacturer identity matching",
      "Instant withdrawn/recalled drug alerts",
    ],
  },
  {
    icon: ShieldAlert,
    badge: "Anti-Counterfeit Protection",
    title: "Dual-Stream Verification & Tamper Detection",
    description:
      "Continuously reconciles physical printed label typography against digital 2D barcode payloads. Automatically raises high-priority alerts when printed expiration dates or lot numbers do not match digital signatures.",
    specs: [
      "Printed vs encoded payload mismatch detector",
      "Duplicate serialization scan checks",
      "Altered packaging vector analysis",
    ],
  },
  {
    icon: HeartPulse,
    badge: "Clinical Intelligence",
    title: "Clinical Drug Intelligence & RxNorm Mapping",
    description:
      "Maps active pharmaceutical molecules via NLM RxNorm and openFDA endpoints. Evaluates drug-drug interactions, pregnancy advisories, boxed warnings, and food/alcohol contraindications.",
    specs: [
      "RxNorm clinical ontology aggregation",
      "Boxed warnings & contraindications",
      "Polypharmacy risk evaluation",
    ],
  },
  {
    icon: FileCheck,
    badge: "Patient-First Clarity",
    title: "Plain-Language Patient Summaries",
    description:
      "Translates complex pharmacological inserts into easy-to-understand guidance. Clearly explains therapeutic uses, proper administration directions, missed dosage protocols, and optimal storage conditions.",
    specs: [
      "Jargon-free therapeutic explanation",
      "Optimal temperature & storage instructions",
      "Direct regulatory incident reporting flow",
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
              Explore the multi-source verification pipeline engineered to ensure every medicine you examine is authentic, verified, and clinically transparent.
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
              Test queries about medicine packaging, scan GS1 barcodes, and receive instant clinical insights.
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
