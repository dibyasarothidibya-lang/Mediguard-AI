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
} from "lucide-react";
import Link from "next/link";

const PIPELINE_STAGES = [
  {
    step: "01",
    name: "Input & Barcode Decoding",
    icon: Camera,
    subtitle: "Manual packaging input & optical barcode capture",
    description:
      "Users submit medicine queries via conversation or scan packaging labels using their camera. The browser-based scanner decodes standard GS1 DataMatrix codes, QR codes, and linear barcodes to extract product identifiers, lot numbers, and expiry strings without sending video streams to external servers.",
    details: [
      "Client-side optical barcode & DataMatrix decoding",
      "Extraction of GTIN, lot/batch, and expiry strings",
      "Accessible browser camera capture or manual text input",
    ],
  },
  {
    step: "02",
    name: "Domain Guardrails & Entity Classification",
    icon: Cpu,
    subtitle: "Request validation & medicine entity extraction",
    description:
      "The backend evaluates incoming requests to verify they fall within supported pharmaceutical information boundaries. The system identifies brand names, active generic compounds, and dosage forms while refusing out-of-scope non-medical queries or clinical diagnosis requests.",
    details: [
      "Domain safety classifier prevents unsupported requests",
      "Identification of brand, generic, and strength entities",
      "Controlled fallback for requests requiring clinical doctors",
    ],
  },
  {
    step: "03",
    name: "Multi-Source Evidence Coordination",
    icon: Database,
    subtitle: "DGDA-aligned catalogue & live openFDA queries",
    description:
      "The Evidence Coordinator queries two complementary pharmaceutical repositories: the DGDA-aligned local catalogue for domestic market records and the live openFDA API for official drug labels. All retrieved records are treated as candidate references, never as definitive proof of physical medicine authenticity.",
    details: [
      "Structured DGDA-aligned local catalogue lookup",
      "Live openFDA Drug Label API connector",
      "Candidate match status (no physical authenticity claims)",
    ],
  },
  {
    step: "04",
    name: "Evidence-Grounded Interpretation",
    icon: ShieldCheck,
    subtitle: "Strict prompt contracts & verified citation references",
    description:
      "Retrieved records are assembled into a structured prompt contract. Google Gemini summarizes active ingredients, indications, and general precautions based strictly on the retrieved evidence. Every citation is validated by the backend before the response is delivered.",
    details: [
      "Evidence-first assembly reduces unsupported AI claims",
      "Server-minted citation validation & arbitrary link filtering",
      "Mandatory clinical consultation disclaimers on every output",
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
              <Sparkles className="size-3.5" /> Optical &amp; Evidence Pipeline
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              How MediGuard AI Works
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg dark:text-neutral-400">
              Explore the 4-stage evidence-grounded architecture built to evaluate queries, cross-reference available catalogue records, and provide structured medicine explanations.
            </p>
          </div>

          {/* 4 Pipeline Stages */}
          <div className="mt-16 space-y-8">
            {PIPELINE_STAGES.map((stage) => {
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
              Identify packaging labels, search active ingredients, and get clear plain-language guidance.
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
