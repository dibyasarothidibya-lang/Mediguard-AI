import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MediGuard AI | Intelligent Medicine Verification & Safety Assistant",
  description:
    "Evidence-grounded medicine verification and information platform. Decode GS1 barcodes, inspect packaging labels, and cross-reference pharmaceutical records against openFDA and DGDA-aligned catalogues.",
  keywords: [
    "medicine verification",
    "drug safety",
    "pharmaceutical cross-referencing",
    "GS1 DataMatrix",
    "packaging OCR",
    "MediGuard AI",
  ],
  authors: [{ name: "MediGuard AI Team" }],
  openGraph: {
    title: "MediGuard AI | Intelligent Medicine Verification & Safety Assistant",
    description:
      "Cross-reference medicine records against openFDA evidence and DGDA-aligned catalogues with grounded AI explanations.",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo-icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className="h-full antialiased font-sans"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Roboto+Mono:wght@400;500;700&display=swap"
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(function(){try{localStorage.removeItem("theme");document.documentElement.setAttribute("data-theme","light");document.documentElement.classList.remove("dark");}catch(e){}})()',
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground selection:bg-slate-900 selection:text-white">{children}</body>
    </html>
  );
}
