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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in"
    >
      <div className="relative flex flex-col w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl dark:border-neutral-800 dark:bg-[#15171e] text-slate-900 dark:text-neutral-100">
        {/* Header */}
        <div className="flex items-start gap-3.5 p-5 sm:p-6 border-b border-slate-100 dark:border-neutral-800/80 bg-slate-50/70 dark:bg-neutral-900/50">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
            <ShieldAlert className="size-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400 mb-1">
              Required Terms &amp; Safety Notice
            </div>
            <h2 id="terms-dialog-title" className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              MediGuard AI Safety Notice &amp; Terms Agreement
            </h2>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
              You must review and agree to these terms before accessing the MediGuard AI Assistant.
            </p>
          </div>
        </div>

        {/* Scrollable Terms Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-neutral-300">
          {/* Primary Alert Callout */}
          <div className="rounded-2xl border border-amber-300 bg-amber-50/80 p-4 dark:border-amber-900/60 dark:bg-amber-950/40 text-slate-800 dark:text-neutral-200">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="size-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-slate-900 dark:text-white">
                  Educational Prototype — Not a Medical Service
                </p>
                <p className="text-xs">
                  MediGuard AI is an independent student educational and research project. It is <strong>NOT</strong> a healthcare provider, clinic, hospital, pharmacy, medical device, diagnostic service, or emergency service.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 divide-y divide-slate-100 dark:divide-neutral-800/60">
            <div className="pt-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                1. No Medical Advice &amp; No Treatment Decisions
              </h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
                Nothing provided through MediGuard AI should be interpreted as medical advice, diagnosis, treatment, or dosage guidance. Never use this platform to select medication, change doses, stop prescribed drugs, or make clinical decisions.
              </p>
            </div>

            <div className="pt-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                2. Automated Systems &amp; AI May Contain Errors
              </h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
                Artificial intelligence, OCR, image analysis, and automated matching can make mistakes, hallucinate, misread labels, or misunderstand queries. Grounding does not guarantee correctness. Always independently verify with a licensed doctor or pharmacist.
              </p>
            </div>

            <div className="pt-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                3. No Guarantee of Medicine Authenticity
              </h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
                Packaging analysis and barcode checks do not constitute definitive proof that a physical medicine is genuine, counterfeit, unexpired, or safe for human consumption.
              </p>
            </div>

            <div className="pt-3">
              <h3 className="font-bold text-rose-700 dark:text-rose-400 text-xs sm:text-sm">
                4. Medical Emergencies
              </h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
                Never use MediGuard AI during a medical emergency, suspected poisoning, or severe reaction. Contact your local emergency services or visit an emergency facility immediately.
              </p>
            </div>

            <div className="pt-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                5. User Responsibility &amp; Limitation of Liability
              </h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
                The platform is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis for educational evaluation. Users assume sole responsibility for independently verifying all medical information with licensed clinicians. The developer disclaims all liability for clinical outcomes or decisions made based on automated outputs.
              </p>
            </div>

            <div className="pt-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                6. Query Logging &amp; Academic Research Disclosure
              </h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
                To support academic research, security auditing, debugging, and service improvements, submitted search queries and interactions may be recorded. Search data is maintained strictly for research and platform safety, and is never sold to commercial third parties. See Section 24 of the full terms.
              </p>
            </div>
          </div>

          {/* Full Link to About */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-neutral-800">
            <span className="text-xs text-slate-500 dark:text-neutral-400">
              Want to read all 25 legal sections?
            </span>
            <Link
              href="/about"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              <span>View Full Terms on About Page</span>
              <ExternalLink className="size-3" />
            </Link>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-neutral-800 bg-slate-50/70 dark:bg-neutral-900/50 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onDecline}
            disabled={isDeclining}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/60 transition-colors disabled:opacity-50"
          >
            <LogOut className="size-4" />
            <span>{isDeclining ? "Signing out..." : "I Do Not Agree / Decline"}</span>
          </button>

          <button
            type="button"
            onClick={onAccept}
            disabled={isDeclining}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-500 active:scale-[0.99] transition-all disabled:opacity-50"
          >
            <CheckCircle2 className="size-4" />
            <span>I Acknowledge &amp; Agree to Terms</span>
          </button>
        </div>
      </div>
    </div>
  );
}
