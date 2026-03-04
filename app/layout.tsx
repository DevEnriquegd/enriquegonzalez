import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Providers from "../components/providers";

const _inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Enrique Gonzalez | Data Analyst & Business Intelligence",
  description:
    "Portfolio profesional de Data Analyst | Business Intelligence. Desarrollo soluciones de análisis, integración y visualización de datos con Python, SQL y Power BI para optimizar decisiones empresariales.",

  icons: {
    icon: [
      {
        url: "/icon.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
