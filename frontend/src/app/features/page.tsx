export default function Features() {
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
              Mediguard AI Features
            </span>

            <h1 className="text-slate-900 dark:text-white text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
             Mediguard AI Features
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
              src="/features1.jpeg"
              alt="Features page image"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
        
        <section className="rounded-3xl border border-amber-300 bg-amber-50 p-8 sm:p-10 dark:border-amber-900 dark:bg-amber-950/30">
          <span className="mb-3 block text-sm font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-400"/>
            Mediguard Features

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
               1. Multi-Standard Data Carrier Scanning
              </h3>
              <p className="text-slate-700 dark:text-neutral-300 text-base leading-relaxed">
                High-speed decoding of GS1 DataMatrix, standard 2D QR codes, and 1D EAN/UPC linear barcodes.Instant extraction of GS1 Application Identifiers including GTIN (01), Serial Number (21), Expiration Date (17), and Batch/Lot Number (10).  Hardware-accelerated client-side processing with sub-50ms capture latency.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                2. Vision-Powered Packaging Inspection & OCR
              </h3>
              <p className="text-slate-700 dark:text-neutral-300 text-base leading-relaxed">
                Automated perspective correction and glare removal across curved, reflective, or blister-pack surfaces.

Multimodal optical character recognition (OCR) extracting printed brand names, active molecules, dosage strengths (e.g., 500mg), and regulatory registration (DAR) codes.

Visual anomaly detection to flag tampered typography, missing safety seals, or inconsistent manufacturer packaging styles.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                3. Dual-Stream Verification & Cross-Reconciliation
              </h3>
              <p className="text-slate-700 dark:text-neutral-300 text-base leading-relaxed">
               Real-time cross-checking of physical printed packaging data against the digital barcode payload.

Immediate red-flagging of batch/expiry mismatches (e.g., printed expiration date differing from the encoded GS1 payload).

Serialization anomaly checks to identify duplicate scans and potential cloned packaging vectors.
              </p>

            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                4. Direct Regulatory Registry Synchronization
              </h3>
              <p className="text-slate-700 dark:text-neutral-300 text-base leading-relaxed">
               Live verification against national and global pharmaceutical registries (Directorate General of Drug Administration, US FDA NDC Directory, and DailyMed).

Real-time confirmation of market authorization status, licensed manufacturer identity, and current registration validity.
              </p>
              
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                5. Clinical Drug Intelligence Aggregation
              </h3>
              <p className="text-slate-700 dark:text-neutral-300 text-base leading-relaxed">
               Automated mapping of active ingredients via RxNorm and openFDA endpoints.

Plain-language breakdown of therapeutic indications, proper dosage guidelines, common side effects, and storage conditions.

High-risk warnings for contraindications, active ingredient interactions, pregnancy advisories, and official boxed warnings.
Real-time confirmation of market authorization status, licensed manufacturer identity, and current registration validity.
              </p>
              
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                6. Automated Expiration & Counterfeit Alerts
              </h3>
              <p className="text-slate-700 dark:text-neutral-300 text-base leading-relaxed">
               Dynamic date evaluation flagging expired medications before dispensing or consumption.

Instant incident reporting flow allowing users to submit flagged packaging evidence and geo-tagged scan anomalies directly for regulatory review.
              </p>
              
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}



