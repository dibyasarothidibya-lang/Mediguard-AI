"use client";

import { ShieldAlert, AlertTriangle, CheckCircle2, LogOut, ExternalLink } from "lucide-react";
import Link from "next/link";

type TermsDialogProps = {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
  isDeclining?: boolean;
};

export default function TermsDialog({
  isOpen,
  onAccept,
  onDecline,
  isDeclining = false,
}: TermsDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-dialog-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md p-3 sm:p-6 flex items-center justify-center min-h-screen animate-fade-in"
      style={{ overflowY: "auto" }}
    >
      <div
        className="relative flex flex-col w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl text-slate-900 my-auto"
        style={{
          maxHeight: "calc(100vh - 2.5rem)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header - Fixed at Top */}
        <div className="shrink-0 flex items-start gap-3.5 p-4 sm:p-5 border-b border-slate-200 bg-slate-50">
          <div className="flex size-10 sm:size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
            <ShieldAlert className="size-5 sm:size-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 mb-1">
              Required Terms &amp; Safety Notice
            </div>
            <h2 id="terms-dialog-title" className="text-base sm:text-xl font-extrabold tracking-tight text-slate-900 truncate">
              MediGuard AI Safety Notice &amp; Terms Agreement
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and agree to these terms before accessing the assistant.
            </p>
          </div>
        </div>

        {/* Scrollable Terms Content with visible slider / scrollbar */}
        <div
          className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs sm:text-sm leading-relaxed text-slate-600"
          style={{
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "thin",
          }}
        >
          {/* Primary Alert Callout */}
          <div className="rounded-2xl border border-amber-300 bg-amber-50/90 p-4 text-slate-800">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="size-5 shrink-0 text-amber-600 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-slate-900">
                  Educational Prototype — Not a Medical Service
                </p>
                <p className="text-xs">
                  MediGuard AI is an independent student educational and research project. It is <strong>NOT</strong> a healthcare provider, clinic, hospital, pharmacy, medical device, diagnostic service, or emergency service.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 divide-y divide-slate-100">
            <div className="pt-2">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                1. No Medical Advice &amp; No Treatment Decisions
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Nothing provided through MediGuard AI should be interpreted as medical advice, diagnosis, treatment, or dosage guidance. Never use this platform to select medication, change doses, stop prescribed drugs, or make clinical decisions.
              </p>
            </div>

            <div className="pt-3">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                2. Automated Systems &amp; AI May Contain Errors
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Artificial intelligence, OCR, image analysis, and automated matching can make mistakes, hallucinate, misread labels, or misunderstand queries. Grounding does not guarantee correctness. Always independently verify with a licensed doctor or pharmacist.
              </p>
            </div>

            <div className="pt-3">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                3. No Guarantee of Medicine Authenticity
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Packaging analysis and barcode checks do not constitute definitive proof that a physical medicine is genuine, counterfeit, unexpired, or safe for human consumption.
              </p>
            </div>

            <div className="pt-3">
              <h3 className="font-bold text-rose-700 text-xs sm:text-sm">
                4. Medical Emergencies
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Never use MediGuard AI during a medical emergency, suspected poisoning, or severe reaction. Contact your local emergency services or visit an emergency facility immediately.
              </p>
            </div>

            <div className="pt-3">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                5. User Responsibility &amp; Limitation of Liability
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                The platform is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis for educational evaluation. Users assume sole responsibility for independently verifying all medical information with licensed clinicians. The developer disclaims all liability for clinical outcomes or decisions made based on automated outputs.
              </p>
            </div>

            <div className="pt-3">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                6. Query Logging &amp; Academic Research Disclosure
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                To support academic research, security auditing, debugging, and service improvements, submitted search queries and interactions may be recorded. Search data is maintained strictly for research and platform safety, and is never sold to commercial third parties. See Section 24 of the full terms.
              </p>
            </div>
          </div>

          {/* Full Link to About */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <span className="text-xs text-slate-500">
              Want to read all 25 legal sections?
            </span>
            <Link
              href="/about"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 hover:text-black hover:underline"
            >
              <span>View Full Terms on About Page</span>
              <ExternalLink className="size-3" />
            </Link>
          </div>

          {/* Direct In-Content Action Slider / Banner */}
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
            <span className="text-xs font-semibold text-slate-700 text-center sm:text-left">
              Accept terms to continue into MediGuard Assistant
            </span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onDecline}
                disabled={isDeclining}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <LogOut className="size-3.5" />
                <span>Decline</span>
              </button>
              <button
                type="button"
                onClick={onAccept}
                disabled={isDeclining}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-sm active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                <CheckCircle2 className="size-3.5" />
                <span>Agree &amp; Open Assistant</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions - ALWAYS Pinned at bottom with explicit high-contrast buttons */}
        <div
          className="shrink-0 p-4 sm:p-5 border-t-2 border-slate-200 bg-slate-100/95 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 shadow-md"
          style={{ position: "sticky", bottom: 0, zIndex: 20 }}
        >
          <button
            type="button"
            onClick={onDecline}
            disabled={isDeclining}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-rose-300 bg-white px-4 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-50 hover:border-rose-400 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <LogOut className="size-4" />
            <span>{isDeclining ? "Signing out..." : "I Do Not Agree / Decline"}</span>
          </button>

          <button
            type="button"
            onClick={onAccept}
            disabled={isDeclining}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 px-6 py-2.5 text-xs sm:text-sm font-black text-white shadow-md active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
          >
            <CheckCircle2 className="size-4" />
            <span>I Acknowledge &amp; Agree to Terms</span>
          </button>
        </div>
      </div>
    </div>
  );
}
