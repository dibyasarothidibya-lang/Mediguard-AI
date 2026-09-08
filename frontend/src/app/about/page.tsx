import Link from "next/link";

export default function About() {
  return (
    <main className="bg-white text-slate-900 dark:bg-neutral-950 dark:text-white">
      <section id="about" className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-16">
            <div className="relative overflow-hidden">
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
                <span className="text-[20rem] leading-none font-bold text-indigo-100 select-none sm:text-[28rem] dark:text-indigo-900/30">
                  26
                </span>
              </div>

              <div className="relative z-10 flex flex-col items-center gap-6 py-16 text-center sm:py-24">
                <span className="text-sm font-semibold tracking-wide text-indigo-600 uppercase dark:text-indigo-400">
                  Independent Student Project · 2026
                </span>
                <h1 className="max-w-3xl text-3xl leading-tight font-bold text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
                  Making Medicine Information Easier to Understand
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-neutral-400">
                  MediGuard AI is a student-built medication safety project
                  exploring how packaging analysis and public pharmaceutical
                  data can help people identify medicines and understand
                  important information. It is designed to support awareness
                  and informed conversations with healthcare professionals.
                </p>
                <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
                  <span className="text-5xl font-bold">3</span>
                  <span className="text-left text-sm leading-tight uppercase">
                    Core Project
                    <br />
                    Goals
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="h-72 overflow-hidden rounded-3xl sm:h-96 lg:col-span-2">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80"
                  alt="People collaborating on a digital health project"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-center gap-6 rounded-3xl bg-indigo-50 p-8 dark:bg-indigo-900/20">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  What MediGuard Explores
                </h2>
                <ul className="flex flex-col gap-4 text-slate-700 dark:text-neutral-300">
                  <li className="flex items-center gap-3">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                    QR and barcode medicine identification
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                    Public drug-registry cross-checking
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                    AI-assisted packaging analysis
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                    Plain-language medicine information
                  </li>
                </ul>
                <a
                  href="#how-it-works"
                  className="inline-flex w-fit items-center gap-2 font-semibold text-indigo-600 transition-all duration-300 hover:gap-3 dark:text-indigo-400"
                >
                  How MediGuard Works
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <section className="grid gap-8 rounded-3xl bg-slate-50 p-8 sm:p-12 lg:grid-cols-2 lg:items-center dark:bg-neutral-900">
              <div>
                <span className="mb-3 block text-sm font-semibold tracking-wide text-indigo-600 uppercase dark:text-indigo-400">
                  Our Mission
                </span>
                <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
                  Clearer information. More informed questions.
                </h2>
              </div>
              <p className="text-lg leading-relaxed text-slate-600 dark:text-neutral-400">
                MediGuard aims to make medicine information easier to access and
                understand, especially when packaging labels and official drug
                records feel overwhelming. The project emphasizes transparency
                by showing where information comes from, acknowledging
                uncertainty, and encouraging users to confirm important
                decisions with licensed doctors or pharmacists.
              </p>
            </section>

            <section id="how-it-works">
              <div className="mb-10 max-w-2xl">
                <span className="mb-3 block text-sm font-semibold tracking-wide text-indigo-600 uppercase dark:text-indigo-400">
                  Planned Workflow
                </span>
                <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
                  How MediGuard is intended to work
                </h2>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <article className="rounded-3xl border border-slate-200 bg-white p-7 dark:border-neutral-800 dark:bg-neutral-900">
                  <span className="mb-5 block text-4xl font-bold text-indigo-200 dark:text-indigo-900">
                    01
                  </span>
                  <h3 className="mb-3 text-xl font-bold">Scan or search</h3>
                  <p className="leading-relaxed text-slate-600 dark:text-neutral-400">
                    A user searches for a medicine or provides packaging details
                    through a barcode, QR code, or image.
                  </p>
                </article>

                <article className="rounded-3xl border border-slate-200 bg-white p-7 dark:border-neutral-800 dark:bg-neutral-900">
                  <span className="mb-5 block text-4xl font-bold text-indigo-200 dark:text-indigo-900">
                    02
                  </span>
                  <h3 className="mb-3 text-xl font-bold">Compare public sources</h3>
                  <p className="leading-relaxed text-slate-600 dark:text-neutral-400">
                    MediGuard compares available details with public
                    pharmaceutical records and clearly identifies missing or
                    uncertain information.
                  </p>
                </article>

                <article className="rounded-3xl border border-slate-200 bg-white p-7 dark:border-neutral-800 dark:bg-neutral-900">
                  <span className="mb-5 block text-4xl font-bold text-indigo-200 dark:text-indigo-900">
                    03
                  </span>
                  <h3 className="mb-3 text-xl font-bold">Review a clear summary</h3>
                  <p className="leading-relaxed text-slate-600 dark:text-neutral-400">
                    The user receives an understandable summary with source
                    references, limitations, and reminders to seek professional
                    guidance.
                  </p>
                </article>
              </div>
            </section>

            <section>
              <div className="mb-10 max-w-2xl">
                <span className="mb-3 block text-sm font-semibold tracking-wide text-indigo-600 uppercase dark:text-indigo-400">
                  Community Value
                </span>
                <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
                  What the project hopes to improve
                </h2>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <article className="rounded-3xl bg-indigo-50 p-7 dark:bg-indigo-900/20">
                  <h3 className="mb-3 text-xl font-bold">Understandability</h3>
                  <p className="leading-relaxed text-slate-600 dark:text-neutral-400">
                    Translate technical medicine information into language that
                    is easier for everyday users to follow.
                  </p>
                </article>
                <article className="rounded-3xl bg-indigo-50 p-7 dark:bg-indigo-900/20">
                  <h3 className="mb-3 text-xl font-bold">Source transparency</h3>
                  <p className="leading-relaxed text-slate-600 dark:text-neutral-400">
                    Show the origin of displayed information instead of asking
                    users to trust an unexplained automated answer.
                  </p>
                </article>
                <article className="rounded-3xl bg-indigo-50 p-7 dark:bg-indigo-900/20">
                  <h3 className="mb-3 text-xl font-bold">Responsible use</h3>
                  <p className="leading-relaxed text-slate-600 dark:text-neutral-400">
                    Help users prepare better questions while keeping doctors
                    and pharmacists at the center of medical decisions.
                  </p>
                </article>
              </div>
            </section>

            <section className="rounded-3xl border border-amber-300 bg-amber-50 p-8 dark:border-amber-900 dark:bg-amber-950/30">
              <span className="mb-3 block text-sm font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-400">
                Important Safety Notice
              </span>
              <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
                MediGuard is an educational prototype
              </h2>
              <p className="max-w-4xl leading-relaxed text-slate-700 dark:text-neutral-300">
                MediGuard does not provide medical advice, diagnosis, treatment,
                or definitive proof that a medicine is authentic. Automated
                analysis and third-party data may be incomplete or incorrect.
                Always confirm medication information with a licensed doctor or
                pharmacist, and contact local emergency services when urgent
                medical help is needed.
              </p>
              <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
                1. Informational & Educational Purpose Only (Student Project)
              </h2>
              <p className="max-w-4xl leading-relaxed text-slate-700 dark:text-neutral-300">
                MediGuard AI is an independent academic, educational, and research software project developed by an individual student. This platform is provided strictly for educational and informational purposes. MediGuard AI does not provide medical advice, diagnosis, treatment, or clinical recommendations of any kind.
              </p>
               <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
                2. Not a Substitute for Professional Healthcare
              </h2>
              <p className="max-w-4xl leading-relaxed text-slate-700 dark:text-neutral-300">
                Nothing contained on this platform—including verification results, packaging details, automated AI chat responses, or drug summaries—should ever be interpreted as medical advice or used to make healthcare decisions. Always consult a licensed physician, certified pharmacist, or qualified healthcare professional before taking, modifying, or discontinuing any medication. Never disregard professional medical advice or delay seeking it because of information accessed through this application. In the event of a medical emergency, immediately contact your local emergency services or visit the nearest hospital.
              </p>
              <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
                3. Third-Party & Public Data Aggregation
              </h2>
              <p className="max-w-4xl leading-relaxed text-slate-700 dark:text-neutral-300">
                All pharmaceutical classifications, regulatory information, generic comparisons, and drug data displayed across MediGuard AI are retrieved, aggregated, or scraped from third-party public and governmental repositories (including, but not limited to, openFDA, DailyMed, and regional regulatory directories).

                MediGuard AI does not create, curate, or independently guarantee third-party regulatory records.
                Data may occasionally contain inaccuracies, incomplete records, or delayed synchronization with official gazettes.
              </p>
              <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
                4. Experimental AI & Automated Analysis Limitations
              </h2>
              <p className="max-w-4xl leading-relaxed text-slate-700 dark:text-neutral-300">
                 The computer vision, optical recognition, and conversational AI features integrated into this platform operate on automated probabilistic models. AI outputs, image recognitions, and conversational answers may contain errors, hallucinations, or misread text. Automated packaging verification must never be treated as a definitive guarantee of product authenticity or safety.

              </p>
                <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
                5. Absolute Limitation of Liability &amp; &quot;As-Is&quot; Provision
              </h2>
              <p className="max-w-4xl leading-relaxed text-slate-700 dark:text-neutral-300">
                 This platform and all its features are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis, without warranties of any kind, whether express, statutory, or implied.

To the fullest extent permitted by applicable law, the student developer, creators, and contributors expressly disclaim all liability for any direct, indirect, incidental, consequential, special, or exemplary damages, personal injury, adverse health events, financial loss, or legal claims arising out of or related to:

The use or inability to use this platform;

Any reliance placed on information, data, or AI-generated outputs provided herein;

Any errors, omissions, inaccuracies, or delays in third-party public registries.

              </p>
              <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
               6. User Acknowledgment & Explicit Consent
              </h2>
              <p className="max-w-4xl leading-relaxed text-slate-700 dark:text-neutral-300">
                 By accessing or utilizing MediGuard AI, you explicitly acknowledge that you have read, understood, and agreed to this disclaimer, and you assume full, sole responsibility for all decisions and actions taken in connection with the platform. If you do not agree to these terms, you must discontinue use immediately.

              </p>
            </section>

            <div className="flex justify-center">
              <Link
                href="/"
                className="inline-flex items-center rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Return to MediGuard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
