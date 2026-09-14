import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

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
      className={`${roboto.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(function(){try{var s=localStorage.getItem("theme");var t=s==="light"||s==="dark"?s:window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","light")}})()',
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground selection:bg-indigo-500 selection:text-white">{children}</body>
    </html>
  );
}
