import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "600", "700", "800", "900"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "LinkedForge AI — High-Velocity Executive LinkedIn Engine",
  description:
    "Generate high-performing, high-ticket LinkedIn content in seconds. AI-powered executive ghostwriting engine engineered for 100k+ reach, authority, and lead pipeline.",
  keywords: [
    "LinkedIn",
    "AI content generator",
    "Executive ghostwriter",
    "Personal branding",
    "B2B SaaS growth",
  ],
  authors: [{ name: "LinkedForge AI" }],
  creator: "LinkedForge AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://linkedforge.ai",
    title: "LinkedForge AI — High-Velocity Executive LinkedIn Engine",
    description:
      "Generate high-performing LinkedIn content in seconds with 20-year executive frameworks.",
    siteName: "LinkedForge AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkedForge AI — High-Velocity Executive LinkedIn Engine",
    description:
      "Generate high-performing LinkedIn content in seconds with 20-year executive frameworks.",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://linkedforge.ai"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-[#030306] text-white antialiased font-sans selection:bg-red-600 selection:text-white">
        <Providers>
          {children}
          <Toaster richColors position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
