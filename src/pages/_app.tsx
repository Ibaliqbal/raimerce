import TopLoader from "@/components/loader/toploader";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "sonner";
import "@smastrom/react-rating/style.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { SessionProvider } from "next-auth/react";

const poppins = Poppins({
  weight: "500",
  style: "normal",
  subsets: ["latin"],
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [client] = useState(new QueryClient());
  return (
    <ThemeProvider defaultTheme="system" attribute="class" enableSystem>
      <QueryClientProvider client={client}>
        <SessionProvider session={session}>
          <main className={poppins.className}>
            <TopLoader />
            <Component {...pageProps} />
            <Toaster richColors position="bottom-center" closeButton />
          </main>
          <ReactQueryDevtools />
        </SessionProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
