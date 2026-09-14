import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ShieldAlert, AlertTriangle, ArrowLeft, ExternalLink } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors dark:bg-neutral-950 dark:text-neutral-100">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb / Top Navigation */}
          <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-neutral-400">
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              <ArrowLeft className="size-3.5" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <span className="text-slate-800 dark:text-neutral-200">
              Important Safety Notice &amp; Limitation of Liability
            </span>
          </div>

          {/* Main Document Header */}
          <header className="mb-10 space-y-4 border-b border-slate-200/80 pb-8 dark:border-neutral-800">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-400">
              <ShieldAlert className="size-4" />
              Academic Software Disclosure &amp; Terms
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
              Important Safety Notice and Limitation of Liability
            </h1>
            <p className="text-sm text-slate-500 dark:text-neutral-400">
              Last updated for Academic Evaluation: 2026 · MediGuard AI Educational Project
            </p>
          </header>

          {/* Core Foundation Alert Box */}
          <section className="mb-12 rounded-3xl border border-amber-300/80 bg-amber-50/70 p-6 sm:p-8 shadow-sm dark:border-amber-900/50 dark:bg-amber-950/30">
            <div className="flex items-start gap-4">
              <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
                <AlertTriangle className="size-6" />
              </div>
              <div className="space-y-4">
                <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl dark:text-white">
                  MediGuard AI is an Educational Prototype — Not a Medical Service
                </h2>
                <div className="space-y-3 text-sm leading-relaxed text-slate-800 dark:text-neutral-200">
                  <p>
                    MediGuard AI is an independent student-developed educational, academic, and research software project.
                  </p>
                  <p className="font-semibold text-rose-700 dark:text-rose-400">
                    MediGuard AI is NOT a healthcare provider, pharmacy, medical device, diagnostic service, regulatory authority, medicine manufacturer, laboratory, emergency service, or substitute for professional medical care.
                  </p>
                  <p>
                    Nothing provided through MediGuard AI should be interpreted as medical advice, diagnosis, treatment, prescription guidance, dosage guidance, confirmation of medicine authenticity, or a recommendation to take, stop, replace, modify, or purchase any medicine.
                  </p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    All information obtained through MediGuard AI must be independently verified with an appropriately qualified healthcare professional.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Document Body: 25 Sections */}
          <div className="space-y-10 text-sm leading-relaxed text-slate-700 dark:text-neutral-300">
            {/* Section 1 */}
            <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/70">
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                1. User Responsibility and Limitations of Use
              </h2>
              <div className="space-y-3">
                <p>
                  MediGuard AI is provided as an educational and informational platform intended to support access to medicine-related information and public regulatory data.

While reasonable efforts are made to present useful and relevant information, MediGuard AI does not guarantee that all content, automated analyses, search results, medicine records, or AI-generated outputs will always be complete, accurate, current, or suitable for a particular situation.

Users should independently verify important medicine and healthcare information with a licensed physician, pharmacist, healthcare professional, manufacturer, or appropriate regulatory authority before making any decision based on information obtained through the platform.

MediGuard AI is a student-developed educational project and must not be relied upon as a substitute for professional medical judgment, diagnosis, treatment, emergency care, or healthcare services.
                </p>
                <p>
                  MediGuard AI does not guarantee that any information or result provided through the platform is accurate, complete, current, suitable, safe, or appropriate for any individual.
                </p>
                <p>
                  Users remain solely responsible for decisions they make after accessing information through MediGuard AI.
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  MediGuard AI should never be the sole source relied upon for a healthcare, medicine, diagnosis, treatment, authenticity, dosage, emergency, or safety decision.
                </p>
              </div>
            </article>

            {/* Section 2 */}
            <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/70">
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                2. No Medical Advice
              </h2>
              <div className="space-y-3">
                <p className="font-semibold text-slate-900 dark:text-white">
                  MediGuard AI does not provide medical advice.
                </p>
                <p>
                  The platform does not establish a doctor-patient, pharmacist-patient, healthcare-provider-patient, professional, fiduciary, or clinical relationship between the user and the developer.
                </p>
                <p>
                  AI-generated responses, medicine summaries, packaging analysis, registry information, search results, warnings, comparisons, OCR results, barcode results, and other outputs are provided solely for informational and educational purposes.
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  A user must consult a licensed doctor, pharmacist, or other appropriately qualified healthcare professional before making any decision relating to medication or healthcare.
                </p>
              </div>
            </article>

            {/* Section 3 */}
            <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/70">
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                3. Do Not Use MediGuard AI to Make Treatment Decisions
              </h2>
              <p className="mb-3 font-medium text-slate-900 dark:text-white">
                Users must not rely on MediGuard AI to:
              </p>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {[
                  "diagnose a disease, condition, infection, illness, or injury;",
                  "determine whether they have a medical condition;",
                  "select a medication;",
                  "determine a medication dose;",
                  "change an existing medication dose;",
                  "stop taking prescribed medication;",
                  "begin taking medication;",
                  "substitute one medicine for another;",
                  "determine whether a medication is safe for a particular person;",
                  "determine whether a drug interaction is safe;",
                  "decide whether professional medical treatment is necessary;",
                  "delay or avoid seeking professional healthcare;",
                  "make emergency medical decisions.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs sm:text-sm">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-rose-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 font-semibold text-slate-900 dark:text-white">
                Any such decision must be made with an appropriately qualified healthcare professional.
              </p>
            </article>

            {/* Section 4 */}
            <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/70">
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                4. No Guarantee of Medicine Authenticity
              </h2>
              <div className="space-y-3">
                <p>
                  MediGuard AI may analyze packaging, text, medicine names, barcodes, QR codes, identifiers, public databases, images, regulatory records, or other available information.
                </p>
                <p className="font-semibold text-rose-700 dark:text-rose-400">
                  Such analysis does NOT constitute definitive proof that a medicine is genuine, counterfeit, safe, unsafe, expired, contaminated, correctly manufactured, correctly stored, or appropriate for use.
                </p>
                <p>A result that appears legitimate does not guarantee authenticity.</p>
                <p>A failed match does not necessarily mean that a medicine is counterfeit.</p>
                <p>A successful match does not necessarily mean that a physical medicine is genuine.</p>
                <p className="font-medium text-slate-900 dark:text-white">
                  If authenticity is uncertain, users should consult the medicine manufacturer, pharmacist, healthcare professional, distributor, or relevant regulatory authority.
                </p>
              </div>
            </article>

            {/* Section 5 */}
            <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/70">
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                5. Automated Systems Can Be Wrong
              </h2>
              <p className="mb-3 font-medium text-slate-900 dark:text-white">
                MediGuard AI includes automated systems such as:
              </p>
              <div className="mb-4 flex flex-wrap gap-2">
                {[
                  "artificial intelligence",
                  "large language models",
                  "OCR",
                  "image analysis",
                  "barcode and QR processing",
                  "medicine-name extraction",
                  "data matching",
                  "database retrieval",
                  "classification systems",
                  "automated evidence processing",
                ].map((tag, i) => (
                  <span
                    key={i}
                    className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-neutral-800 dark:text-neutral-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="space-y-3">
                <p className="font-semibold text-slate-900 dark:text-white">These technologies may make mistakes.</p>
                <p>
                  They may misidentify medicine names, packaging, ingredients, manufacturers, strengths, expiry information, indications, warnings, regulatory information, or other information.
                </p>
                <p>They may also fail to recognize relevant information.</p>
                <p className="font-medium text-slate-900 dark:text-white">
                  Automated outputs should therefore always be independently verified.
                </p>
              </div>
            </article>

            {/* Section 6 */}
            <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/70">
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                6. AI Outputs May Contain Errors
              </h2>
              <p className="mb-3">
                Although MediGuard AI may attempt to ground certain AI-generated responses using retrieved evidence, grounding does not guarantee correctness.
              </p>
              <p className="mb-2 font-medium text-slate-900 dark:text-white">
                AI systems can still produce:
              </p>
              <ul className="mb-4 space-y-1.5 pl-4">
                {[
                  "incorrect information;",
                  "incomplete information;",
                  "outdated information;",
                  "misunderstood information;",
                  "misleading statements;",
                  "fabricated information;",
                  "incorrectly interpreted source information.",
                ].map((item, i) => (
                  <li key={i} className="list-disc text-xs sm:text-sm">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="font-medium text-slate-900 dark:text-white">
                No AI-generated statement should be treated as professional medical advice or as a substitute for information from a doctor, pharmacist, manufacturer, or official regulatory authority.
              </p>
            </article>

            {/* Section 7 */}
            <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/70">
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                7. Third-Party Data May Be Incorrect
              </h2>
              <div className="space-y-3">
                <p>
                  MediGuard AI may retrieve or aggregate information from governmental, regulatory, public, or third-party datasets, including DGDA-aligned medicine data and openFDA resources.
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  MediGuard AI does not control these external databases.
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  MediGuard AI does not guarantee that external records are:
                </p>
                <ul className="space-y-1.5 pl-4">
                  {[
                    "accurate;",
                    "current;",
                    "complete;",
                    "free of errors;",
                    "continuously available;",
                    "correctly synchronized;",
                    "applicable to every jurisdiction;",
                    "applicable to the specific physical medicine held by a user.",
                  ].map((item, i) => (
                    <li key={i} className="list-disc text-xs sm:text-sm">
                      {item}
                    </li>
                  ))}
                </ul>
                <p>
                  Regulatory databases can contain outdated records, missing information, formatting errors, synchronization delays, or other inaccuracies.
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  The developer is not responsible for inaccuracies originating from external sources.
                </p>
              </div>
            </article>

            {/* Section 8: Medical Emergencies */}
            <article className="rounded-2xl border border-rose-300 bg-rose-50/80 p-6 shadow-2xs sm:p-8 dark:border-rose-900/60 dark:bg-rose-950/30">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
                <AlertTriangle className="size-5" />
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  8. Medical Emergencies
                </h2>
              </div>
              <div className="mt-4 space-y-3 text-slate-800 dark:text-neutral-200">
                <p className="text-base font-bold text-rose-700 dark:text-rose-400">
                  MediGuard AI must never be used as an emergency medical service.
                </p>
                <p>
                  If a user believes that they or another person may be experiencing a medical emergency, serious adverse reaction, poisoning, overdose, severe illness, or other urgent medical situation, they should immediately contact local emergency services or seek appropriate professional medical assistance.
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  Users should not wait for, depend on, or rely upon MediGuard AI during an emergency.
                </p>
              </div>
            </article>

            {/* Section 9 */}
            <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/70">
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                9. No Responsibility for Health Outcomes
              </h2>
              <div className="space-y-3">
                <p>
                  To the fullest extent permitted by applicable law, the developer, creator, contributors, and operators of MediGuard AI shall not be liable for illness, disease, injury, adverse reactions, worsening symptoms, delayed treatment, incorrect treatment, medication errors, healthcare complications, hospitalization, disability, death, or any other health-related outcome arising from or connected with reliance on information provided through MediGuard AI.
                </p>
                <p>
                  Users acknowledge that MediGuard AI is not intended to control, supervise, or replace professional healthcare.
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  Users remain responsible for seeking appropriate medical assistance.
                </p>
              </div>
            </article>

            {/* Section 10 */}
            <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/70">
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                10. No Responsibility for Decisions Based on MediGuard AI
              </h2>
              <p className="mb-3">
                To the fullest extent permitted by applicable law, the developer and contributors shall not be responsible for actions or decisions made by users based on information obtained through MediGuard AI.
              </p>
              <p className="mb-2 font-medium text-slate-900 dark:text-white">
                This includes decisions involving:
              </p>
              <ul className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {[
                  "medication use;",
                  "dosage;",
                  "treatment;",
                  "healthcare;",
                  "medicine purchases;",
                  "suspected counterfeit medicines;",
                  "medication discontinuation;",
                  "medication substitution;",
                  "delayed medical treatment;",
                  "interpretation of symptoms;",
                  "medical emergencies.",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs sm:text-sm">
                    <span className="size-1.5 shrink-0 rounded-full bg-slate-400 dark:bg-neutral-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="font-semibold text-slate-900 dark:text-white">
                Information obtained from MediGuard AI should always be independently verified before being relied upon.
              </p>
            </article>

            {/* Section 11 */}
            <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/70">
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                11. No Liability for Reliance on Information
              </h2>
              <p className="mb-3">
                To the fullest extent permitted by applicable law, MediGuard AI and its developer shall not be liable for any loss, injury, harm, damage, cost, claim, or consequence resulting from reliance upon:
              </p>
              <ul className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {[
                  "medicine search results;",
                  "AI-generated responses;",
                  "image recognition;",
                  "OCR;",
                  "barcode analysis;",
                  "QR-code analysis;",
                  "packaging verification;",
                  "medicine comparisons;",
                  "database records;",
                  "regulatory information;",
                  "third-party data;",
                  "system warnings;",
                  "system failures;",
                  "incomplete search results;",
                  "inaccurate results.",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs sm:text-sm">
                    <span className="size-1.5 shrink-0 rounded-full bg-slate-400 dark:bg-neutral-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="font-semibold text-slate-900 dark:text-white">
                Users accept responsibility for independently verifying important information.
              </p>
            </article>

            {/* Section 12 */}
            <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/70">
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                12. No Liability for Failure to Detect a Problem
              </h2>
              <div className="space-y-3">
                <p>
                  MediGuard AI does not guarantee that it will identify counterfeit, expired, contaminated, mislabeled, recalled, unsafe, improperly stored, illegally distributed, or otherwise problematic medicine.
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  Failure by MediGuard AI to detect a potential problem does not constitute confirmation that a medicine is safe.
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  Users should not assume that the absence of a warning means that a medicine is safe or authentic.
                </p>
              </div>
            </article>

            {/* Section 13 */}
            <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/70">
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                13. No Liability for Incorrect Warnings
              </h2>
              <div className="space-y-3">
                <p>MediGuard AI may also incorrectly flag legitimate medicines or information.</p>
                <p>
                  Warnings, risk indicators, database mismatches, or automated classifications should therefore be treated as informational signals rather than definitive conclusions.
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  Users should verify questionable results with appropriate professionals or authorities.
                </p>
              </div>
            </article>

            {/* Section 14 */}
            <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/70">
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                14. No Guarantee of Availability
              </h2>
              <div className="space-y-3">
                <p>
                  MediGuard AI may become unavailable, experience technical failures, lose connectivity to external data providers, encounter database errors, provide incomplete results, or temporarily disable certain features.
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  Users must not depend on MediGuard AI for time-sensitive medical or safety decisions.
                </p>
              </div>
            </article>

            {/* Section 15 */}
            <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/70">
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                15. &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot;
              </h2>
              <div className="space-y-3">
                <p className="font-semibold text-slate-900 dark:text-white">
                  MediGuard AI is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis.
                </p>
                <p>To the fullest extent permitted by applicable law, no warranties are made regarding:</p>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {[
                    "accuracy;",
                    "reliability;",
                    "completeness;",
                    "safety;",
                    "availability;",
                    "fitness for a particular purpose;",
                    "merchantability;",
                    "medicine authenticity;",
                    "medical suitability;",
                    "uninterrupted service;",
                    "error-free operation.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs sm:text-sm">
                      <span className="size-1.5 shrink-0 rounded-full bg-slate-400 dark:bg-neutral-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="font-semibold text-slate-900 dark:text-white">
                  No statement displayed by MediGuard AI constitutes a warranty or guarantee.
                </p>
              </div>
            </article>

            {/* Section 16 */}
            <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/70">
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                16. Limitation of Liability
              </h2>
              <div className="space-y-3">
                <p>
                  To the fullest extent permitted by applicable law, the developer, creator, contributors, operators, and persons involved with MediGuard AI shall not be liable for any direct, indirect, incidental, consequential, special, exemplary, punitive, personal, medical, financial, or other damages arising from or relating to the use of, inability to use, misunderstanding of, or reliance upon MediGuard AI.
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  This limitation includes claims relating to:
                </p>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {[
                    "personal injury;",
                    "illness;",
                    "disease;",
                    "adverse health outcomes;",
                    "medication errors;",
                    "incorrect medical decisions;",
                    "delayed treatment;",
                    "financial loss;",
                    "loss of data;",
                    "incorrect information;",
                    "third-party information;",
                    "AI-generated information;",
                    "system errors;",
                    "unavailable services;",
                    "failed verification;",
                    "incorrect verification.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs sm:text-sm">
                      <span className="size-1.5 shrink-0 rounded-full bg-slate-400 dark:bg-neutral-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="font-medium text-slate-900 dark:text-white">
                  Nothing in these Terms attempts to exclude liability that cannot lawfully be excluded under applicable law.
                </p>
              </div>
            </article>

            {/* Section 17 */}
            <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/70">
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                17. User Assumption of Responsibility
              </h2>
              <div className="space-y-3">
                <p>
                  By using MediGuard AI, users acknowledge that they are responsible for evaluating information before acting upon it.
                </p>
                <p>
                  Users agree not to treat MediGuard AI as an authority capable of making medical, clinical, pharmaceutical, diagnostic, or emergency decisions.
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  The existence of a result, warning, recommendation, explanation, match, confidence score, database record, or AI response does not transfer responsibility for a user&apos;s decisions to MediGuard AI or its developer.
                </p>
              </div>
            </article>

            {/* Section 18 */}
            <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/70">
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                18. Search and Interaction Data
              </h2>
              <div className="space-y-3">
                <p>
                  For registered users, MediGuard AI may store searches, prompts, interaction histories, scan-related metadata, timestamps, feature usage information, system responses, and other information necessary to operate and evaluate the platform.
                </p>
                <p className="font-medium text-slate-900 dark:text-white">Such information may be used for:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "educational purposes",
                    "academic research",
                    "debugging",
                    "security",
                    "testing",
                    "performance evaluation",
                    "improving search systems",
                    "improving medicine matching",
                    "improving automated systems",
                    "improving MediGuard AI",
                  ].map((item, i) => (
                    <span
                      key={i}
                      className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <p className="font-semibold text-rose-700 dark:text-rose-400">
                  Users should not submit unnecessary confidential, highly sensitive, or personally identifying medical information.
                </p>
              </div>
            </article>

            {/* Section 19 */}
            <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/70">
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                19. Privacy of Stored Search Data
              </h2>
              <div className="space-y-3">
                <p className="font-semibold text-emerald-700 dark:text-emerald-400">
                  MediGuard AI does not sell users&apos; stored search history.
                </p>
                <p>MediGuard AI does not make another user&apos;s private search history publicly available.</p>
                <p>
                  MediGuard AI does not intentionally provide stored search histories to advertisers, data brokers, or unrelated third parties for advertising or commercial profiling purposes.
                </p>
                <p>
                  Information may nevertheless be technically processed by service providers necessary to operate the platform, including hosting, database, authentication, security, analytics, API, and artificial-intelligence providers.
                </p>
                <p className="text-xs text-slate-500 dark:text-neutral-400">
                  Such third-party infrastructure may operate under its own terms and privacy policies.
                </p>
              </div>
            </article>

            {/* Section 20 */}
            <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/70">
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                20. Research and Educational Use of Data
              </h2>
              <div className="space-y-3">
                <p>
                  Users acknowledge that anonymized, aggregated, de-identified, or appropriately processed usage information may be analyzed for educational, academic, development, debugging, testing, and system-improvement purposes.
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  Such analysis is intended to improve the MediGuard AI educational project and evaluate how its systems perform.
                </p>
              </div>
            </article>

            {/* Section 21 */}
            <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/70">
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                21. User Consent
              </h2>
              <p className="mb-3 font-medium text-slate-900 dark:text-white">
                By registering for or continuing to use MediGuard AI, the user acknowledges that:
              </p>
              <ul className="mb-4 space-y-2 pl-4">
                {[
                  "MediGuard AI is an educational prototype;",
                  "MediGuard AI is not a healthcare provider;",
                  "MediGuard AI does not provide medical advice;",
                  "MediGuard AI cannot guarantee medicine authenticity;",
                  "AI and automated systems may be wrong;",
                  "third-party data may be incorrect or incomplete;",
                  "results must be independently verified;",
                  "users remain responsible for their own decisions;",
                  "search and interaction data may be stored for the purposes described in these Terms;",
                  "MediGuard AI does not sell stored user search history;",
                  "using MediGuard AI involves accepting the limitations described in this notice.",
                ].map((item, i) => (
                  <li key={i} className="list-disc text-xs sm:text-sm">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="font-bold text-rose-700 dark:text-rose-400">
                If a user does not accept these conditions, the user should not register for, access, or use MediGuard AI.
              </p>
            </article>

            {/* Section 22 */}
            <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/70">
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                22. No Reliance Clause
              </h2>
              <div className="space-y-3">
                <p>
                  Access to information through MediGuard AI does not mean that the information should be relied upon without independent confirmation.
                </p>
                <p>
                  The user agrees that important medication and healthcare information should be checked using qualified professional or official sources.
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  MediGuard AI should only be used as an additional informational resource.
                </p>
              </div>
            </article>

            {/* Section 23 */}
            <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/70">
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                23. Independent Verification Required
              </h2>
              <p className="mb-3 font-medium text-slate-900 dark:text-white">
                Before acting on information obtained through MediGuard AI, users should verify important information through one or more appropriate sources, such as:
              </p>
              <ul className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {[
                  "a licensed pharmacist;",
                  "a licensed physician;",
                  "the medicine manufacturer;",
                  "official medicine packaging;",
                  "an appropriate government regulatory authority;",
                  "another qualified healthcare professional.",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs sm:text-sm">
                    <span className="size-1.5 shrink-0 rounded-full bg-indigo-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="font-bold text-slate-900 dark:text-white">
                Failure to independently verify information is at the user&apos;s own risk.
              </p>
            </article>

            {/* Section 24 */}
            <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/70">
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                24. Changes to the Service
              </h2>
              <div className="space-y-3">
                <p>MediGuard AI is an actively developed student project.</p>
                <p>
                  Features, AI models, data sources, APIs, databases, verification systems, availability, and these Terms may be changed, replaced, limited, or discontinued.
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  The current version of these Terms will be made available through the platform.
                </p>
              </div>
            </article>

            {/* Section 25: Final Acknowledgment */}
            <article className="rounded-3xl border-2 border-slate-900 bg-slate-950 p-6 text-white shadow-xl sm:p-8 dark:border-white/20 dark:bg-neutral-900">
              <h2 className="mb-4 text-xl font-black uppercase tracking-wider text-amber-400 sm:text-2xl">
                25. Final Acknowledgment
              </h2>
              <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-slate-300">
                <p className="font-bold text-white">
                  BY USING MEDIGUARD AI, YOU ACKNOWLEDGE THAT YOU UNDERSTAND THAT THIS PLATFORM IS AN EDUCATIONAL SOFTWARE PROJECT AND NOT A MEDICAL SERVICE.
                </p>
                <p>YOU UNDERSTAND THAT ITS OUTPUTS MAY BE INCORRECT.</p>
                <p>YOU UNDERSTAND THAT MEDIGUARD AI CANNOT GUARANTEE THE SAFETY, QUALITY, OR AUTHENTICITY OF ANY MEDICINE.</p>
                <p>YOU UNDERSTAND THAT HEALTHCARE DECISIONS MUST BE MADE WITH APPROPRIATELY QUALIFIED PROFESSIONALS.</p>
                <p>YOU ACCEPT RESPONSIBILITY FOR HOW YOU USE INFORMATION OBTAINED THROUGH THE PLATFORM.</p>
                <p className="text-amber-200/90 font-medium">
                  TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, MEDIGUARD AI AND ITS DEVELOPER SHALL NOT BE RESPONSIBLE FOR HARM, LOSS, INJURY, ILLNESS, DISEASE, ADVERSE HEALTH CONSEQUENCES, FINANCIAL LOSS, OR OTHER DAMAGES RESULTING FROM RELIANCE ON OR MISUSE OF INFORMATION PROVIDED THROUGH THE PLATFORM.
                </p>
              </div>

              <div className="mt-8 border-t border-white/10 pt-6">
                <h3 className="mb-3 text-lg font-bold text-white">
                  Student Project — Not a Healthcare Service
                </h3>
                <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                  <p>MediGuard AI is an independent student-built educational and research project.</p>
                  <p>
                    It is not a hospital, clinic, pharmacy, healthcare provider, medical device, diagnostic service, emergency service, or regulatory authority.
                  </p>
                  <p>
                    Nothing provided through MediGuard AI — including AI-generated responses, medicine information, search results, packaging analysis, OCR results, barcode or QR analysis, database matches, warnings, or verification results — replaces or substitutes for a licensed doctor, pharmacist, hospital, clinic, or other qualified healthcare professional in any way.
                  </p>
                  <p className="font-semibold text-white">
                    MediGuard AI must never be treated as an alternative to professional healthcare.
                  </p>
                  <p>
                    If you are sick, injured, experiencing symptoms, concerned about a medicine, or require medical assistance, you should contact an appropriate healthcare professional.
                  </p>
                  <p className="font-semibold text-amber-300">
                    If urgent or emergency medical care is required, contact local emergency services or visit an appropriate hospital or emergency medical facility immediately.
                  </p>
                  <p>
                    Do not delay, avoid, replace, or discontinue professional medical care because of information obtained through MediGuard AI.
                  </p>
                </div>

                <div className="mt-6 rounded-2xl bg-rose-500/20 p-4 text-center ring-1 ring-rose-500/40">
                  <span className="text-sm font-black tracking-wide text-rose-300 uppercase sm:text-base">
                    IF YOU DO NOT ACCEPT THESE CONDITIONS, DO NOT USE MEDIGUARD AI.
                  </span>
                </div>
              </div>
            </article>
          </div>

          {/* Action CTAs at bottom */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              <ArrowLeft className="size-4" />
              <span>Return to Home</span>
            </Link>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-500"
            >
              <span>Acknowledge &amp; Open Assistant</span>
              <ExternalLink className="size-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
