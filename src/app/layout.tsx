import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from 'next/font/local'
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./provider";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-sans",
})

const typoDraft = localFont({ src: '../Typo-Draft.otf', variable: "--font-typo-draft" })

export const metadata: Metadata = {
  title: "Sketcher",
  description: "turn your 2d keyboard sketchs into 3d models and circuit boards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(poppins.variable, typoDraft.variable)}>
        <SpeedInsights />
        <Analytics />
        <Providers>
          {children}
        </Providers>
        <Toaster expand={false} richColors />
      </body>
    </html>
  );
}
