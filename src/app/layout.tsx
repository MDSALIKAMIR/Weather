import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Isobar — Premium Weather Platform",
  description:
    "Track past, present, and future weather with live data from Open-Meteo — historical archives, hourly forecasts, air quality, and 16-day outlooks in one instrument-grade dashboard.",
  keywords: ["weather", "forecast", "historical weather", "air quality", "open-meteo"],
  openGraph: {
    title: "Isobar — Premium Weather Platform",
    description:
      "Past, present, and future weather in one dashboard — live Open-Meteo data, historical archives, and 16-day forecasts.",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  themeColor: "#0a0e17",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <AppProvider>
          <Sidebar />
          <div className="lg:pl-60">
            <Header />
            <main className="min-h-[calc(100dvh-4rem)] px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-10">
              {children}
            </main>
          </div>
          <MobileNav />
        </AppProvider>
      </body>
    </html>
  );
}
