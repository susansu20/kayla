import type { Metadata } from "next";
import { Inter, Playfair_Display, Great_Vibes } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const vibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-vibes",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Happy Birthday, Kayla Wong 🎂",
  description:
    "A birthday tribute to Singapore's precision-driven property powerhouse.",
  openGraph: {
    title: "Happy Birthday, Kayla Wong 🎂",
    description:
      "A birthday tribute to Singapore's precision-driven property powerhouse.",
    images: ["/og.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Happy Birthday, Kayla Wong 🎂",
    description:
      "A birthday tribute to Singapore's precision-driven property powerhouse.",
    images: ["/og.png"],
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
      className={`${inter.variable} ${playfair.variable} ${vibes.variable}`}
    >
      <body className="bg-midnight text-ivory font-sans antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
