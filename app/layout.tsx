import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dharti Aaba Veer Birsa Munda Jayanti 2026 | Ramp Walk Registration",
  description:
    "Official registration and delegate portal for the Dharti Aaba Veer Birsa Munda Jayanti 2026 Ramp Walk Competition (Miss & Mr Rourkela 2026 Auditions).",
  keywords: [
    "Birsa Munda Jayanti 2026",
    "Dharti Aaba",
    "Ramp Walk",
    "Miss Rourkela",
    "Mr Rourkela",
    "Tribal Fashion",
    "Tribal Heritage",
    "Registration",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-800 selection:bg-[#900C22] selection:text-white">
        {children}
      </body>
    </html>
  );
}
