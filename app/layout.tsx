import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/ui/CustomCursor";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "GitHub Wrapped - Your Year in Code",
  description:
    "Discover your GitHub story. A beautiful, Spotify Wrapped-style summary of your coding year.",
  keywords: ["GitHub", "Wrapped", "Year in Review", "Developer Stats", "Coding"],
  authors: [{ name: "GitHub Wrapped" }],
  openGraph: {
    title: "GitHub Wrapped - Your Year in Code",
    description:
      "Discover your GitHub story. A beautiful visualization of your coding year.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GitHub Wrapped - Your Year in Code",
    description:
      "Discover your GitHub story. A beautiful visualization of your coding year.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-github-darker font-sans antialiased cursor-none">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
