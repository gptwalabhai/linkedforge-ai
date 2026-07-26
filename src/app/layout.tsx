import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "LinkedForge AI - AI-powered LinkedIn Content Generator",
  description:
    "Generate high-performing LinkedIn content in seconds. AI-powered content generation optimized for engagement, personal branding, lead generation and authority building.",
  keywords: [
    "LinkedIn",
    "AI content generator",
    "LinkedIn posts",
    "content marketing",
    "personal branding",
    "social media AI",
  ],
  authors: [{ name: "LinkedForge AI" }],
  creator: "LinkedForge AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://linkedforge.ai",
    title: "LinkedForge AI - AI-powered LinkedIn Content Generator",
    description:
      "Generate high-performing LinkedIn content in seconds with AI.",
    siteName: "LinkedForge AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkedForge AI - AI-powered LinkedIn Content Generator",
    description:
      "Generate high-performing LinkedIn content in seconds with AI.",
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
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <Providers>
          {children}
          <Toaster richColors position="bottom-right" />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
