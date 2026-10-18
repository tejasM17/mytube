import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen bg-white text-black">
      <Header />
      <div className="flex min-h-[calc(100vh-52px)]">
        <Sidebar />
        <Component {...pageProps} />
      </div>
    </div>
  );
}
