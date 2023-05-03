import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Dashboard from "@/components/Dashboard";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Dashboard>
      <Component {...pageProps} />
    </Dashboard>
  );
}
