export default function HowItWorks() {
  return (
    <section
      id="_blogdetails_fullwidth_v6_001"
      className="py-20 sm:py-24 bg-white dark:bg-neutral-950"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Content */}
          <div className="lg:col-span-6 lg:pr-8">
            <span
              data-motion="badge"
              className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold tracking-wide uppercase block mb-4"
            >
              Mediguard AI Functions
            </span>

            <h1 className="text-slate-900 dark:text-white text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              How Mediguard AI Works
            </h1>

            <p
              className="text-slate-600 dark:text-neutral-400 text-xl leading-relaxed mb-8"
              data-animate="text"
            >
              Explore the multi-source verification pipeline engineered to ensure every medicine you take is authentic, verified, and safe.
            </p>

            {/* Meta Info */}
            <div
              data-motion="meta"
              className="flex flex-wrap items-center gap-6 pt-6 border-t border-slate-200 dark:border-neutral-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    data-motion="image"
                    src="/dibya.png"
                    alt="Founder"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-slate-900 dark:text-white font-medium text-sm">
                    Dibya Sarothi Simanta
                  </p>
                  <p className="text-slate-500 dark:text-neutral-400 text-xs">
                    Founder
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-500 dark:text-neutral-400 text-sm">
                <span>12 min read</span>
                <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                <span>AUGUST 24, 2026</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div
            data-motion="image"
            className="lg:col-span-6 aspect-video overflow-hidden rounded-3xl bg-slate-100 dark:bg-neutral-900"
          >
            <img
              data-motion="image"
              src="/how%20it%20works.jpeg"
              alt="MediGuard AI verification workflow"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
        
        <section className="rounded-3xl border border-amber-300 bg-amber-50 p-8 sm:p-10 dark:border-amber-900 dark:bg-amber-950/30">
          <span className="mb-3 block text-sm font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-400">
            Mediguard Functions
          </span>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Image Capture & Preprocessing
          </h2>

          <p className="text-slate-700 dark:text-neutral-300 text-base leading-relaxed mb-6">
            The user captures packaging via smartphone camera or uploaded image.

Perspective Correction: Edge-detection algorithms isolate the packaging plane, correcting skew and glare.

Dual-ROI Segmentation: The system splits the image frame into two parallel processing streams: the 2D data carrier zone (QR / GS1 DataMatrix / Barcode) and the typography zone (printed text).
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                1. Optical Extraction & Code Parsing
              </h3>
              <p className="text-slate-700 dark:text-neutral-300 text-base leading-relaxed">
                2D Code Decoder: Decodes GS1 DataMatrix or QR standards, parsing GS1 Application Identifiers (AIs):

(01) Global Trade Item Number (GTIN)

(21) Unique Serial Number

(17) Expiration Date (YYMMDD)

(10) Lot / Batch Number

OCR Engine (e.g., Tesseract / TrOCR): Extracts human-readable text printed alongside the barcode (Brand name, active molecule, dosage strength like 500mg, and registration/DAR number).
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                2. Authentication & Cross-Verification
              </h3>
              <p className="text-slate-700 dark:text-neutral-300 text-base leading-relaxed">
                The parsed metadata passes through three validation layers:

Internal Consistency Check: Confirms whether the expiration date and batch number parsed from the 2D code match the OCR-extracted printed text on the package.

Regulatory Registry Lookup: Matches the GTIN/Brand/Registration number against national regulatory databases (DGDA, FDA NDC Directory) to confirm the license is active and genuine.

Serialization & Velocity Analysis: Checks the unique serial number against the manufacturer ledger. If the serial number has been scanned multiple times across conflicting geographic locations, the system flags a duplicate counterfeit warning.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                3. Clinical Intelligence Aggregation
              </h3>
              <p className="text-slate-700 dark:text-neutral-300 text-base leading-relaxed">
               Once the formulation is verified, the system queries structured clinical APIs (openFDA, DailyMed, RxNorm) using the resolved active ingredient and dosage:

Pulls verified therapeutic indications, usage instructions, side effects, and storage guidelines.

Flags high-risk warnings (e.g., pregnancy contraindications, severe allergic triggers, boxed warnings).
              </p>

            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                4. Verification Report & Actionable UI
              </h3>
              <p className="text-slate-700 dark:text-neutral-300 text-base leading-relaxed">
               Presents a consolidated status card to the user:

Authenticity Status: Verified Authentic, Suspicious/Unverified, Expired, or Counterfeit Alert.

Package Data: Verified brand, generic molecule, dosage, batch, and manufacturer.

Clinical Summary: Plain-language usage guide, key warnings, and an instant report button for regulatory submission if counterfeiting is suspected.
Pulls verified therapeutic indications, usage instructions, side effects, and storage guidelines.

Flags high-risk warnings (e.g., pregnancy contraindications, severe allergic triggers, boxed warnings).
              </p>
              
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}



