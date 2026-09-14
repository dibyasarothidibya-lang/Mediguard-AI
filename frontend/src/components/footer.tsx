import Link from "next/link";
import { ShieldCheck, ExternalLink, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-slate-50/50 dark:border-neutral-800/80 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 text-white shadow-sm">
                <ShieldCheck className="size-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                MediGuard<span className="text-indigo-600 dark:text-indigo-400"> AI</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-neutral-400">
              Multi-source optical verification and clinical intelligence platform built to verify pharmaceutical authenticity and protect patient well-being.
            </p>
          </div>

          {/* Col 2: Platform Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Platform
            </h4>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <Link
                  href="/features"
                  className="text-slate-600 transition-colors hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-white"
                >
                  Features & Tools
                </Link>
              </li>
              <li>
                <Link
                  href="/howitworks"
                  className="text-slate-600 transition-colors hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-white"
                >
                  Verification Pipeline
                </Link>
              </li>
              <li>
                <Link
                  href="/chat"
                  className="text-slate-600 transition-colors hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-white"
                >
                  AI Medicine Assistant
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-slate-600 transition-colors hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-white"
                >
                  About & Safety Notice
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-indigo-600 font-semibold transition-colors hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Admin Audit Cockpit ↗
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Evidence Sources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Evidence Sources
            </h4>
            <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-neutral-400">
              <li>openFDA Drug Label API (Live)</li>
              <li>DGDA-Aligned Local Catalogue</li>
              <li>GS1 DataMatrix &amp; 2D Barcodes</li>
              <li>Controlled Citation Integrity</li>
              <li>Extensible Source Adapters</li>
            </ul>
          </div>

          {/* Col 4: Safety & Emergency */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Medical Disclaimer
            </h4>
            <p className="mt-4 text-xs leading-relaxed text-slate-600 dark:text-neutral-400">
              MediGuard is an educational verification prototype. It does not provide medical diagnosis or replace licensed physicians or pharmacists.
            </p>
            <div className="mt-4 rounded-xl border border-amber-300/40 bg-amber-50/60 p-3 text-[11px] text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-300">
              In a medical emergency or adverse reaction, immediately call your local emergency hotline.
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 pt-8 sm:flex-row dark:border-neutral-800/80">
          <p className="text-xs text-slate-500 dark:text-neutral-500">
            &copy; {new Date().getFullYear()} MediGuard AI. Developed by Dibya Sarothi Simanta.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-neutral-500">
            <Link
              href="/about"
              className="hover:text-slate-900 dark:hover:text-white"
            >
              Terms & Disclaimers
            </Link>
            <span>&middot;</span>
            <a
              href="https://github.com/dibyasarothidibya-lang/Mediguard-AI"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
            >
              GitHub Repository <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
