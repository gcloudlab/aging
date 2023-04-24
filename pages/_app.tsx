import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { Provider as RWBProvider } from "react-wrap-balancer";
import cx from "classnames";
import { SessionProvider } from "next-auth/react";
import localFont from "next/font/local";
import { Inter } from "next/font/google";

const clash = localFont({
  src: "../styles/ClashDisplay-Semibold.otf",
  variable: "--font-clash",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <main className={cx(clash.variable, inter.variable)}>
        <Component {...pageProps} />
      </main>
      <Analytics />
    </SessionProvider>
  );
}
