import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata = {
  title: "PathGen-AI | Developer Roadmaps",
  description: "AI-powered learning roadmaps and curated resources for developers. Like roadmap.sh, but generated instantly for any topic.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{ baseTheme: 'dark' }}>
      <html lang="en" className={inter.className}>
        <body className="flex flex-col min-h-screen bg-[#0a0a23] text-slate-100 antialiased selection:bg-indigo-500/30">
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
