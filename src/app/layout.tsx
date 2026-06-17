import type { Metadata } from "next";
import { Fredoka, Quicksand } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({ 
  subsets: ["latin"], 
  variable: "--font-fredoka",
  weight: ["400", "500", "600", "700"]
});

const quicksand = Quicksand({ 
  subsets: ["latin"], 
  variable: "--font-quicksand",
  weight: ["400", "500", "600", "700"] 
});

export const metadata: Metadata = {
  title: "Happy Birthday Aini! 💙",
  description: "Special birthday gift for Aini",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fredoka.variable} ${quicksand.variable} font-sans bg-sky-50 text-slate-800 overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}