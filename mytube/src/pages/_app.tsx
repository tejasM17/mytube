import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "../lib/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import { Home, Compass, PlaySquare } from "lucide-react";
import { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <UserProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Header onMenuClick={() => setMobileSidebarOpen((open) => !open)} />
          <Toaster />
          <div className="flex min-w-0">
            <Sidebar mobileOpen={mobileSidebarOpen} onNavigate={() => setMobileSidebarOpen(false)} />
            <div className="min-w-0 flex-1 pb-16 md:pb-0"><Component {...pageProps} /></div>
          </div>
          <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t bg-background/95 py-2 backdrop-blur md:hidden" aria-label="Main navigation">
            <Link href="/" className="flex flex-col items-center gap-1 text-xs"><Home className="h-5 w-5" />Home</Link>
            <Link href="/explore" className="flex flex-col items-center gap-1 text-xs"><Compass className="h-5 w-5" />Explore</Link>
            <Link href="/subscriptions" className="flex flex-col items-center gap-1 text-xs"><PlaySquare className="h-5 w-5" />Subscriptions</Link>
          </nav>
        </div>
      </UserProvider>
    </ThemeProvider>
  );
}
