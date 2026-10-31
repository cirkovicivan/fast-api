import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Apex Real-Time Database Benchmarking & Performance Analytics",
  description:
    "Compare query performance, execution latency, and throughput between Redis and PostgreSQL in real-time with millisecond precision.",
  keywords: [
    "database benchmarking",
    "Redis vs PostgreSQL",
    "performance metrics",
    "latency analysis",
    "FastAPI",
    "Next.js",
  ],
  authors: [{ name: "Ivan Ćirković" }],
  openGraph: {
    title: "Apex — Real-Time Database Benchmarking",
    description:
      "Analyze real-time execution metrics and latency comparisons between Redis and PostgreSQL.",
    url: "https://your-domain.com",
    siteName: "Apex",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Apex — Real-Time Database Benchmarking",
    description:
      "Compare query performance and execution latency between Redis and PostgreSQL instantly.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-mono", jetbrainsMono.variable)}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
