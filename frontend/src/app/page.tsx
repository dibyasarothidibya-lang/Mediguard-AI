// MEDIGUARD AI LANDING PAGE

import ThemeToggle from "./components/theme-toggle";

export default function Home() {
  return (
    <>
      <header
        id="_header_centered_logo_h2_001"
        className="relative bg-white/80 backdrop-blur-2xl dark:bg-neutral-950/80"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid h-20 grid-cols-3 items-center">
            <nav
              data-motion="nav-left"
              className="hidden items-center justify-start gap-8 lg:flex"
            >
              <a
                href="/features"
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white"
              >
                Features
              </a>
              <a
                href="/howitworks"
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white"
              >
                How It Works
              </a>
              <a
                href="about"
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white"
              >
                About
              </a>
            </nav>

            <a
              data-motion="logo"
              href="#"
              className="flex items-center justify-center"
            >
              <img
              src="mediguard_blank.png"
              alt="MediGuard AI"
              className="h-9 w-auto sm:h-10 md:h-12 lg:h-14"
            />
            </a>

            <div
              data-motion="actions"
              className="flex items-center justify-end gap-3"
            >
              <ThemeToggle />

              <a
                href="login"
                className="hidden h-10 items-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-indigo-600 px-5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25 sm:flex"
              >
                Get Started
                <svg
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
        </div>

        <div className="h-px bg-linear-to-r from-transparent via-indigo-500/50 to-transparent" />
      </header>

      <section
        id="_hero_project_management_v6_001"
        className="bg-white py-20 sm:py-24 dark:bg-neutral-950"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-3">
            <div
              data-motion="hero"
              className="rounded-3xl bg-indigo-50 p-8 lg:col-span-2 lg:p-12 dark:bg-indigo-950/30"
            >
              <span
                data-motion="badge"
                className="mb-6 inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-indigo-600 uppercase dark:text-indigo-400"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                AI HEALTHCARE
              </span>

              <h1 className="mb-6 text-4xl leading-[1.1] font-bold text-slate-900 sm:text-5xl dark:text-white">
                <span data-animate="heading">Understand Your Medicines</span>
                <span
                  data-animate="heading"
                  className="text-indigo-600 dark:text-indigo-400"
                >
                  {" "}Stay Safer Every Day
                </span>
              </h1>

              <p
                data-animate="text"
                className="mb-8 max-w-lg text-lg text-slate-600 dark:text-neutral-400"
              >
                Track tasks, collaborate with your team, and hit every deadline.
                The modern project management tool built for speed.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  data-motion="button"
                  href="login"
                  className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-indigo-700"
                >
                  Start Here
                  <svg
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
                <a
                  data-motion="button"
                  href="/features"
                  className="inline-flex items-center gap-2 font-semibold text-indigo-600 transition-all duration-300 hover:gap-3 dark:text-indigo-400"
                >
                  Check Features
                  <svg
                    className="h-5 w-5"
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

            <div
              data-motion="card"
              className="flex flex-col justify-center rounded-3xl bg-slate-50 p-8 dark:bg-neutral-900"
            >
              <div className="space-y-6">
                <div>
                  <span className="block text-4xl font-bold text-slate-900 dark:text-white">
                    12
                  </span>
                  <span className="text-sm text-slate-500 dark:text-neutral-400">
                    Your medicine searches today
                  </span>
                </div>
                <div className="h-px w-full bg-slate-200 dark:bg-neutral-800" />
                <div>
                  <span className="block text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                    98%
                  </span>
                  <span className="text-sm text-slate-500 dark:text-neutral-400">
                    Medicines
                  </span>
                </div>
              </div>
            </div>

            <div
              data-motion="image"
              className="aspect-video overflow-hidden rounded-3xl lg:col-span-2"
            >
              <img
                data-motion="image"
                src="https://images.unsplash.com/photo-1659353888906-adb3e0041693?ixid=M3wzOTQxMzN8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZG9jdG9yJTIwaGVhbHRoY2FyZSUyMHNwYXxlbnwxfDB8fHwxNzY5MzE5MjI0fDA&ixlib=rb-4.1.0&w=1200&auto=format&fit=crop&q=80"
                alt="Project dashboard"
                className="h-full w-full object-cover"
              />
            </div>

            <div
              data-motion="card"
              className="rounded-3xl bg-slate-50 p-6 dark:bg-neutral-900"
            >
              <p className="mb-4 text-sm text-slate-500 dark:text-neutral-400">
                Users
              </p>
              <div className="mb-4 flex -space-x-2">
                <img
                  data-motion="avatar"
                  src="https://images.unsplash.com/photo-1659353888818-0e41520d086a?ixid=M3wzOTQxMzN8MHwxfHNlYXJjaHwyfHxtZWRpY2FsJTIwZG9jdG9yJTIwaGVhbHRoY2FyZSUyMHNwYXxlbnwxfDB8fHwxNzY5MzE5MjI0fDA&ixlib=rb-4.1.0&w=1200&auto=format&fit=crop&q=80"
                  alt="Team member"
                  className="h-10 w-10 rounded-full border-2 border-white object-cover dark:border-neutral-900"
                />
                <img
                  data-motion="avatar"
                  src="https://images.unsplash.com/photo-1659353887488-b3c443982a57?ixid=M3wzOTQxMzN8MHwxfHNlYXJjaHwzfHxtZWRpY2FsJTIwZG9jdG9yJTIwaGVhbHRoY2FyZSUyMHNwYXxlbnwxfDB8fHwxNzY5MzE5MjI0fDA&ixlib=rb-4.1.0&w=1200&auto=format&fit=crop&q=80"
                  alt="Team member"
                  className="h-10 w-10 rounded-full border-2 border-white object-cover dark:border-neutral-900"
                />
                <img
                  data-motion="avatar"
                  src="https://images.unsplash.com/photo-1659353885824-1199aeeebfc6?ixid=M3wzOTQxMzN8MHwxfHNlYXJjaHw0fHxtZWRpY2FsJTIwZG9jdG9yJTIwaGVhbHRoY2FyZSUyMHNwYXxlbnwxfDB8fHwxNzY5MzE5MjI0fDA&ixlib=rb-4.1.0&w=1200&auto=format&fit=crop&q=80"
                  alt="User"
                  className="h-10 w-10 rounded-full border-2 border-white object-cover dark:border-neutral-900"
                />
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-indigo-100 dark:border-neutral-900 dark:bg-indigo-900/30">
                  <span
                    data-motion="badge"
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400"
                  >
                    +5
                  </span>
                </div>
              </div>
              <p className="font-semibold text-slate-900 dark:text-white">
                8 members online
              </p>
              <p className="text-sm text-slate-500 dark:text-neutral-400">
                Collaborating now
              </p>
            </div>
          </div>
        </div>
      </section>


      <section
        id="_features_colorful_cards_v6_001"
        className="bg-white py-20 sm:py-24 dark:bg-neutral-950"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-16">
            <div className="grid items-end gap-12 lg:grid-cols-2">
              <div data-motion="hero">
                <span
                  data-motion="badge"
                  className="mb-4 block text-sm font-semibold tracking-wide text-indigo-600 uppercase dark:text-indigo-400"
                >
                  Medication Safety Tools
                </span>
                <h2
                  data-animate="heading"
                  className="text-4xl leading-tight font-bold text-slate-900 sm:text-5xl lg:text-6xl dark:text-white"
                >
                  Built for Safer Medication Use
                </h2>
              </div>

              <div data-motion="card" className="lg:text-right">
                <p
                  data-animate="text"
                  className="mb-6 text-lg text-slate-600 dark:text-neutral-400"
                >
                  Streamline your daily workflow with intelligent tools designed
                  to boost productivity and keep your team aligned.
                </p>
                <a
                  data-motion="button"
                  href="/features"
                  className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-indigo-700"
                >
                  Explore Features
                  <svg
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

            <div className="grid gap-6 lg:grid-cols-12">
              <div
                data-motion="card"
                className="flex flex-col gap-6 rounded-3xl bg-indigo-50 p-8 lg:col-span-5 dark:bg-indigo-900/20"
              >
                <div
                  data-motion="icon"
                  className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white dark:bg-neutral-800"
                >
                  <svg
                    className="h-7 w-7 text-indigo-600 dark:text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">
                    Drug Interaction Checker
                  </h3>
                  <p className="leading-relaxed text-slate-600 dark:text-neutral-400">
                    Organize projects with intuitive boards, smart prioritization,
                    and automated workflows that adapt to your team&apos;s needs.
                  </p>
                </div>
                <div className="mt-auto flex items-center gap-4 pt-4">
                  <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                    2.5x
                  </span>
                  <span className="text-sm text-slate-600 dark:text-neutral-400">
                    faster project delivery
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-6 lg:col-span-7">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div
                    data-motion="card"
                    className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-6 dark:bg-neutral-900"
                  >
                    <div
                      data-motion="icon"
                      className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/40"
                    >
                      <svg
                        className="h-6 w-6 text-indigo-600 dark:text-indigo-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Medication Searches
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-neutral-400">
                      Automatic time logs with detailed reports and insights.
                    </p>
                  </div>

                  <div
                    data-motion="card"
                    className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-6 dark:bg-neutral-900"
                  >
                    <div
                      data-motion="icon"
                      className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/40"
                    >
                      <svg
                        className="h-6 w-6 text-indigo-600 dark:text-indigo-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Medicine Information
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-neutral-400">
                      Real-time collaboration with instant updates.
                    </p>
                  </div>
                </div>

                <div
                  data-motion="card"
                  className="flex flex-col items-start gap-6 rounded-2xl bg-slate-50 p-6 sm:flex-row dark:bg-neutral-900"
                >
                  <div
                    data-motion="icon"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/40"
                  >
                    <svg
                      className="h-6 w-6 text-indigo-600 dark:text-indigo-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                      Personal Medication Summary
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-neutral-400">
                      Visual dashboards to track progress, measure outcomes, and
                      make data-driven decisions for your team.
                    </p>
                  </div>
                  <a
                    href="#"
                    className="whitespace-nowrap text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    Learn more →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


    <section
      id="_testimonial_tall_quote_cards_carousel_t21_001"
      className="bg-white py-20 sm:py-24 dark:bg-neutral-950"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div data-motion="header" className="mb-14 text-center">
          <span
            data-motion="badge"
            className="mb-3 block text-sm font-semibold tracking-wide text-indigo-600 uppercase dark:text-indigo-400"
          >
            Example Use Cases
          </span>
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
            How MediGuard Helps in Everyday Situations
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <article
            data-motion="card"
            className="flex min-h-[400px] flex-col rounded-3xl border border-slate-200 bg-slate-50 p-8 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <svg
              className="mb-6 h-8 w-8 text-indigo-500"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.956.76-3.022.66-1.065 1.515-1.867 2.558-2.403L9.373 5c-.8.396-1.56.898-2.26 1.505-.71.607-1.34 1.305-1.9 2.094s-.98 1.68-1.25 2.69-.346 2.04-.217 3.1c.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368l.002.004zm9.124 0c0-.88-.23-1.618-.69-2.217-.326-.42-.768-.695-1.327-.825-.55-.13-1.07-.14-1.54-.03-.16-.94.09-1.95.75-3.02.66-1.06 1.514-1.86 2.557-2.4L18.49 5c-.8.396-1.555.898-2.26 1.505-.708.607-1.34 1.305-1.894 2.094-.556.79-.97 1.68-1.24 2.69-.273 1-.345 2.04-.217 3.1.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368l-.007.004z" />
            </svg>
            <p className="grow text-lg leading-relaxed font-medium text-slate-800 dark:text-neutral-200">
              Lost 30 pounds in 4 months. The personalized coaching made all the
              difference in my journey.
            </p>
            <div className="mt-6 flex items-center gap-4 border-t border-slate-200 pt-6 dark:border-neutral-800">
              <img
                data-motion="avatar"
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80"
                alt="Sarah Mitchell"
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Sarah Mitchell
                </h3>
                <p className="text-sm text-indigo-600 dark:text-indigo-400">
                  @sarahmfit
                </p>
              </div>
            </div>
          </article>

          <article
            data-motion="card"
            className="flex min-h-[400px] flex-col rounded-3xl border border-slate-200 bg-slate-50 p-8 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <svg
              className="mb-6 h-8 w-8 text-indigo-500"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.956.76-3.022.66-1.065 1.515-1.867 2.558-2.403L9.373 5c-.8.396-1.56.898-2.26 1.505-.71.607-1.34 1.305-1.9 2.094s-.98 1.68-1.25 2.69-.346 2.04-.217 3.1c.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368l.002.004zm9.124 0c0-.88-.23-1.618-.69-2.217-.326-.42-.768-.695-1.327-.825-.55-.13-1.07-.14-1.54-.03-.16-.94.09-1.95.75-3.02.66-1.06 1.514-1.86 2.557-2.4L18.49 5c-.8.396-1.555.898-2.26 1.505-.708.607-1.34 1.305-1.894 2.094-.556.79-.97 1.68-1.24 2.69-.273 1-.345 2.04-.217 3.1.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368l-.007.004z" />
            </svg>
            <p className="grow text-lg leading-relaxed font-medium text-slate-800 dark:text-neutral-200">
              Finally found a program that fits my busy schedule. Energy levels
              are through the roof!
            </p>
            <div className="mt-6 flex items-center gap-4 border-t border-slate-200 pt-6 dark:border-neutral-800">
              <img
                data-motion="avatar"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
                alt="Marcus Chen"
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Marcus Chen
                </h3>
                <p className="text-sm text-indigo-600 dark:text-indigo-400">
                  @marcuswellness
                </p>
              </div>
            </div>
          </article>

          <article
            data-motion="card"
            className="flex min-h-[400px] flex-col rounded-3xl border border-slate-200 bg-slate-50 p-8 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <svg
              className="mb-6 h-8 w-8 text-indigo-500"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.956.76-3.022.66-1.065 1.515-1.867 2.558-2.403L9.373 5c-.8.396-1.56.898-2.26 1.505-.71.607-1.34 1.305-1.9 2.094s-.98 1.68-1.25 2.69-.346 2.04-.217 3.1c.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368l.002.004zm9.124 0c0-.88-.23-1.618-.69-2.217-.326-.42-.768-.695-1.327-.825-.55-.13-1.07-.14-1.54-.03-.16-.94.09-1.95.75-3.02.66-1.06 1.514-1.86 2.557-2.4L18.49 5c-.8.396-1.555.898-2.26 1.505-.708.607-1.34 1.305-1.894 2.094-.556.79-.97 1.68-1.24 2.69-.273 1-.345 2.04-.217 3.1c.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368l-.007.004z" />
            </svg>
            <p className="grow text-lg leading-relaxed font-medium text-slate-800 dark:text-neutral-200">
              The nutrition guidance changed everything. I feel stronger and more
              confident than ever.
            </p>
            <div className="mt-6 flex items-center gap-4 border-t border-slate-200 pt-6 dark:border-neutral-800">
              <img
                data-motion="avatar"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
                alt="Emma Rodriguez"
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Emma Rodriguez
                </h3>
                <p className="text-sm text-indigo-600 dark:text-indigo-400">
                  @emmastrong
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>


















      
    </>
  );
}
