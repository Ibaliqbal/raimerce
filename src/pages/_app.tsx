import TopLoader from "@/components/loader/toploader";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "@smastrom/react-rating/style.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { Roboto } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { LoadingScreenProvider } from "@/context/loading-screen-context";

const roboto = Roboto({
  weight: "500",
  subsets: ["latin", "cyrillic"],
  style: ["normal"],
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
          <LoadingScreenProvider>
            <main className={roboto.className}>
              <TopLoader />
              <Component {...pageProps} />
              <Toaster position="bottom-center" />
            </main>
          </LoadingScreenProvider>
          <ReactQueryDevtools />
        </SessionProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
